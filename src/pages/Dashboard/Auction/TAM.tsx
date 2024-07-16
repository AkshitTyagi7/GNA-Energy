import React, { useState } from "react";
import { TAM as TAMType } from "../../../models/auction";
import { LegendComponent, lightenColor, ReMixChart } from "../../../components/recharts/ReMixCharts";
import { toSafeFloat } from "../../../extensions/number";
import Loading from "../../../components/Loading";
import { Pagination } from "./Pagination";
import { ExchangeColors } from "../Exchange3/FormatData";
import { PrimaryColor } from "../../../common";

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
  const [isCumulative, setIsCumulative] = useState<boolean>(false);
  // const products = [
  //   { name: "Daily", key: "Daily", keys: ["Daily"] },
  //   { name: "Intra day", key: "Intra day", keys: ["I_DayDynamic_C", "Intra day", "IDayDynamic_HP", "TAMCTG-B85-SR-03-07-2024", "INTRA DAY"]},
  //   { name: "Day Ahead Contingency", key: "Day Ahead Contingency", keys: ["Day Ahead Contingency", "DACDynamic", "TAMCTG-B75-WR-16-06-2024","Contingency"]},
  //   { name: "Monthly", key: "Monthly", keys: ["Monthly"]},
  // ];
  const chartProducts = [
    { product: "daily", name: "Daily", productName: "Daily", color: ExchangeColors[1] },
    { product: "intra", name: "Intra day", productName: "Intra day", color: ExchangeColors[2] },
    {
      product: "contingency",
      name: "DAC",
      productName: "Day Ahead Contingency",
      color: ExchangeColors[3],
    },
    { product: "monthly", name: "Monthly", productName: "Monthly", color: ExchangeColors[4] },
  ];

  const ITEMS_PER_PAGE = 100;

  const handleTAMSelectExc = (type: string) => {
    setSelectTamExc((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleTAMSelectProduct = (productIndex: number) => {
    const product = products[productIndex].keys;
    setSelectTamProduct((prev) =>
      prev.includes(product[0])
        ? prev.filter((item) => !product.includes(item))
        : [...prev, ...product]
    );
    setCurrentPage(1);
  };

  const filteredTAMAuctions = () => {
    if (selectTamExc.length === 0 && selectTamProduct.length === 0) {
      return TAMData;
    } else if (selectTamExc.length === 0) {
      return TAMData.filter((auction) =>
        selectTamProduct.includes(auction.product!)
      );
    } else if (selectTamProduct.length === 0) {
      return TAMData.filter((auction) =>
        selectTamExc.includes(auction.exchange!)
      );
    } else {
      return TAMData.filter(
        (auction) =>
          selectTamExc.includes(auction.exchange!) &&
          selectTamProduct.includes(auction.product!)
      );
    }
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

  const TAMTable = ({ auctions }: { auctions: TAMType[] }) => (
    <div className="detContainermain">
      <div className="contentHeading">
        <div className="large-col">Instrument Name</div>
        <div className="large-col">Date</div>
        <div className="large-col">Exchange</div>
        <div className="large-col">Product</div>
        <div className="large-col">Total Traded Volume(MWh)</div>
        <div className="large-col">Weighted Average Price(Rs/KWh)</div>
        <div className="large-col">No of Trades</div>
      </div>
      <div className="elemDetailsSec">
        {auctions.map((auction) => (
          <div className="tableDetails" key={auction.date}>
            <div className="large-col">{auction.instrument_name}</div>
            <div className="large-col">{auction.date}</div>
            <div className="large-col">{auction.exchange}</div>
            <div className="large-col">{auction.product}</div>
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
            onClick={() => setIsByChart(false)}
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
              <div style={{width:"330px"}} />
            {isCumulative &&
            <div className="flex gap-x-8">
            {  LegendComponent(
              { dataKey: "total_mu", stroke: PrimaryColor, name: "Volume(MUs)", type: 1, legendColor: PrimaryColor },
              0,
              [],
              () => {}
            )}
            {  LegendComponent(
              { dataKey: "weighted_avg_rs_per_kwh", stroke: PrimaryColor, name: "Wt. Avg Price(Rs/KWh)", yAxisId: "right" },
              1,
              [],
              () => {}
              
            )}
            </div>}
            <div className="selectButton">
              <div
                style={{ borderRadius: "8px 0px 0px 8px" }}
                className={`fiterInactive ${
                  isCumulative ? "fiterInactive" : "fiterActive"
                }`}
                onClick={() => setIsCumulative(false)}
              >
                Cumulative
              </div>
              <div
                style={{ borderRadius: "0px 8px 8px 0px" }}
                className={`fiterInactive ${
                  isCumulative ? "fiterActive" : "fiterInactive"
                }`}
                onClick={() => setIsCumulative(true)}
              >
                Comparative
              </div>
            </div>
            </div>
            <br />
            <ReMixChart
              barCategoryGap={2.6}
              onlyTitle={true}
               
              legendBreakIndex={3}
              xaxisHeight={(isCumulative || aggregateComparativeTAMData(filteredTAMAuctions()).length > 100) ? 50 : 35}
              unit="MWh"
              xAxisPosition={isCumulative ? "" : undefined}
              data={
                isCumulative
                  ? aggregateComparativeTAMData(filteredTAMAuctions())
                  : (aggregateTAMData(filteredTAMAuctions()) as any)
              }
              legends={
                !isCumulative
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
                            name: `${product.name} Volume`,
                            stroke:  lightenColor(
                              product.color,
                              20

                            ),
                            type: 1,
                          },
                        ].flat()
                      ),

                      ...getActiveChartProducts().map((product, index) =>
                        [
                          {
                            dataKey: `${product.product}_weighted_average_price_rs_mwh`,
                            name: `${product.name} Wt. Avg Price`,
                            stroke: product.color,
                            yAxisId: "right",
                          },
                        ].flat()
                      ),
                    ].flat()
              }
              showBrush={
            (aggregateComparativeTAMData(filteredTAMAuctions()).length > 10 && isCumulative) || aggregateTAMData(filteredTAMAuctions()).length > 100
              }
              brushIndex={{
                startIndex: 0,
                endIndex: isCumulative ? 15 : 100,
              }}
              xDataKey="date"
              xLabel="Date"
              yAxisLabel="Total Traded Volume(MWh)"
              secondYAxisLabel="Weighted Average Price(Rs/KWh)"
            />
          </div>
        ) : (
          <TAMTable auctions={paginatedTAMAuctions} />
        )}
      </div>
    </div>
  );
};

