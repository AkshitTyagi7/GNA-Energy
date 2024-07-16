import React, { useState } from "react";
import { Auction } from "../../../models/auction";
import {
  LegendComponent,
  lightenColor,
  ReMixChart,
} from "../../../components/recharts/ReMixCharts";
import {
  FormatAuctionDaily,
  FormatAuctionDailyComparison,
  FormatAuctionMonthly,
  FormatAuctionMonthlyComparison,
} from "./FormatData";
import {
  ColorGray,
  PrimaryColor,
  SecondaryColor,
  TertiaryColor,
} from "../../../common";
import { SearchBox } from "../../../components/Search";
import { Pagination } from "./Pagination";
import Loading from "../../../components/Loading";
import { BrushStart } from "../../../models/chart_model";
import { COLORS } from "../../../components/recharts/ReCharts";
import { ExchangeColors } from "../Exchange3/FormatData";

interface RAProps {
  forecastData: Auction[];
  startDate: Date;
  endDate: Date;
  loading: boolean;
}

export const RA: React.FC<RAProps> = ({
  forecastData,
  startDate,
  endDate,
  loading,
}) => {
  const [isByChart, setIsByChart] = useState<boolean>(false);
  const [isByMonthlyChart, setIsByMonthlyChart] = useState<boolean>(false);
  const [isComparative, setIsComparative] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<string[]>([]);
  const [selectExc, setSelectExc] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const EXCHANGE_COLOR_MAP: { [key: string]: string } = {
    DEEP: ExchangeColors[1],
    IEX: ExchangeColors[2],
    HPX: ExchangeColors[3],
    PXIL: ExchangeColors[4],
  };

  const ITEMS_PER_PAGE = 100;

  const handleSelectType = (type: string) => {
    setSelectExc((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const filteredAuctions = (filterByEntity = true): Auction[] => {
    let res = forecastData;
    if (selectExc.length > 0) {
      res = res.filter((auction) =>
        selectExc.includes(auction.exchange_type__name!)
      );
    }
    if (selectedEntity.length > 0 && filterByEntity) {
      res = res.filter((auction) =>
        selectedEntity.includes(auction.buyer__name!)
      );
    }
    return res;
  };

  const getActiveExc = () => {
    return selectExc.length > 0 ? selectExc : EXCHANGE_TYPES;
  };

  const paginatedAuctions = filteredAuctions().slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const AuctionTable = ({ auctions }: { auctions: Auction[] }) => (
    <div className="detContainermain">
      <div className="contentHeading">
        <div className="auction_no">Auction Number</div>
        <div>Initiation/Auction Date</div>
        <div>Delivery Start Date</div>
        <div>Delivery Start Time</div>
        <div>Delivery End Date</div>
        <div>Delivery End Time</div>
        <div>Allocated Price(kWh)</div>
        <div>Allocated Quantity(MW)</div>
        <div>Buy Quantity(MW)</div>
        <div className="buyerList2">Buyer</div>
        <div>Exchange</div>
      </div>
      <div className="elemDetailsSec">
        {auctions.map((auction) => (
          <div className="tableDetails" key={auction.id}>
            <div className="auction_no">{auction.auction_no}</div>
            <div>{formatDMY(auction.auction_initiation_date as any)}</div>
            <div>{formatDMY(auction.delivery_start_date as any)}</div>
            <div>{auction.delivery_start_time}</div>
            <div>{formatDMY(auction.delivery_end_date as string)}</div>
            <div>
              {auction.delivery_end_time === "23:59:59"
                ? "24:00:00"
                : auction.delivery_end_time}
            </div>
            <div>{auction.accepted_price_kwh?.toFixed(2)}</div>
            <div>{auction.allocated_quantity_mw}</div>
            <div>{auction.buy_total_quantity_mw}</div>
            <div className="buyerList2">{auction.buyer__name}</div>
            <div>{auction.exchange_type__name}</div>
          </div>
        ))}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAuctions().length}
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
        <div className="search-box">
          <SearchBox
            options={filteredAuctions(false)
              .map((auction) => ({
                label: auction.buyer__name!,
                value: auction.buyer__name!,
              }))
              .filter(
                (v, i, a) => a.findIndex((t) => t.value === v.value) === i
              )}
            isMany={true}
            selectedOptions={selectedEntity.map((entity) => ({
              label: entity,
              value: entity,
            }))}
            onChange={(e: any) =>
              setSelectedEntity(e.map((item: any) => item.value))
            }
            placeholder="Select Entity"
          />
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
          {EXCHANGE_TYPES.map((type, index) => (
            <div
              key={type}
              style={{
                borderRadius:
                  index === 0
                    ? "8px 0px 0px 8px"
                    : index === EXCHANGE_TYPES.length - 1
                    ? "0px 8px 8px 0px"
                    : undefined,
              }}
              className={
                selectExc.includes(type) ? "fiterActive" : "fiterInactive"
              }
              onClick={() => handleSelectType(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>
      <div className="detContainermain">
        {isByChart ? (
          <div className="raChart">
            <div className="flex justify-between">
              <div className="selectButton">
                <div
                  style={{ borderRadius: "8px 0px 0px 8px" }}
                  className={`fiterInactive ${
                    isComparative ? "fiterInactive" : "fiterActive"
                  }`}
                  onClick={() => setIsComparative(false)}
                >
                  Cumulative
                </div>
                <div
                  style={{ borderRadius: "0px 8px 8px 0px" }}
                  className={`fiterInactive ${
                    isComparative ? "fiterActive" : "fiterInactive"
                  }`}
                  onClick={() => setIsComparative(true)}
                >
                  Comparative
                </div>
              </div>
              {isComparative && (
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
              )}
              <div className="selectButton">
                <div
                  style={{ borderRadius: "8px 0px 0px 8px" }}
                  className={`fiterInactive ${
                    isByMonthlyChart ? "fiterInactive" : "fiterActive"
                  }`}
                  onClick={() => setIsByMonthlyChart(false)}
                >
                  Daily
                </div>
                <div
                  style={{ borderRadius: "0px 8px 8px 0px" }}
                  className={`fiterInactive ${
                    isByMonthlyChart ? "fiterActive" : "fiterInactive"
                  }`}
                  onClick={() => setIsByMonthlyChart(true)}
                >
                  Monthly
                </div>
              </div>
            </div>
            {!isComparative ? (
              <ReMixChart

              onlyTitle={true}

                data={
                  isByMonthlyChart
                    ? FormatAuctionMonthly({
                        start_date: formatDateString(startDate),
                        end_date: formatDateString(endDate),
                        auctions: filteredAuctions(),
                      })
                    : (FormatAuctionDaily({
                        auctions: filteredAuctions(),
                        start_date: startDate.toString(),
                        end_date: endDate.toString(),
                      }) as any)
                }
                xDataKey="date"
                legends={[
                  {
                    dataKey: "total_mu",
                    stroke: "#E0E0E0",
                    name: "Total MU",
                    type: 1,
                    legendColor: "rgb(159, 159, 159)",
                  },
                  {
                    dataKey: "weighted_avg_rs_per_kwh",
                    stroke: PrimaryColor,
                    name: "Wt. Avg Price(Rs/KWh)",
                    yAxisId: "right",
                  },
                ]}
                xaxisHeight={35}
                unit="MUs"
                secondYAxisLabel="Weighted Average Price(Rs/KWh)"
                xLabel="Date"
                yAxisLabel="Total MUs"
              />
            ) : (
              <ReMixChart
              onlyTitle={true}

                data={
                  isByMonthlyChart
                    ? FormatAuctionMonthlyComparison({
                        start_date: formatDateString(startDate),
                        end_date: formatDateString(endDate),
                        auctions: filteredAuctions(),
                      })
                    : (FormatAuctionDailyComparison({
                        auctions: filteredAuctions(),
                        start_date: startDate.toString(),
                        end_date: endDate.toString(),
                      }) as any)
                }
                xDataKey="date"
                legendBreakIndex={3}
                xaxisHeight={50}
                xAxisPosition=""
                legends={[
                  ...getActiveExc()
                    .map((type, index) =>
                      [
                        {
                          dataKey: `total_mu_${type.toLowerCase()}`,
                          stroke: lightenColor(EXCHANGE_COLOR_MAP[type], 15),
                          name: `${type} Volume`,
                          type: 1,
                        },
                      ].flat()
                    )
                    .flat(),
                  // {} as any,
                  ...getActiveExc()
                    .map(
                      (type, index) =>
                        [
                          {
                            dataKey: `weighted_avg_rs_per_kwh_${type.toLowerCase()}`,
                            stroke: EXCHANGE_COLOR_MAP[type],
                            name: `${type} Wt. Avg Price`,
                            yAxisId: "right",
                          },
                        ].flat()
                      // { dataKey: `total_mu_${type.toLowerCase()}`, stroke: ExchangeColors[index + 1], name: `${type} Total MU`, type: 1 }
                    )
                    .flat(),
                ]}
                brushIndex={{
                  startIndex: 0,
                  endIndex: 10,
                }}
                unit="MUs"
                secondYAxisLabel="Weighted Average Price(Rs/KWh)"
                xLabel="Date"
                yAxisLabel="Total MUs"
                showBrush={
                  !isByMonthlyChart &&
                  (
                    FormatAuctionDailyComparison({
                      auctions: filteredAuctions(),
                      start_date: startDate.toString(),
                      end_date: endDate.toString(),
                    }) as any
                  ).length > 10
                }
              />
            )}
          </div>
        ) : (
          <AuctionTable auctions={paginatedAuctions} />
        )}
      </div>
    </div>
  );
};

const EXCHANGE_TYPES = ["DEEP", "IEX", "HPX", "PXIL"];

const formatDateString = (date: Date): string =>
  date.toLocaleDateString("en-GB").split("/").reverse().join("-");

const formatDMY = (date: string): string =>
// input date format as yyyy-mm-dd, output date format as dd-mm-yyyy
  date.split("-").reverse().join("-");
