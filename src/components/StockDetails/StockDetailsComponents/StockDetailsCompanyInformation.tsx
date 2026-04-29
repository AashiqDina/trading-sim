import { useEffect, useState } from "react"
import { CompanyProfile } from "../../../interfaces/interfaces";
import Loading from "../../Loading/Loading";
import { useStockDetailsInfo } from "../../../hooks/stockDetails/useStockDetailsInfo";

type Props = {
  symbol: string
  handleError: (err: unknown) => void
}

export default function CompanyInformation({ symbol, handleError }: Props){
  
  const [descSeeMore, setdescSeeMore] = useState(false)
  const { infoLoading, companyInformation, fetchStocksInfo } = useStockDetailsInfo({symbol: symbol, handleError: handleError})

  useEffect(() => {
    fetchStocksInfo()
  }, [fetchStocksInfo])

  if(infoLoading) return <Loading scale={0.8}/>
  
  let modArray = undefined
  if(companyInformation){
    modArray = companyInformation.description.slice(0, 250)
  } 

  const companyFields: { label: string; value?: keyof CompanyProfile; custom?: (c: CompanyProfile) => string }[] = [
    { label: "Exchange", value: "exchange" },
    { label: "Industry", value: "industry" },
    { label: "Sector", value: "sector" },
    { label: "Type", value: "type" },
    { label: "CEO", value: "ceo" },
    { label: "Employees", value: "employees" },
    { label: "Website", value: "website" },
    { label: "Phone", value: "phone" },
    {
      label: "Address",
      custom: (c) =>
        `${c.address ?? ""}, ${c.city ?? ""}, ${c.state ?? ""} ${c.zip ?? ""}, ${c.country ?? ""}`,
    },
  ];

  

    return (
      <>
      <article className='CompanyInfoDisplayed'>
        <div className="Desc">
            {companyInformation && <h2>Description</h2>}
            {companyInformation ? (
              <>
                {descSeeMore 
                  ? companyInformation.description 
                  : `${modArray}...`}
                {companyInformation.description.length > 250 && (
                  <span
                    style={{color: '#45a049', cursor: 'pointer', marginLeft: '4px'}}
                    onClick={() => setdescSeeMore(!descSeeMore)}
                  >
                    {descSeeMore ? 'See less.' : 'See more.'}
                  </span>
                )}
              </>
            ) : symbol === "AAPL" ? (
              "An Error has Occurred"
            ) : (
              "Due to restrictions in the Twelve Data API’s free tier, this section’s data is only available for Apple."
            )}
          </div>
          <div className="CompInfoTable">
            {companyFields.map((field, i) => (
              <div key={i} className="Row">
                <h4>{field.label}</h4>
                {field.label != "Website" && <p>
                  {field.value
                    ? companyInformation?.[field.value] ?? "—"
                    : companyInformation ? field.custom?.(companyInformation) : "—"}
                </p>}
                {field.label == "Website" && <a>
                    {field.value ? companyInformation?.[field.value] : undefined}
                </a>}
              </div>
            ))}
          </div>
      </article>
    </>
    )
}