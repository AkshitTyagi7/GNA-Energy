import React, { useState } from "react";
import { TAM as TAMType } from "../../../models/auction";
import {
  LegendComponent,
  lightenColor,
  ReMixChart,
} from "../../../components/recharts/ReMixCharts";
import { toSafeFloat } from "../../../extensions/number";
import Loading from "../../../components/Loading";
import { Pagination } from "./Pagination";
import { ExchangeColors } from "../Exchange3/FormatData";
import { formatDMY, PrimaryColor } from "../../../common";
import { colors } from "react-select/dist/declarations/src/theme";
import { da } from "date-fns/locale";

interface TAMProps {
  TAMData: TAMType[];
  loading: boolean;
  startDate: Date;
  endDate: Date;
}

export const TAM: React.FC<TAMProps> = ({
  TAMData,
  loading,
  startDate,
  endDate,
}) => {
  const [isByChart, setIsByChart] = useState<boolean>(false);
  const [selectTamExc, setSelectTamExc] = useState<string[]>([]);
  const [selectTamProduct, setSelectTamProduct] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [chartTabIndex, setChartTabIndex] = useState<number>(0);
  const [priceType, setPriceType] = useState<string[]>([]);

  const chartProducts = [
    {
      product: "daily",
      name: "Daily",
      productName: "Daily",
      color: ExchangeColors[1],
    },
    {
      product: "intra",
      name: "Intra day",
      productName: "Intra day",
      color: ExchangeColors[2],
    },
    {
      product: "contingency",
      name: "DAC",
      productName: "Day Ahead Contingency",
      color: ExchangeColors[3],
    },
    {
      product: "weekly",
      name: "Weekly",
      productName: "Weekly",
      color: ExchangeColors[5],
    },

    {
      product: "monthly",
      name: "Monthly",
      productName: "Monthly",
      color: ExchangeColors[6],
    },
    {
      product: "hp_daily",
      name: "HP Daily",
      productName: "Daily_HP",
      color: ExchangeColors[7],
    },
    {
      product: "hp_intra",
      name: "HP Intra Day",
      productName: "IDayDynamic_HP",
      color: ExchangeColors[8],
    },
    {
      product: "hp_contingency",
      name: "HP DAC",
      productName: "CONTINGENCY_HP",
      color: ExchangeColors[9],
    },
    {
      product: "hp_monthly",
      name: "HP Monthly",
      productName: "Monthly_HP",
      color: ExchangeColors[10],
    },
  ];
   const products = [
    { name: "Daily", key: "Daily", keys: ["Daily", "DAILY"] },
    {
      name: "Intra day",
      key: "Intra day",
      keys: [
        "I_DayDynamic_C",
        "Intra day",
        "Intra Day",
        "I_DayStatic_C",
        "INTRA DAY",
      ],
    },
    {
      name: "DAC",
      key: "Day Ahead Contingency",
      keys: [
        "Day Ahead Contingency",
        "DACDynamic",
        "CONTINGENCY",
        "Contingency",
        "TAM(DAC)",
        "DACStatic",
        "DAC"
      ],
    },
    { name: "Weekly", key: "Weekly", keys: ["Weekly", "WEEKLY"] },
  
    { name: "Monthly", key: "Monthly", keys: ["Monthly"] },
    {
      name: "HP DAC",
      key: "DACDynamic_HP",
      keys: [
        "DACDynamic_HP",
        "DACStatic_TAM_H", 
        "Day Ahead Contingency_HP",
        "DAY AHEAD CONTINGENCY_HP",
        "Contingency_HP",
        "DAY AHEAD CONTIGENCY_HP",
        "CONTINGENCY_HP",
        "HP DAC"
      ],
    },
    {
      name: "HP Intra Day",
      key: "IDayDynamic_HP",
      keys: ["IDayDynamic_HP", "Intra Day_HP","HP Intra Day"],
    },
    {
      name: "HP Daily",
      key: "Daily_HP",
      keys: ["Daily_HP", "DAILY_HP", "daily_hp","HP Daily"],
    },
    {
      name: "HP Monthly", 
      key: "Monthly_HP",
      keys: ["Monthly_HP", "MONTHLY_HP", "monthly_hp","HP Monthly"],
    },
  ];
  
  const chartExchangeComprison = [
    "IEX_Day Ahead Contingency",
    "HPX_Day Ahead Contingency",
    "PXIL_Day Ahead Contingency",
    "PXIL_Daily",
    "HPX_Daily",
    "PXIL_Intra day",
    "IEX_Intra day",
    "IEX_Daily",
    "HPX_Intra day",
    "HPX_Monthly",
    "PXIL_Monthly",
    "PXIL_Weekly",
    "IEX_Weekly",
    "HPX_Weekly",
    "IEX_Monthly",
    "IEX_HP Daily",
    "HPX_HP Daily",
    "PXIL_HP Daily",
    "PXIL_HP Intra Day",
    "IEX_HP Intra Day",
    "HPX_HP Intra Day", "IEX_HP Monthly", "HPX_HP Monthly", "PXIL_HP Monthly", "IEX_HP DAC", "HPX_HP DAC", "PXIL_HP DAC"


    // "PXIL_DACDynamic_HP",
    // "HPX_Daily_HP",
    // "PXIL_Daily_HP",
    // "PXIL_Monthly_HP",
    // "PXIL_IDayDynamic_HP",
    // "HPX_IDayDynamic_HP",
    // "HPX_DACDynamic_HP",
    // "IEX_DACDynamic_HP",
    // "IEX_IDayDynamic_HP",
    // "HPX_undefined",
    // "PXIL_undefined",
  ].map((value, index) => {
    const [exchange, exchangeProduct] = value.split("_");
    return {
      key: value,
      exchange,
      exchangeProduct,
      name: `${exchange} ${exchangeProduct}`,
      color: ExchangeColors[index+1],
    };
  });
  const ITEMS_PER_PAGE = 100;

  const handleTAMSelectExc = (type: string) => {
    setSelectTamExc((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const getActiveExchangeComparison=(): {
    key: string;
    exchange: string;
    exchangeProduct: string;
    name: string;
    color: string;
  }[] =>{
    // return chartExchangeComprison.filter((exchange) =>
    //   selectTamExc.includes(exchange.exchange)
    // );
    let data:any=[];
    chartExchangeComprison.forEach((exchange)=>{
      if((selectTamExc.includes(exchange.exchange) || selectTamExc.length === 0) && (selectTamProduct.includes(exchange.exchangeProduct) || selectTamProduct.length==0)){
        data.push(exchange);
      }
    })
    if(data.length==0){
      return chartExchangeComprison;
    }
    return data;


  }

  const handleTAMSelectProduct = (productIndex: number) => {

    const product = products[productIndex].keys;
    if(chartTabIndex == 2 && isByChart){
      let selectedProducts:any = [];
      products.forEach((product) => {
        if (selectTamProduct.includes(product.key)) {
          if(!selectedProducts.includes(product.name)){
            selectedProducts.push(product.name);
          }
        }
      });
      if (selectedProducts.length >= 3 && !selectTamProduct.includes(product[0])) {
        return;
      }
      if(selectedProducts.length == 1 && selectTamProduct.includes(product[0])){
        return;
      }
    }
    setSelectTamProduct((prev) =>
      prev.includes(product[0])
        ? prev.filter((item) => !product.includes(item))
        : [...prev, ...product]
    );
    setCurrentPage(1);
    // 
  };

  const handlePriceType = (type: string) => {
    setPriceType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const filteredTAMAuctions = () => {
    let resdate = TAMData;
    if (selectTamExc.length > 0) {
      resdate = resdate.filter((auction) =>
        selectTamExc.includes(auction.exchange!)
      );
    }
    if (selectTamProduct.length > 0) {
      resdate = resdate.filter((auction) =>
        selectTamProduct.includes(auction.product_gna!)
      );
    }

    resdate.forEach((auction) => {
      auction.product = products.find((p) =>
        p.keys.includes(auction.product_gna!)
      )?.key!;
    });
    return resdate;
  };

  const paginatedTAMAuctions = filteredTAMAuctions().slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getActiveChartProducts = (): {
    product: string;
    name: string;
    productName: string;
    color: string;
  }[] => {
    return selectTamProduct.length === 0
      ? chartProducts
      : chartProducts.filter((product) =>
          selectTamProduct.includes(product.productName)
        );
  };
  function handleNotFount(name: { name: string; key: string; keys: string[] }) {
    console.log(name);
    return name.name;
  }

  // const MAX_PRODUCTS = 4;

  const TAMTable = ({ auctions }: { auctions: TAMType[] }) => (
    <div className="detContainermain">
      <div className="contentHeading">
        <div className="large-col">Instrument Name</div>
        <div className="large-col">Date</div>
        <div className="large-col">Exchange</div>
        <div className="large-col">Contract Type</div>
        <div className="large-col">Total Traded Volume(MWh)</div>
        <div className="large-col">Weighted Average Price(Rs/KWh)</div>
        <div className="large-col">No of Trades</div>
      </div>
      <div className="elemDetailsSec">
        {auctions.map((auction) => (
          <div className="tableDetails">
            <div className="large-col">{auction.instrument_name}</div>
            <div className="large-col">{auction.date!}</div>
            <div className="large-col">{auction.exchange}</div>
            <div className="large-col">
              {products.find((p) => p.keys.includes(auction.product_gna!))
                ?.name || handleNotFount(auction as any)!}
            </div>
            <div className="large-col">{auction.total_traded_volume_mwh}</div>
            <div className="large-col">
              {auction.weighted_average_price_rs_mwh}
            </div>
            <div className="large-col">{auction.no_of_trades}</div>
          </div>
        ))}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredTAMAuctions().length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
  return (
    <div>
      {loading && <Loading />}
      <div className="filterSection">
        <div className="selectButton">
          {products.map((type, index) => (
            <div
              key={type.key}
              style={{
                borderRadius:
                  index === 0
                    ? "8px 0px 0px 8px"
                    : index === products.length - 1
                    ? "0px 8px 8px 0px"
                    : undefined,
              }}
              className={
                selectTamProduct.includes(type.key)
                  ? "fiterActive"
                  : "fiterInactive"
              }
              onClick={() => handleTAMSelectProduct(index)}
            >
              {type.name}
            </div>
          ))}
        </div>

        <div className="selectButton">
          <div
            style={{ borderRadius: "8px 0px 0px 8px" }}
            className={`fiterInactive ${
              isByChart ? "fiterInactive" : "fiterActive"
            }`}
            onClick={() =>{setIsByChart(false)

              
            }}
          >
            Table
          </div>
          <div
            style={{ borderRadius: "0px 8px 8px 0px" }}
            className={`fiterInactive ${
              isByChart ? "fiterActive" : "fiterInactive"
            }`}
            onClick={() => setIsByChart(true)}
          >
            Chart
          </div>
        </div>
        <div className="selectButton">
          {EXCHANGE_TYPES.filter((v) => v !== "DEEP").map((type, index) => (
            <div
              key={type}
              style={{
                borderRadius:
                  index === 0
                    ? "8px 0px 0px 8px"
                    : index === EXCHANGE_TYPES.length - 2
                    ? "0px 8px 8px 0px"
                    : undefined,
              }}
              className={
                selectTamExc.includes(type) ? "fiterActive" : "fiterInactive"
              }
              onClick={() => handleTAMSelectExc(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>
      <div className="detContainermain">
        {isByChart ? (
          <div className="tamChart">

            <div className="flex justify-between">
              <div style={{ width: "330px" }} />
              {/* {chartTabIndex == 0 && ( */}
                <div className="flex gap-x-8">
                  {LegendComponent(
                    {
                      dataKey: "total_mu",
                      stroke: PrimaryColor,
                      name: "Volume(MUs)",
                      type: 1,
                      legendColor: PrimaryColor,
                    },
                    0,
                    [],
                    () => {}
                  )}
                  {LegendComponent(
                    {
                      dataKey: "weighted_avg_rs_per_kwh",
                      stroke: PrimaryColor,
                      name: "Wt. Avg Price(Rs/KWh)",
                      yAxisId: "right",
                    },
                    1,
                    [],
                    () => {}
                  )}
                </div>
               {/* )} */}
              <div className="selectButton">
                <div
                  style={{ borderRadius: "8px 0px 0px 8px" }}
                  className={`fiterInactive ${
                    chartTabIndex == 0 ? "fiterActive" : "fiterInactive"
                  }`}
                  onClick={() => setChartTabIndex(0)}
                >
                  Cumulative
                </div>
                <div
                  style={{ borderRadius: "0px 0px 0px 0px" }}
                  className={`fiterInactive ${
                    chartTabIndex == 1 ? "fiterActive" : "fiterInactive"
                  }`}
                  onClick={() => setChartTabIndex(1)}
                >
                  Compare Products
                </div>

                <div
                  style={{ borderRadius: "0px 8px 8px 0px" }}
                  className={`fiterInactive ${
                    chartTabIndex == 2 ? "fiterActive" : "fiterInactive"
                  }`}
                  onClick={() => {setChartTabIndex(2)
                    setSelectTamProduct([
                      ...products[0].keys,
                      ...products[1].keys,
                    ])


                  }}
                >
                  Compare Exchanges
                </div>
                
              </div>
            </div>
            <br />

            {chartTabIndex !== 2 ? (
              <ReMixChart
                barCategoryGap={2.6}
                hidePrice={true}
                onlyTitle={true}
                isTimeSlot={false}
                legendBreakIndex={(getActiveChartProducts().length - 1) < 2 ? undefined : getActiveChartProducts().length  - 1}
                // round length/2 to get the middle index
                // add 1 to get the next index
                // legendBreakIndex={Math.round(getActiveChartProducts().length / 2) - 1}
                xaxisHeight={
                  chartTabIndex == 1 ||
                  aggregateComparativeTAMData(filteredTAMAuctions()).length > 60
                    ? 50
                    : 35
                }
                unit="MWh"
                xAxisPosition={
                  chartTabIndex == 1 ||
                  aggregateComparativeTAMData(filteredTAMAuctions()).length > 60
                    ? ""
                    : undefined
                }
                data={
                  chartTabIndex == 1
                    ? aggregateComparativeTAMData(filteredTAMAuctions())
                    : (aggregateTAMData(filteredTAMAuctions()) as any)
                }
                legends={
                  chartTabIndex == 0
                    ? [
                        {
                          dataKey: "total_traded_volume_mwh",
                          stroke: "#E0E0E0",
                          name: "Total Traded Volume(MWh)",
                          type: 1,
                          legendColor: "rgb(159, 159, 159)",
                        },
                        {
                          dataKey: "weighted_average_price_rs_mwh",
                          stroke: PrimaryColor,
                          name: "Wt. Avg Price(Rs/KWh)",
                          
                          yAxisId: "right",
                        },
                      ]
                    : [
                        ...getActiveChartProducts().map((product, index) =>
                          [
                            {
                              dataKey: `${product.product}_total_traded_volume_mwh`,
                              name: `${product.name}`,
                              stroke: lightenColor(product.color, 20),
                              type: 1,
                            },
                          ].flat()
                        ),

                        ...getActiveChartProducts().map((product, index) =>
                          [
                            {
                              dataKey: `${product.product}_weighted_average_price_rs_mwh`,
                              name: `${product.name} Price`,
                              stroke: product.color,
                              yAxisId: "right",
                            },
                          ].flat()
                        ),
                      ].flat()
                }
                showBrush={
                  aggregateComparativeTAMData(filteredTAMAuctions()).length >
                    61 &&
                  chartTabIndex == 1 &&
                  aggregateTAMData(filteredTAMAuctions()).length > 60
                }
                brushIndex={{
                  startIndex: 0,
                  endIndex: chartTabIndex == 1 ? 15 : 60,
                }}
                xDataKey="date"
                xLabel="Date"
                yAxisLabel="Total Traded Volume(MWh)"
                secondYAxisLabel="Weighted Average Price(Rs/KWh)"
              />
            ) : (
              <div className="raChart">

             <ReMixChart
             data={aggregateExchangeComparativeTAMData(filteredTAMAuctions())}
              xDataKey="date" 
              // xLabel="Date"
              hidePrice={true}
                onlyTitle={true}
              unit="MWh"
              yAxisLabel="Total Traded Volume(MWh)"
              secondYAxisLabel="Weighted Average Price(Rs/KWh)"
              showBrush={aggregateExchangeComparativeTAMData(filteredTAMAuctions()).length > 60}
              brushIndex={{ startIndex: 0, endIndex: 60 }}
              showSecondYAxis={true}
              legends={
   
            [
              ...getActiveExchangeComparison().map((exchange, index) => [
                {
                  dataKey: `${exchange.key}_total_mu`,
                  name: `${exchange.name}`,
                  stroke: lightenColor(exchange.color, 20),
                  type: 1,
                },
              ].flat()).flat(),
              ...getActiveExchangeComparison().map((exchange, index) => [
                {
                  dataKey: `${exchange.key}_weighted_avg_rs_per_kwh`,
                  name: `${exchange.name} Price`,
                  stroke: exchange.color,
                  yAxisId: "right",
                },
              ].flat()).flat(),
            ]
          }
             
            /></div>)}
          </div>
        ) : (
          <TAMTable auctions={paginatedTAMAuctions} />
        )}
      </div> 
    </div>
  );
};

const EXCHANGE_TYPES = ["DEEP", "IEX", "HPX", "PXIL"] ;

const aggregateTAMData = (tamData: TAMType[]): AggregatedTAM[] => {
  const aggregatedData: {
    [key: string]: { totalVolume: number; totalPrice: number; count: number };
  } = {};

  if (tamData.length === 0) return [];
  let date = new Date(tamData[0].date as any);
  const start_date = new Date(tamData[0].date as any);
  const end_date = new Date(tamData[tamData.length - 1].date as any);

  while (date.getTime() <= end_date.getTime()) {
    const dateString = formatDMY(date.toISOString().split("T")[0]);
    aggregatedData[dateString] = {
      totalVolume: 0,
      totalPrice: 0,
 
      count: 0,
    };
    date.setDate(date.getDate() + 1);
    date = new Date(date); // Create a new date object to avoid modifying the original date object
  }
  tamData.forEach((entry) => {
    if (
      entry.date &&
      entry.total_traded_volume_mwh !== null &&
      entry.weighted_average_price_rs_mwh !== null
    ) {
      entry.date = entry.date;
      const { date, total_traded_volume_mwh, weighted_average_price_rs_mwh } =
        entry;
      if (!aggregatedData[date]) {
        aggregatedData[date] = { totalVolume: 0, totalPrice: 0, count: 0 };
      }

      aggregatedData[date].totalVolume += 
        toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
      aggregatedData[date].totalPrice +=
        toSafeFloat(total_traded_volume_mwh.toString()) *
        toSafeFloat(weighted_average_price_rs_mwh.toString()) *
        entry.no_of_trades!;
      aggregatedData[date].count += total_traded_volume_mwh;
    }
  });

  const result: AggregatedTAM[] = Object.keys(aggregatedData).map((date) => {
    const { totalVolume, totalPrice, count } = aggregatedData[date];
    return {
      date: date,
      total_traded_volume_mwh: totalVolume,
      weighted_average_price_rs_mwh:
        totalPrice === 0 ? 0 : totalPrice / totalVolume,
      average_weighted_price_rs_mwh: totalPrice === 0 ? 0 : totalPrice / count,
    };
  });

  return result;
};

const aggregateComparativeTAMData = (tamData: TAMType[]): ComparativeTAM[] => {
  const aggregatedData: {
    [key: string]: ComparativeTAM;
  } = {};

  // add all dates between start and end date
  if (tamData.length === 0) return [];
  let date = new Date(tamData[0].date as any);
  const start_date = new Date(tamData[0].date as any);
  const end_date = new Date(tamData[tamData.length - 1].date as any);

  while (date.getTime() <= end_date.getTime()) {
    const dateString = formatDMY(date.toISOString().split("T")[0]);
    aggregatedData[dateString] = {
      date: dateString,
      total_traded_volume_mwh: 0,
      total_price_rs: 0,
      average_weighted_price_rs_mwh: 0,
      weighted_average_price_rs_mwh: 0,
      iex_total_traded_volume_mwh: 0,
      iex_total_price_rs: 0,
      iex_average_weighted_price_rs_mwh: 0,
      iex_weighted_average_price_rs_mwh: 0,
      hpx_total_traded_volume_mwh: 0,
      hpx_total_price_rs: 0,
      hpx_average_weighted_price_rs_mwh: 0,
      hpx_weighted_average_price_rs_mwh: 0,
      pxil_average_weighted_price_rs_mwh: 0,
      pxil_total_traded_volume_mwh: 0,
      pxil_total_price_rs: 0,
      pxil_weighted_average_price_rs_mwh: 0,
      daily_total_traded_volume_mwh: 0,
      daily_total_price_rs: 0,
      daily_average_weighted_price_rs_mwh: 0,
      daily_weighted_average_price_rs_mwh: 0,
      intra_total_traded_volume_mwh: 0,
      intra_total_price_rs: 0,
      intra_average_weighted_price_rs_mwh: 0,
      intra_weighted_average_price_rs_mwh: 0,
      contingency_total_traded_volume_mwh: 0,
      contingency_total_price_rs: 0,
      contingency_average_weighted_price_rs_mwh: 0,
      contingency_weighted_average_price_rs_mwh: 0,
      monthly_total_traded_volume_mwh: 0,
      monthly_total_price_rs: 0,
      monthly_average_weighted_price_rs_mwh: 0,
      monthly_weighted_average_price_rs_mwh: 0,
      weekly_total_traded_volume_mwh: 0,
      weekly_total_price_rs: 0,
      weekly_average_weighted_price_rs_mwh: 0,
      weekly_weighted_average_price_rs_mwh: 0,
      hp_daily_total_traded_volume_mwh: 0,
      hp_daily_total_price_rs: 0,
      hp_daily_average_weighted_price_rs_mwh: 0,
      hp_daily_weighted_average_price_rs_mwh: 0,
      hp_intra_total_traded_volume_mwh: 0,
      hp_intra_total_price_rs: 0,
      hp_intra_average_weighted_price_rs_mwh: 0,
      hp_intra_weighted_average_price_rs_mwh: 0,
      hp_contingency_total_traded_volume_mwh: 0,
      hp_contingency_total_price_rs: 0,
      hp_contingency_average_weighted_price_rs_mwh: 0,
      hp_contingency_weighted_average_price_rs_mwh: 0,
      hp_monthly_total_traded_volume_mwh: 0,
      hp_monthly_total_price_rs: 0,

      hp_monthly_average_weighted_price_rs_mwh: 0,

      hp_monthly_weighted_average_price_rs_mwh: 0,
    };
    date.setDate(date.getDate() + 1);
    date = new Date(date); // Create a new date object to avoid modifying the original date object
  }

  tamData.forEach((entry) => {
    entry.date = entry.date;

    if (
      entry.date &&
      entry.total_traded_volume_mwh !== null &&
      entry.weighted_average_price_rs_mwh !== null
    ) {
      const { date, total_traded_volume_mwh, weighted_average_price_rs_mwh } =
        entry;
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date: date,
          total_traded_volume_mwh: 0,
          total_price_rs: 0,
          average_weighted_price_rs_mwh: 0,
          weighted_average_price_rs_mwh: 0,
          iex_total_traded_volume_mwh: 0,
          iex_total_price_rs: 0,
          iex_average_weighted_price_rs_mwh: 0,
          iex_weighted_average_price_rs_mwh: 0,
          hpx_total_traded_volume_mwh: 0,
          hpx_total_price_rs: 0,
          hpx_average_weighted_price_rs_mwh: 0,
          hpx_weighted_average_price_rs_mwh: 0,
          pxil_average_weighted_price_rs_mwh: 0,
          pxil_total_traded_volume_mwh: 0,
          pxil_total_price_rs: 0,
          pxil_weighted_average_price_rs_mwh: 0,

          daily_total_traded_volume_mwh: 0,
          daily_total_price_rs: 0,
          daily_average_weighted_price_rs_mwh: 0,
          daily_weighted_average_price_rs_mwh: 0,
          intra_total_traded_volume_mwh: 0,
          intra_total_price_rs: 0,
          intra_average_weighted_price_rs_mwh: 0,
          intra_weighted_average_price_rs_mwh: 0,
          contingency_total_traded_volume_mwh: 0,
          contingency_total_price_rs: 0,
          contingency_average_weighted_price_rs_mwh: 0,
          contingency_weighted_average_price_rs_mwh: 0,
          monthly_total_traded_volume_mwh: 0,
          monthly_total_price_rs: 0,
          monthly_average_weighted_price_rs_mwh: 0,
          monthly_weighted_average_price_rs_mwh: 0,
          weekly_total_traded_volume_mwh: 0,
          weekly_total_price_rs: 0,
          weekly_average_weighted_price_rs_mwh: 0,
          weekly_weighted_average_price_rs_mwh: 0,
          hp_daily_total_traded_volume_mwh: 0,
          hp_daily_total_price_rs: 0,
          hp_daily_average_weighted_price_rs_mwh: 0,
          hp_daily_weighted_average_price_rs_mwh: 0,
          hp_intra_total_traded_volume_mwh: 0,
          hp_intra_total_price_rs: 0,
          hp_intra_average_weighted_price_rs_mwh: 0,
          hp_intra_weighted_average_price_rs_mwh: 0,
          hp_contingency_total_traded_volume_mwh: 0,
          hp_contingency_total_price_rs: 0,
          hp_contingency_average_weighted_price_rs_mwh: 0,
          hp_contingency_weighted_average_price_rs_mwh: 0,
          hp_monthly_total_traded_volume_mwh: 0,
          hp_monthly_total_price_rs: 0,
          hp_monthly_average_weighted_price_rs_mwh: 0,
          hp_monthly_weighted_average_price_rs_mwh: 0,
        };
      }

      aggregatedData[date].total_traded_volume_mwh +=
        toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
      aggregatedData[date].total_price_rs +=
        toSafeFloat(total_traded_volume_mwh.toString()) *
        toSafeFloat(weighted_average_price_rs_mwh.toString()) *
        entry.no_of_trades!;

      if (entry.exchange === "IEX") {
        aggregatedData[date].iex_total_traded_volume_mwh +=
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].iex_total_price_rs +=
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.exchange === "HPX") {
        aggregatedData[date].hpx_total_traded_volume_mwh +=
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].hpx_total_price_rs +=
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.exchange === "PXIL") {
        aggregatedData[date].pxil_total_traded_volume_mwh +=
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].pxil_total_price_rs +=
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }

      if (entry.product === "Intra day") {
        aggregatedData[date].intra_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].intra_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }

      if (entry.product === "Day Ahead Contingency") {
        aggregatedData[date].contingency_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].contingency_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }

      if (entry.product === "Monthly") {
        aggregatedData[date].monthly_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].monthly_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }

      if (entry.product === "Daily") {
        aggregatedData[date].daily_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].daily_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.product === "Weekly") {
        aggregatedData[date].weekly_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].weekly_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.product === "Daily_HP") {
        aggregatedData[date].hp_daily_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].hp_daily_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.product === "IDayDynamic_HP") {
        aggregatedData[date].hp_intra_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].hp_intra_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.product === "DACDynamic_HP") {
        aggregatedData[date].hp_contingency_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].hp_contingency_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
      if (entry.product === "Monthly_HP") {
        aggregatedData[date].hp_monthly_total_traded_volume_mwh =
          toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
        aggregatedData[date].hp_monthly_total_price_rs =
          toSafeFloat(total_traded_volume_mwh.toString()) *
          toSafeFloat(weighted_average_price_rs_mwh.toString()) *
          entry.no_of_trades!;
      }
    }
  });

  const result: ComparativeTAM[] = Object.keys(aggregatedData).map((date) => {
    const {
      total_traded_volume_mwh,
      total_price_rs,
      daily_total_traded_volume_mwh,
      daily_total_price_rs,
      intra_total_traded_volume_mwh,
      intra_total_price_rs,
      contingency_total_traded_volume_mwh,
      contingency_total_price_rs,
      monthly_total_traded_volume_mwh,
      monthly_total_price_rs,
    } = aggregatedData[date];
    return {
      date,
      total_traded_volume_mwh: toSafeFloat(total_traded_volume_mwh),
      total_price_rs: toSafeFloat(total_price_rs),
      average_weighted_price_rs_mwh: toSafeFloat(
        total_price_rs / total_traded_volume_mwh
      ),
      weighted_average_price_rs_mwh: toSafeFloat(
        total_price_rs / total_traded_volume_mwh
      ),
      iex_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].iex_total_traded_volume_mwh
      ),
      iex_total_price_rs: toSafeFloat(aggregatedData[date].iex_total_price_rs),
      iex_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].iex_total_price_rs /
          aggregatedData[date].iex_total_traded_volume_mwh
      ),
      iex_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].iex_total_price_rs /
          aggregatedData[date].iex_total_traded_volume_mwh
      ),
      hpx_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].hpx_total_traded_volume_mwh
      ),
      hpx_total_price_rs: toSafeFloat(aggregatedData[date].hpx_total_price_rs),
      hpx_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hpx_total_price_rs /
          aggregatedData[date].hpx_total_traded_volume_mwh
      ),
      hpx_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hpx_total_price_rs /
          aggregatedData[date].hpx_total_traded_volume_mwh
      ),
      pxil_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].pxil_total_traded_volume_mwh
      ),
      pxil_total_price_rs: toSafeFloat(
        aggregatedData[date].pxil_total_price_rs
      ),
      pxil_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].pxil_total_price_rs /
          aggregatedData[date].pxil_total_traded_volume_mwh
      ),
      pxil_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].pxil_total_price_rs /
          aggregatedData[date].pxil_total_traded_volume_mwh
      ),
      daily_total_traded_volume_mwh: toSafeFloat(daily_total_traded_volume_mwh),
      daily_total_price_rs: toSafeFloat(daily_total_price_rs),
      daily_average_weighted_price_rs_mwh: toSafeFloat(
        daily_total_price_rs / daily_total_traded_volume_mwh
      ),
      daily_weighted_average_price_rs_mwh: toSafeFloat(
        daily_total_price_rs / daily_total_traded_volume_mwh
      ),

      intra_total_traded_volume_mwh: toSafeFloat(intra_total_traded_volume_mwh),
      intra_total_price_rs: toSafeFloat(intra_total_price_rs),
      intra_average_weighted_price_rs_mwh: toSafeFloat(
        intra_total_price_rs / intra_total_traded_volume_mwh
      ),
      intra_weighted_average_price_rs_mwh: toSafeFloat(
        intra_total_price_rs / intra_total_traded_volume_mwh
      ),
      contingency_total_traded_volume_mwh: toSafeFloat(
        contingency_total_traded_volume_mwh
      ),
      contingency_total_price_rs: toSafeFloat(contingency_total_price_rs),
      contingency_average_weighted_price_rs_mwh: toSafeFloat(
        contingency_total_price_rs / contingency_total_traded_volume_mwh
      ),
      contingency_weighted_average_price_rs_mwh: toSafeFloat(
        contingency_total_price_rs / contingency_total_traded_volume_mwh
      ),
      monthly_total_traded_volume_mwh: toSafeFloat(
        monthly_total_traded_volume_mwh
      ),
      monthly_total_price_rs: toSafeFloat(monthly_total_price_rs),
      monthly_average_weighted_price_rs_mwh: toSafeFloat(
        monthly_total_price_rs / monthly_total_traded_volume_mwh
      ),
      monthly_weighted_average_price_rs_mwh: toSafeFloat(
        monthly_total_price_rs / monthly_total_traded_volume_mwh
      ),
      weekly_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].weekly_total_traded_volume_mwh
      ),
      weekly_total_price_rs: toSafeFloat(
        aggregatedData[date].weekly_total_price_rs
      ),
      weekly_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].weekly_total_price_rs /
          aggregatedData[date].weekly_total_traded_volume_mwh
      ),
      weekly_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].weekly_total_price_rs /
          aggregatedData[date].weekly_total_traded_volume_mwh
      ),
      hp_daily_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].hp_daily_total_traded_volume_mwh
      ),
      hp_daily_total_price_rs: toSafeFloat(
        aggregatedData[date].hp_daily_total_price_rs
      ),
      hp_daily_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_daily_total_price_rs /
          aggregatedData[date].hp_daily_total_traded_volume_mwh
      ),
      hp_daily_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_daily_total_price_rs /
          aggregatedData[date].hp_daily_total_traded_volume_mwh
      ),
      hp_intra_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].hp_intra_total_traded_volume_mwh
      ),
      hp_intra_total_price_rs: toSafeFloat(
        aggregatedData[date].hp_intra_total_price_rs
      ),
      hp_intra_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_intra_total_price_rs /
          aggregatedData[date].hp_intra_total_traded_volume_mwh
      ),
      hp_intra_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_intra_total_price_rs /
          aggregatedData[date].hp_intra_total_traded_volume_mwh
      ),
      hp_contingency_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].hp_contingency_total_traded_volume_mwh
      ),
      hp_contingency_total_price_rs: toSafeFloat(
        aggregatedData[date].hp_contingency_total_price_rs
      ),
      hp_contingency_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_contingency_total_price_rs /
          aggregatedData[date].hp_contingency_total_traded_volume_mwh
      ),
      hp_contingency_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_contingency_total_price_rs /
          aggregatedData[date].hp_contingency_total_traded_volume_mwh
      ),
      hp_monthly_total_traded_volume_mwh: toSafeFloat(
        aggregatedData[date].hp_monthly_total_traded_volume_mwh
      ),
      hp_monthly_total_price_rs: toSafeFloat(
        aggregatedData[date].hp_monthly_total_price_rs
      ),
      hp_monthly_average_weighted_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_monthly_total_price_rs /
          aggregatedData[date].hp_monthly_total_traded_volume_mwh
      ),
      hp_monthly_weighted_average_price_rs_mwh: toSafeFloat(
        aggregatedData[date].hp_monthly_total_price_rs /
          aggregatedData[date].hp_monthly_total_traded_volume_mwh
      ),
    };
  });

  return result;
};