const EXCHANGE_TYPES = ["DEEP", "IEX", "HPX", "PXIL"];
const products = [
  { name: "Daily", key: "Daily", keys: ["Daily"] },
  {
    name: "Intra day",
    key: "Intra day",
    keys: [
      "I_DayDynamic_C",
      "Intra day",
      "IDayDynamic_HP",
      "TAMCTG-B85-SR-03-07-2024",
      "INTRA DAY",
    ],
  },
  {
    name: "Day Ahead Contingency",
    key: "Day Ahead Contingency",
    keys: [
      "Day Ahead Contingency",
      "DACDynamic",
      "TAMCTG-B75-WR-16-06-2024",
      "Contingency",
    ],
  },
  { name: "Monthly", key: "Monthly", keys: ["Monthly"] },
];

const aggregateTAMData = (tamData: TAMType[]): AggregatedTAM[] => {
  const aggregatedData: {
    [key: string]: { totalVolume: number; totalPrice: number; count: number };
  } = {};

  tamData.forEach((entry) => {
    if (
      entry.date &&
      entry.total_traded_volume_mwh !== null &&
      entry.weighted_average_price_rs_mwh !== null
    ) {
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
      date,
      total_traded_volume_mwh: totalVolume,
      weighted_average_price_rs_mwh: totalPrice / totalVolume,
      average_weighted_price_rs_mwh: totalPrice / count,
    };
  });

  return result;
};

const aggregateComparativeTAMData = (tamData: TAMType[]): ComparativeTAM[] => {
  const aggregatedData: {
    [key: string]: ComparativeTAM;
  } = {};

  tamData.forEach((entry) => {
    if (
      entry.date &&
      entry.total_traded_volume_mwh !== null &&
      entry.weighted_average_price_rs_mwh !== null
    ) {
      const { date, total_traded_volume_mwh, weighted_average_price_rs_mwh } =
        entry;

      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date,
          total_traded_volume_mwh: 0,
          total_price_rs: 0,
          average_weighted_price_rs_mwh: 0,
          weighted_average_price_rs_mwh: 0,
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
        };
      }

      aggregatedData[date].total_traded_volume_mwh +=
        toSafeFloat(total_traded_volume_mwh.toString()) * entry.no_of_trades!;
      aggregatedData[date].total_price_rs +=
        toSafeFloat(total_traded_volume_mwh.toString()) *
        toSafeFloat(weighted_average_price_rs_mwh.toString()) *
        entry.no_of_trades!;

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
    }
  });

  // const result: AggregatedTAM[] = Object.keys(aggregatedData).map((date) => {
  //   const { totalVolume, totalPrice, count } = aggregatedData[date];
  //   return {
  //     date,
  //     total_traded_volume_mwh: totalVolume,
  //     weighted_average_price_rs_mwh: totalPrice / totalVolume,
  //     average_weighted_price_rs_mwh: totalPrice / count,
  //   };
  // });

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
      total_traded_volume_mwh: total_traded_volume_mwh,
      total_price_rs: total_price_rs,
      average_weighted_price_rs_mwh: total_price_rs / total_traded_volume_mwh,
      weighted_average_price_rs_mwh: total_price_rs / total_traded_volume_mwh,
      daily_total_traded_volume_mwh: daily_total_traded_volume_mwh,
      daily_total_price_rs: daily_total_price_rs,
      daily_average_weighted_price_rs_mwh:
        daily_total_price_rs / daily_total_traded_volume_mwh,
      daily_weighted_average_price_rs_mwh:
        daily_total_price_rs / daily_total_traded_volume_mwh,
      intra_total_traded_volume_mwh: intra_total_traded_volume_mwh,
      intra_total_price_rs: intra_total_price_rs,
      intra_average_weighted_price_rs_mwh:
        intra_total_price_rs / intra_total_traded_volume_mwh,
      intra_weighted_average_price_rs_mwh:
        intra_total_price_rs / intra_total_traded_volume_mwh,
      contingency_total_traded_volume_mwh: contingency_total_traded_volume_mwh,
      contingency_total_price_rs: contingency_total_price_rs,
      contingency_average_weighted_price_rs_mwh:
        contingency_total_price_rs / contingency_total_traded_volume_mwh,
      contingency_weighted_average_price_rs_mwh:
        contingency_total_price_rs / contingency_total_traded_volume_mwh,
      monthly_total_traded_volume_mwh: monthly_total_traded_volume_mwh,
      monthly_total_price_rs: monthly_total_price_rs,
      monthly_average_weighted_price_rs_mwh:
        monthly_total_price_rs / monthly_total_traded_volume_mwh,
      monthly_weighted_average_price_rs_mwh:
        monthly_total_price_rs / monthly_total_traded_volume_mwh,
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
}
