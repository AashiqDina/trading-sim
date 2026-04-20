import React, { useCallback, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './StockDetail.css';
import { useAuth } from "../../auth/AuthContext";
import CompanyInformation from './StockDetailsComponents/StockDetailsCompanyInformation'
import StockDetails from './StockDetailsComponents/StockDetailsStockData'
import StockDetailsOwnedStocks from './StockDetailsComponents/StockDetailsOwnedStocks';
import StockDetailsNews from './StockDetailsComponents/StockDetailsNews';
import { FocusTrap } from 'focus-trap-react';
import Confetti from 'react-confetti';
import StockDetailsOverview from './StockDetailsComponents/StockDetailsOverview';
import { useStockDetails } from '../../hooks/useStockDetails';
import ErrorPopup from '../../error/ErrorPopup';
import { DisplayedDataType } from '../../types/types';
import StockDetailsHeader from './StockDetailsComponents/StockDetailsHeader';
import BuyStockModal from './StockDetailsComponents/BuyStockModal';
import Loading from '../Loading/Loading';
import { ApiError } from '../../error/ApiError';

const StockDetail: React.FC = () => {

  const { user } = useAuth();
  const { symbol } = useParams();
  const { state } = useLocation()
  const stockSymbol = decodeURIComponent(symbol ?? '');

  const [DisplayedData, setDisplayedData] = useState<DisplayedDataType>("Overview")
  const [errorCode, setErrorCode] = useState<number | null>(null)

  const handleError = useCallback((err: unknown) => {
    if(err instanceof ApiError) setErrorCode(err.code)
    else setErrorCode(-1)
  }, []);

  const { baseLoading, stockName, stockLogo, showConfetti, buyModalOpen, handlebuyStock, changeBuyModal } = useStockDetails({userId: user?.id, stockSymbol: stockSymbol, handleError: handleError})

  const componentObj = {
    Overview: (
      <StockDetailsOverview
        symbol={stockSymbol}
        handleError={handleError}
      />
    ),
    CompanyInformation: (
      <CompanyInformation
        symbol={stockSymbol}
        handleError={handleError}
      />
    ),
    StockData: (
      <StockDetails
        symbol={stockSymbol}
        stockPrice={state?.stockPrice}
        handleError={handleError}
      />
    ),
    OwnedStocks: (
      <StockDetailsOwnedStocks 
        user={user?.id}
        symbol={stockSymbol}
        handleError={handleError}
      />
    ),
    News: (
      <StockDetailsNews 
        symbol={stockSymbol}
        handleError={handleError}
      />
    ),
  };

  if(baseLoading) return ( <Loading scale={0.8}/> )

  function switchSection(Section: DisplayedDataType) {
    setDisplayedData(Section)
  }

  return (
    <>
      {showConfetti && 
        <Confetti
          numberOfPieces={(500)}
          recycle={false}
        />
        }

        <StockDetailsHeader
          stockLogo={stockLogo}
          stockName={stockName}
          stockSymbol={stockSymbol}
          stockPrice={state?.stockPrice}
          DisplayedData={DisplayedData}
          userExists={!!user}
          switchSection={switchSection}
          changeBuyModal={changeBuyModal}
        />

        <section className='MainBody'>
            <div className='StockDetails'>
              {componentObj[DisplayedData] ?? null}    
            </div>
        </section>

        {!errorCode && buyModalOpen && <BuyStockModal
          stockName={stockName}
          stockLogo={stockLogo}
          stockSymbol={stockSymbol}
          stockPrice={state?.stockPrice}
          handlebuyStock={handlebuyStock}
          changeBuyModal={changeBuyModal}
        />    
        }

        {errorCode &&
          <FocusTrap>
              <ErrorPopup 
                ErrorCode={errorCode}
                Confirm={() => {setErrorCode(null)}}
                />
          </FocusTrap>
        }
    </>
  );
};

export default StockDetail;