interface AggregatedTAM {
  date: string;
  total_traded_volume_mwh: number;
  average_weighted_price_rs_mwh: number;
  weighted_average_price_rs_mwh: number;
}

interface ComparativeTAM {
  date: string;
  total_traded_volume_mwh: number;
  total_price_rs: number;
  average_weighted_price_rs_mwh: number;
  weighted_average_price_rs_mwh: number;
  iex_total_traded_volume_mwh: number;
  iex_total_price_rs: number;
  iex_average_weighted_price_rs_mwh: number;
  iex_weighted_average_price_rs_mwh: number;
  hpx_total_traded_volume_mwh: number;
  hpx_total_price_rs: number;
  hpx_average_weighted_price_rs_mwh: number;
  hpx_weighted_average_price_rs_mwh: number;
  pxil_total_traded_volume_mwh: number;
  pxil_total_price_rs: number;
  pxil_average_weighted_price_rs_mwh: number;
  pxil_weighted_average_price_rs_mwh: number;

  daily_total_traded_volume_mwh: number;
  daily_total_price_rs: number;
  daily_average_weighted_price_rs_mwh: number;
  daily_weighted_average_price_rs_mwh: number;
  intra_total_traded_volume_mwh: number;
  intra_total_price_rs: number;
  intra_average_weighted_price_rs_mwh: number;
  intra_weighted_average_price_rs_mwh: number;
  contingency_total_traded_volume_mwh: number;
  contingency_total_price_rs: number;
  contingency_average_weighted_price_rs_mwh: number;
  contingency_weighted_average_price_rs_mwh: number;
  monthly_total_traded_volume_mwh: number;
  monthly_total_price_rs: number;
  monthly_average_weighted_price_rs_mwh: number;
  monthly_weighted_average_price_rs_mwh: number;

