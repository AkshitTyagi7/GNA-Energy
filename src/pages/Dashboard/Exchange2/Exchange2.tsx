import React, { useEffect, useState } from "react";
import './Exchange.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { DemoExchangeData, DemoExchangeData2, DemoExchangeData3, FinalDemoData } from "../Exchange/DemoExchangeData";
import { PrimaryColor, SecondaryColor, QuaternaryColor } from "../../../common";
import { COST_UNIT } from "../../../Units";
import { ExchangeData, FormatExchangeData } from "./FormatData";
import { MediumButton, SmallButton } from "../../../components/Button";
import { ExchangeChart } from "./Chart";

const ApiData = FinalDemoData

export default function ReCharts2() {
  const maxDate = new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000));
  const [date, setDate] = useState(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000)));

  const [selectedProductIndex, setSelectedProductIndex] = useState<number[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [iexData, setIexData] = useState<ExchangeData>(
    {
      dam: [],
      gdam: [],
      rtm: [],
      hpdam: [],
    }
  );
  const [hpxData, setHpxData] = useState<ExchangeData>(
    {
      dam: [],
      gdam: [],
      rtm: [],
      hpdam: [],
    }
  );
  const [pxilData, setPxilData] = useState<ExchangeData>(
    {
      dam: [],
      gdam: [],
      rtm: [],
      hpdam: [],
    }
  );

  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)));

  useEffect(() => {
    fetchExchangeData(
      {
        start_date: startDate,
        end_date: endDate,
      }
    );
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex mt-4 space-x-3 h-10">
          <MediumButton buttonTitle="By Exchange" isActive={pageIndex === 0} onClick={() => setPageIndex(0)} />
          <MediumButton buttonTitle="By Product" isActive={pageIndex === 1} onClick={() => setPageIndex(1)} />
          <MediumButton buttonTitle="Realtime" isActive={pageIndex === 2} onClick={() => setPageIndex(2)} />

          {/* <MediumButton buttonTitle="Compare" isActive={pageIndex === 3} onClick={() => setPageIndex(3)} /> */}
        </div>
        <div className="text-right" >

          <input type="date" className="mt-4 mr-3 p-2 br-20 rounded-lg" max={endDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={startDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {
            setStartDate(new Date(e.target.value));
            fetchExchangeData(
              {
                start_date: new Date(e.target.value),
                end_date: endDate,
              }
            );
          }} />
          to
          <input type="date" className="mt-4 ml-3 mr-10 p-2 br-20 rounded-lg" max={maxDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={endDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {
            setEndDate(new Date(e.target.value));
            fetchExchangeData(
              {
                start_date: startDate,
                end_date: new Date(e.target.value),
              }
            );
          }} />
        </div>
      </div>
      {
        pageIndex === 0 &&
        
        <><div className="byExchangeChart mt-5">
          <ResponsiveContainer>
            <ExchangeChart data={iexData.dam} title="DAM" syncId="byProduct" />
          </ResponsiveContainer>

          <ResponsiveContainer>
            <ExchangeChart data={iexData.dam} title="GDAM" syncId="byProduct"/>
          </ResponsiveContainer>

        </div><div className="byExchangeChart">
            <ResponsiveContainer>
              <ExchangeChart data={iexData.dam} title="HPDAM"syncId="byProduct"  />
            </ResponsiveContainer>

            <ResponsiveContainer>
              <ExchangeChart data={iexData.dam} title="RTM" syncId="byProduct" />
            </ResponsiveContainer></div>
            <ExchangeChart data={iexData.dam} title="DAM" syncId="byProduct" height="20%" showBrush={true} />
            
            </>
      }
    {
      pageIndex === 1 &&
      <>
      <div className="flex flex-row justify-between mt-3">
        <div className="text-2xl text-center">Price and Volume by Product</div>
        <div className="">
          {
            Object.keys(iexData).map((data, index) => {
              return <SmallButton onClick={() => setSelectedProductIndex([index])} buttonTitle={data.toUpperCase()} isActive={selectedProductIndex.includes(index)} />

            })}
        </div>
      </div>
      <ExchangeChart data={
        Object.keys(iexData).map((data, index) => {
          return iexData[data];
        }
        )[selectedProductIndex[0]]
      } showBrush={false} title="IEX" />
      <ExchangeChart data={
        Object.keys(hpxData).map((data, index) => {
          return hpxData[data];
        }
        )[selectedProductIndex[0]]

      } title="PXIL" />
      <ExchangeChart data={pxilData.dam} showBrush={true} title="HPX" />
      </>
     } </>
  );


  async function fetchExchangeData({ start_date = startDate, end_date = endDate }) {
    console.log("fetching data");
    try {
      let formatedStartDate = start_date.toLocaleDateString('en-GB').split('/').join('-');
      let formatedEndDate = end_date.toLocaleDateString('en-GB').split('/').join('-');
      const formData = new FormData();
      formData.append('start_date', formatedStartDate);
      formData.append('end_date', formatedEndDate);

      fetch("https://datahub.gna.energy/exchange_analytics_api_range", {
        method: 'POST',
        body: formData,
      }).then((response) => response.json()).then((data) => {
        console.log(data);
        setIexData(FormatExchangeData(data));
      });
      try {
        fetch("https://datahub.gna.energy/pxil_exchange_analytics_api_range", {
          method: 'POST',
          body: formData,
        }).then((response) => response.json()).then((data) => {
          console.log(data);
          setPxilData(FormatExchangeData(data));
        }
        );

      }
      catch (error) {
        console.log("This is the error in fetching the api of pxildata - ", error);
        setPxilData(FormatExchangeData([]));
      }

      try {
        fetch("https://datahub.gna.energy/hpx_exchange_analytics_api_range", {
          method: 'POST',
          body: formData,
        }).then((response) => response.json()).then((data) => {
          console.log(data);
          setHpxData(FormatExchangeData(data));
        }
        );

      } catch (error) {
        console.log("This is the error in fetching the api of hpxdata - ", error);
        setHpxData(FormatExchangeData([]));
      }

      setSelectedProductIndex([0]);




    }
    catch (error) {
      console.error("Error fetching data:", error);
      setIexData(FormatExchangeData([]));
      setPxilData(FormatExchangeData([]));
      setHpxData(FormatExchangeData([]));

      setSelectedProductIndex([]);
    }
  }
}
