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
import { useEffect, useRef, useState } from "react"
import "./StockDetailsOverview.css"
import FormatNumber from "../../../utils/FormatNumber";
import Loading from "../../Loading/Loading";
import { useStockDetailsOverview } from "../../../hooks/stockDetails/useStockDetailsOverview";

ChartJS.register(LineElement, LineController, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

type StockDataPoint = {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type props = {
    symbol: string | undefined
    handleError: (err: unknown) => void
}

export default function StockDetailsOverview({ symbol, handleError }: props){
    
    const { overviewLoading, history, getHistory, filterHistory } = useStockDetailsOverview({symbol: symbol, handleError: handleError})

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<ChartJS | null>(null);
    const [range, setRange] = useState<string>("all")
    const [hoverValue, setHoverValue] = useState<StockDataPoint | null>(null);

    useEffect(() => {
        getHistory()
    }, [getHistory])

    useEffect(() => {
        if (!canvasRef.current || !history) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new ChartJS(ctx, {
            type: "line",
            data: {
                labels: history.map((entry: StockDataPoint) => entry.datetime),
                datasets: [
                    {
                        label: "Close",
                        data: history.map((entry: StockDataPoint) => ({
                            x: new Date(entry.datetime).getTime(),
                            y: entry.close,
                            full: entry,
                        })),
                        borderColor: "#45a049ff",
                        backgroundColor: "#45a049ff",
                        fill: false,
                        pointRadius: 0,
                    },
                    {
                        label: "Volume",
                        data: history.map((entry: StockDataPoint) => ({
                            x: new Date(entry.datetime).getTime(),
                            y: entry.volume,
                            full: entry,
                        })),
                        borderColor: "#3e914440",
                        backgroundColor: "#3e914440",
                        fill: true,
                        pointRadius: 0,
                        hidden: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: "index",
                        enabled: false,
                        external: (context) => {
                            const tooltip = context.tooltip;
                            if (!tooltip || !tooltip.dataPoints || tooltip.dataPoints.length === 0) return;
                                
                                const dataPoint = tooltip.dataPoints[0];
                                const raw = dataPoint.raw as { x: string; y: number; full: StockDataPoint };
                                let xValue = "";

                                tooltip.dataPoints.forEach((dataPoint) => {
                                    xValue = dataPoint.label as string;
                                    let xValueDate = new Date(xValue);
                                    let formated = xValueDate.toISOString().split("T")[0];
                                    xValue = String(formated)


                                });
                                setHoverValue(raw.full);
                            },
                        },
                    },
                interaction: { mode: "index", intersect: false },
                scales: {
                    x: { display: false },
                    y: { display: false },
                },
            },
        });

        return () => chartRef.current?.destroy();

    }, [history]);

    function filterHistoryGraph(timeframe: "all" | "threeYears" | "year" | "threeMonths" | "month" | "week"): void {
        setRange(timeframe)
        filterHistory(timeframe)
    }

    if(overviewLoading) return <Loading scale={0.8}/>

    if(!history || history.length === 0) return (
        <div>
            <h2>Historical data not available</h2>
        </div>
    )

    return (
        <>
            <article  aria-live="polite" aria-label={`Stock Data from Graph Point`} className='StocksGraph'>
                <div className="StockGraphValues">
                    <div>
                        {hoverValue && <h3>Date</h3>}
                        {
                            hoverValue === null ? <h2>Hover to see value</h2> :   
                            <h2>{hoverValue?.datetime.split("T")[0]}</h2>
                        }
                    </div>
                    {hoverValue?.open && <div>
                        <h3>Open</h3>
                        <h2>{hoverValue.open.toFixed(2)}</h2>
                    </div>}
                    {hoverValue?.close && <div>
                        <h3>Close</h3>
                        <h2>{hoverValue.close}</h2>
                    </div>}
                    {hoverValue?.volume && <div>
                        <h3>Volume</h3>
                        <h2>{FormatNumber(hoverValue.volume)}</h2>
                    </div>}
                    {hoverValue?.high && hoverValue?.low && <div>
                        <h3>Range</h3>
                        <h2>{`${hoverValue.high.toFixed(2)} - ${hoverValue.low.toFixed(2)}`}</h2>
                    </div>}
                </div>
                <div className="StockIndivdualGraph">
                    <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="A line chart showing the stock's performance over time"></canvas>
                </div>
                <div className="StockGraphButtonCollection">
                    <button aria-label="filter to the last week" className="w" onClick={() => {filterHistoryGraph("week")}} style={range == "week" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>Week</button>
                    <button aria-label="filter to the last month" className="m" onClick={() => {filterHistoryGraph("month")}} style={range == "month" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>Month</button>
                    <button aria-label="filter to the last three months" className="threem" onClick={() => {filterHistoryGraph("threeMonths")}} style={range == "threeMonths" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>3-Months</button>
                    <button aria-label="filter to the last year" className="y" onClick={() => {filterHistoryGraph("year")}} style={range == "year" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>Year</button>
                    <button aria-label="filter to the last three years" className="threey" onClick={() => {filterHistoryGraph("threeYears")}} style={range == "threeYears" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>3-Years</button>
                    <button aria-label="filter to all time" className="a" onClick={() => {filterHistoryGraph("all")}} style={range == "all" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>All Time</button>
                </div>
            </article>
        </>
    )
}