  weekly_total_traded_volume_mwh: number;
  weekly_total_price_rs: number;
  weekly_average_weighted_price_rs_mwh: number;
  weekly_weighted_average_price_rs_mwh: number;
  hp_daily_total_traded_volume_mwh: number;
  hp_daily_total_price_rs: number;
  hp_daily_average_weighted_price_rs_mwh: number;
  hp_daily_weighted_average_price_rs_mwh: number;
  hp_intra_total_traded_volume_mwh: number;
  hp_intra_total_price_rs: number;
  hp_intra_average_weighted_price_rs_mwh: number;
  hp_intra_weighted_average_price_rs_mwh: number;
  hp_contingency_total_traded_volume_mwh: number;
  hp_contingency_total_price_rs: number;
  hp_contingency_average_weighted_price_rs_mwh: number;
  hp_contingency_weighted_average_price_rs_mwh: number;
  hp_monthly_total_traded_volume_mwh: number;
  hp_monthly_total_price_rs: number;
  hp_monthly_average_weighted_price_rs_mwh: number;
  hp_monthly_weighted_average_price_rs_mwh: number;
}

interface CompareTamExchange {
  [key: string]: any;
}

const aggregateExchangeComparativeTAMData = (
  tamData: TAMType[]
): CompareTamExchange[] => {
  // first get unit combinations of exchange and product
  let unitCombinations: string[] = [];
  console.log("Tam data - ",tamData);
  tamData.forEach((entry) => {
    if (!unitCombinations.includes(`${entry.exchange}_${entry.product_gna}`)) {
      unitCombinations.push(`${entry.exchange}_${entry.product_gna}`);
    }
  });
  console.log(unitCombinations);

  const aggregatedData: {
    [key: string]: CompareTamExchange;
  } = {};

  // add all dates between start and end date
  if (tamData.length === 0) return [];
  let date = new Date(tamData[0].date as any);
  const start_date = new Date(tamData[0].date as any);
  const end_date = new Date(
    formatDMY(tamData[tamData.length - 1].date!) as any
  );
  while (date.getTime() <= end_date.getTime()) {
    console.log("looping");
    const dateString = formatDMY(date.toISOString().split("T")[0]);
    aggregatedData[dateString] = {};

    unitCombinations.forEach((unit) => {
      const [exchange, product] = unit.split("_");
      aggregatedData[dateString][`${exchange}_${product}_total_mcv`] = 0;
      aggregatedData[dateString][`${exchange}_${product}_total_mu`] = 0;
      aggregatedData[dateString][`${exchange}_${product}_total_price`] = 0;
      aggregatedData[dateString][
        `${exchange}_${product}_weighted_avg_rs_per_kwh`
      ] = 0;
    });

    date.setDate(date.getDate() + 1);
    date = new Date(date); // Create a new date object to avoid modifying the original date object
  }

  console.log("Aggregated data before applying tam data - ",aggregatedData);

  tamData.forEach((entry) => {
    entry.date = entry.date;

    if (
      entry.date &&
      entry.total_traded_volume_mwh !== null &&
      entry.weighted_average_price_rs_mwh !== null
    ) {
      const { date, total_traded_volume_mwh, weighted_average_price_rs_mwh } =
        entry;
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date: date,
          
        };
        unitCombinations.forEach((unit) => {
          const [exchange, product] = unit.split("_");
          aggregatedData[date][`${exchange}_${product}_total_mcv`] = 0;
          aggregatedData[date][`${exchange}_${product}_total_mu`] = 0;
          aggregatedData[date][`${exchange}_${product}_total_price`] = 0;
          aggregatedData[date][
            `${exchange}_${product}_weighted_avg_rs_per_kwh`
          ] = 0;
        }
        );

      }

      const unit = `${entry.exchange}_${entry.product_gna}`;
      if(!unitCombinations.includes(unit)){
        console.log("Unit not found in unit combinations - ",unit);
      }
      aggregatedData[date][`${unit}_total_mcv`] +=
        toSafeFloat(total_traded_volume_mwh.toString()) * toSafeFloat(entry.no_of_trades!.toString());
      aggregatedData[date][`${unit}_total_mu`] +=
        toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
      aggregatedData[date][`${unit}_total_price`] +=
        toSafeFloat(total_traded_volume_mwh.toString()) *
        toSafeFloat(weighted_average_price_rs_mwh.toString()) *
        entry.no_of_trades!;
      aggregatedData[date][`${unit}_weighted_avg_rs_per_kwh`] =
      toSafeFloat((aggregatedData[date][`${unit}_total_price`] /
          aggregatedData[date][`${unit}_total_mcv`] ));
    }
  });
  
  
  const result: CompareTamExchange[] = Object.keys(aggregatedData).map(
    (date) => {
      const data = aggregatedData[date];
      return {
        date,
        ...data,
      };
    }
  );
// remove the first element
  result.shift();
  console.log(result);

  return result;
  return [];
};
