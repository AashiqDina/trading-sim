import './Logo.css';

export default function Logo(){
    return (
        <div data-testid="SiteLogo" className='TheLogo'>
            <div className='BarCollection'>
                <div className='BarOne'></div>
                <div className='BarTwo'></div>
                <div className='BarThree'></div>
                <div className='BarFour'></div>
                <div className='BarFive'></div>
            </div>
            <h2>TradeSim</h2>
        </div>
    )
}