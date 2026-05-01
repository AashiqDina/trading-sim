import { useState, useEffect} from 'react'
import './Loading.css'

type props = {
    scale?: number
    top?: number
    marginBottom?: number
    height?: number
}

export default function Loading({scale, top, marginBottom, height}: props){
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [dots, setDots] = useState<string>(".") 

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!scale){
                setShowMessage(true)
            }
        }, 5000);

       return () => clearTimeout(timeout)
    }, [scale])

    useEffect(() => {
        if(!showMessage) return

            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? "." : prev + ".")
            }, 1000)

            return () => clearInterval(interval)

    }, [showMessage])

    return (
        <>
            <div aria-label='Loading Content' data-testid="loading" style={{ transform: `scale(${scale || 1})`, marginBottom: `${marginBottom || 0.7}rem`, height: `${height || "85"}vh` }} role="status" aria-live="polite" className='BarContainer'>
                <div className='BarA'></div>
                <div className='BarB'></div>
                <div className='BarC'></div>
                <div className='BarD'></div>
                <div className='BarE'></div>
                <p className='LongLoadingMessage' style={showMessage ? {opacity: 1, top: `${top || 17}rem`} : {opacity: 0}}>This app uses on-demand hosting, so the first request may take a minute{dots}</p>
            </div>
        </>
    )
}