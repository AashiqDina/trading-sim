import { useEffect, useRef, useState } from "react";
import AiLoading from "../../Loading/AiLoading";
import React from "react";
import './HomeSearch.css'
import { Suggestion, stockList } from "../../../types/types";

type Props = {
    stockList: stockList
    searchStock: (symbol: string) => void;
};

const HomeSearch = ({ stockList, searchStock}: Props) => {

    const [stockSymbol, setStockSymbol] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [displaySuggestions, setDisplaySuggestions] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);
        
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const clickedOnInput = inputRef.current?.contains(target);
            const clickedOnSuggestion = suggestionRefs.current.some(
                (btn) => btn?.contains(target)
            );

            if (!clickedOnInput && !clickedOnSuggestion) {
                setDisplaySuggestions(false);
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    

    const handleSuggestions = (InputSymbol: string) => {
        setStockSymbol(InputSymbol.toUpperCase())

        if(!InputSymbol){
            setSuggestions([]);
            return;
        } 

        if(!stockList) return;


        const matches = (Object.entries(stockList) as [string, { symbol: string; logo: string }][])
            .map(([name, stock]) => {
                let score = 0;
                if (stock.symbol.toLowerCase() === InputSymbol) score = 100;
                else if (name.toLowerCase() === InputSymbol) score = 90;
                else if (name.toLowerCase().startsWith(InputSymbol)) score = 80;
                else if (stock.symbol.toLowerCase().startsWith(InputSymbol)) score = 70;
                else if (name.toLowerCase().includes(InputSymbol)) score = 60;
                else if (stock.symbol.toLowerCase().includes(InputSymbol)) score = 50;

                return { name, symbol: stock.symbol, logo: stock.logo, score };
            })
            .filter((match) => match.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        setSuggestions(matches);
    }
    
    return (
        <section className='SearchAndResult'>
            <section className='StockSearch'>
              <section className='SearchSection'>
                <input 
                  aria-label="Search by stock name or symbol (e.g. AAPL or Apple)"
                  type="text" 
                  placeholder="Search by stock name or symbol (e.g. AAPL or Apple)" 
                  className='StockSearchInput'
                  value={stockSymbol}
                  ref={inputRef}
                  onChange={(e) => {
                    handleSuggestions(e.target.value.toLowerCase())
                  }} 
                onFocus={() => setDisplaySuggestions(true)}
        
                onKeyDown={(e) => {
                if(e.key === "Enter") {
                // Search whatever is typed
                searchStock(stockSymbol);
                } else if (e.key === "ArrowDown") {
                e.preventDefault();
                // Move focus to first suggestion
                if(suggestionRefs.current[0]) suggestionRefs.current[0].focus();
                }
            }}
              />
                <button aria-label={`Search for ${stockSymbol}`} className='StockSearchButton' onClick={() => {searchStock(stockSymbol)}}>Search</button>
              </section>
                {displaySuggestions && suggestions && suggestions.length !== 0 && stockSymbol.length > 0 && <section className='SearchSuggestions' data-testid="SearchSuggestions">
                 {suggestions.map((suggestion, index) => 
                    suggestion.symbol ? (
                    <button 
                        key={suggestion.symbol} 
                        onClick={() => {searchStock(suggestion.symbol)}} 
                        style={(suggestions.length == 1) ? {margin: "0.5rem 0.5rem 0.5rem 0.5rem"} : (index == suggestions.length-1) ? {margin: "0rem 0.5rem 0.5rem 0.5rem"} : (index == 0) ? {margin: "0.5rem 0.5rem 0rem 0.5rem"} : {}}
                        ref={(el) => {suggestionRefs.current[index] = el;}}
                        role="option"
                        onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            suggestionRefs.current[index + 1]?.focus();
                        } 
                        else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            if(index === 0) {
                                inputRef.current?.focus(); 
                            } 
                            else {
                                suggestionRefs.current[index - 1]?.focus();
                            }
                        }
                        }}
                        >
                            <img src={suggestion.logo} alt="" />
                            <h4>{suggestion.name}<span className='suggestionSymbol'>{suggestion.symbol}</span></h4>
                    </button>) : (<AiLoading/>)
                )}
              </section>}
            </section>
        </section>
    )
}

export default React.memo(HomeSearch);