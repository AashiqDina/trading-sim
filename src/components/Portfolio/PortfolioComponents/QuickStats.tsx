import {
  Chart as ChartJS,
  LineElement,
  LineController,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { useRef, useEffect, useState } from "react";
import { PortfolioStock, StockHistoryItem } from "../../../types/types";

ChartJS.register(LineElement, LineController, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

type props = {
    fullHistory: StockHistoryItem[] | null,
    history: StockHistoryItem[] | null,
    filterHistory: string,
    visibleStocks: PortfolioStock[]
    setFilterHistory: Dispatch<SetStateAction<string>>,
    setHoverValues: Dispatch<SetStateAction<{ invested: number; value: number; profit: number; } | null>>
}


function QuickStats({history, fullHistory, filterHistory, visibleStocks, setFilterHistory, setHoverValues}: props){

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<ChartJS | null>(null);
    const [hoverValue, setHoverValue] = useState<string | null>(null);
    
    const stockMap = useMemo(() => {
        if (!fullHistory) return new Map();
        return new Map(fullHistory.map(s => [s.stockId, s]));
    }, [fullHistory]);

    const visibleStockIds = useMemo(() => {
        return new Set(visibleStocks.map(s => s.id));
        }, [visibleStocks]);
    
    const graphData = useMemo(() => {
        if (!fullHistory || !history || visibleStocks.length === 0) {
            return { invested: [], value: [] };
        }

        const investedByDate: Record<string, number> = {};
        const valueByDate: Record<string, number> = {};


        history.forEach(stockHistory => {
            if (!visibleStockIds.has(stockHistory.stockId)) return;
            const fullStock = stockMap.get(stockHistory.stockId);
            
            if (!fullStock) return;

            const firstInv = fullStock.history[0];
            const investedAmount = firstInv.price * firstInv.quantity;

            stockHistory.history.forEach(tx => {
                const date = tx.timestamp.split("T")[0];
                const amount = tx.price * tx.quantity;

                investedByDate[date] =
                    (investedByDate[date] || 0) + investedAmount;

                valueByDate[date] =
                    (valueByDate[date] || 0) + amount;
            });
        });


        const allDates = Array.from(
            new Set([
                ...Object.keys(investedByDate),
                ...Object.keys(valueByDate)
            ])
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        let investedValue = 0;
        let valueValue = 0;

        const invested = [];
        const value = [];

        for (const date of allDates) {

            if (investedByDate[date] !== undefined) {
                investedValue = investedByDate[date];
            }

            if (valueByDate[date] !== undefined) {
                valueValue = valueByDate[date];
            }

            invested.push({
                date,
                invested: investedValue
            });

            value.push({
                date,
                value: valueValue
            });
        }

        return { invested, value };

    }, [history, visibleStocks, fullHistory]);


    useEffect(() => {
        if (!canvasRef.current) return;


        const ctx = canvasRef.current!.getContext("2d");
        if (!ctx) return;

        chartRef.current?.destroy();

        chartRef.current = new ChartJS(ctx, {
            type: "line",
            data: {
                labels: graphData.value.map((e: { date: string; }) => e.date),
                datasets: [
                    {
                        label: "Invested",
                        data: graphData.invested.map((e: { invested: number; }) => e.invested),
                        borderColor: "#45a049ff",
                        pointRadius: 0
                    },
                    {
                        label: "Portfolio Value",
                        data: graphData.value.map((e: { value: number; }) => e.value),
                        borderColor: "green",
                        pointRadius: 0
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    tooltip: {
                        enabled: false,
                        external: (context) => {
                            const tooltip = context.tooltip;
                            if (!tooltip?.dataPoints?.length) return;

                            let invested = 0;
                            let value = 0;
                            let date = "";

                            tooltip.dataPoints.forEach(dp => {
                                if (dp.dataset.label === "Invested") invested = dp.parsed.y;
                                if (dp.dataset.label === "Portfolio Value") value = dp.parsed.y;
                                date = dp.label as string;
                            });

                            setHoverValues({
                                invested,
                                value,
                                profit: value - invested
                            });

                            setHoverValue(date);
                        }
                    }
                },
                interaction: { mode: "index", intersect: false },
                scales: { x: { display: false }, y: { display: true } },
                layout: {
                    padding: 0
                    },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });

    }, [graphData, setHoverValues]);


    return (
        <>
            <section className="StocksAverageGraph">
                <h2>{hoverValue ? `${hoverValue.toLocaleString()}` : "Hover to see value"}</h2>
                <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="A line chart showing your portfolio's performance over time"></canvas>
            </section>
            <section className="FilterGraph">
                <article>
                    <button aria-label="Fitler graph to this week" className="w" style={filterHistory == "week" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => setFilterHistory("week")}>Week</button>
                    <button aria-label="Fitler graph to this month" className="m" style={filterHistory == "month" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => setFilterHistory("month")}>Month</button>
                    <button aria-label="Fitler graph to this year" className="y" style={filterHistory == "year" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => setFilterHistory("year")}>Year</button>
                    <button aria-label="Fitler graph to this all time" className="a" style={filterHistory == "all" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => setFilterHistory("all")}>All</button>
                </article>
            </section>
        </>
    )
}

export default React.memo(QuickStats)
