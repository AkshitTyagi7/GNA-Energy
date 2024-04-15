import { useEffect, useState } from "react";
import { PrimaryColor, SecondaryColor, buildHttpReq } from "../../../common";
import { tab } from "./interface/tabs";
import "./styles.css";
import { ExchangeLegend } from "./interface/legends";
import { FormatExchangeData } from "./FormatData";
import { ExchangeChart } from "./Chart";
import { ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {} from "../../../store/state/Exchange/ExchangeState";
import { LoadingItem } from "../../../components/Loading";
import swal from "sweetalert";
import { ExchangeStateData } from "../../../store/state/Exchange/interface";
import DatePicker from "react-datepicker";
import { ReactComponent as CalendarIcon } from "../../../icons/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import { COST_UNIT, MEGA_POWER_UNIT } from "../../../Units";

export function ExchangeComparion2() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const tabs: tab[] = [
    {
      name: "By Exchange",
      active: true,
    },
    {
      name: "By Product",
      active: false,
    },
    {
      name: "Realtime",
      active: false,
    },
    {
      name: "Buyers & Sellers",
      active: false,
    },
  ];

  const searchStyle = {
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: 40,
      overflowY: "auto",
    }),
    multiValue: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
    },
    multiValueLabel: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (
      base: any,
      state: {
        data: {
          value: any;
          isFixed: any;
        };
      }
    ) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };

  const Years = [2020, 2021, 2022, 2023, 2024];
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const state = useSelector((state: RootState) => state.exchange);
  let [selectedYears, setSelectedYears] = useState<
    { name: number; color: string }[]
  >([]);
  let [selectedMonths, setSelectedMonths] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date[]>([
    // 4 dates as 1 of today and 3 of the previous days
    new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
    new Date(new Date().getTime() - 21 * 24 * 60 * 60 * 1000),
  ]);
  const [loadings, setLoadings] = useState<boolean[]>([true, true, true, true]);
  const [exchangeIndex, setExchangeIndex] = useState<number>(0);
  const exchangeLegends: ExchangeLegend[] = [
    {
      name: `Price (${COST_UNIT})`,
      id: "price",
      color: PrimaryColor,
      active: true,
    },
    {
      name: `Sell Bids ${MEGA_POWER_UNIT}`,
      id: "sellBids",
      color: SecondaryColor,
      active: true,
    },
    {
      name: `Purchase Bids ${MEGA_POWER_UNIT}`,
      id: "purchaseBids",
      color: "#333333",
      active: true,
    },

    {
      name: "MCV",
      id: "mcv",
      color: "#9F9F9F",
      active: true,
    },
  ];
  const [exchangeData, setExchangeData] = useState<ExchangeStateData[]>([
    {
      iex: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      pxil: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      hpx: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
    },
    {
      iex: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      pxil: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      hpx: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
    },
    {
      iex: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      pxil: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      hpx: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
    },
    {
      iex: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      pxil: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
      hpx: {
        dam: [],
        gdam: [],
        hpdam: [],
        rtm: [],
      },
    },
  ]);

  const [productIndex, setProductIndex] = useState<number>(0);

  useEffect(() => {
    selectedDate.map((date, index) => {
      getExchangeData({
        date: date,
        index: index,
      });
    });
  }, []);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1>Exchange</h1>
        </div>
        <div className="header-side-area"></div>
      </div>
      {/* Content */}
      {/* Removing Padding for the Market Editing Page */}

      <div className={state.page != 3 ? "content2-padding-body" : ""}>
        {/* Filters */}
        {
          <div className="filters">
            <div className="legend-exchangeSelection">
              <div className="exchange-selection">
                {state.page === (0 as any)
                  ? ["IEX", "PXIL", "HPX"].map((exchange, index) => {
                      return (
                        <button
                          key={index}
                          className={`tab-small ${
                            exchangeIndex === index ? "tab-active" : ""
                          } ${
                            index === 0
                              ? "tab-left"
                              : index === 2
                              ? "tab-right"
                              : ""
                          }`}
                          onClick={() => {
                            setExchangeIndex(index);
                          }}
                        >
                          {exchange}
                        </button>
                      );
                    })
                  : ["DAM", "GDAM", "HPDAM", "RTM"].map((exchange, index) => {
                      return (
                        <button
                          key={index}
                          className={`tab-small ${
                            state.Exchange.selectedProduct === index
                              ? "tab-active"
                              : ""
                          } ${
                            index === 0
                              ? "tab-left"
                              : index === 3
                              ? "tab-right"
                              : ""
                          }`}
                          onClick={() => {}}
                        >
                          {exchange}
                        </button>
                      );
                    })}
              </div>
              <div className="legend">
                Legends
                <div className="legend-items">
                {exchangeLegends.map((legend, index) => {
                    return (
                      <div
                        key={index}
                        className={`legend-item ${
                          legend.active ? "legend-item-active" : ""
                        } ${
                          index === 0
                            ? "legend-item-left"
                            : index === exchangeLegends.length - 1
                            ? "legend-item-right"
                            : ""
                        }
                         
                        
                    `}
                      >
                        <p style={{ color: legend.color }}>
                          {" "}
                          <div
                            className="dot"
                            style={{ backgroundColor: legend.color }}
                          ></div>{" "}
                          {legend.name}
                        </p>
                      </div>
                    );
                  })}
                  {selectedYears.map((legend, index) => {
                    return (
                      <div
                        key={index}
                        className={`legend-item ${
                          index === 0
                            ? "legend-item-left"
                            : index === selectedYears.length - 1
                            ? "legend-item-right"
                            : ""
                        }
                         
                        
                    `}
                      >
                        <p style={{ color: legend.color }}>
                          {" "}
                          <div
                            className="dot"
                            style={{ backgroundColor: legend.color }}
                          ></div>{" "}
                          {legend.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        }
        {/* Chart Area */}

        <div className="exchange-chart-area">
          {exchangeData.map((exchange, index) => {
            console.log("Exchange Data Changed", exchange);
            return (
              <div className="exchange-byExchange-chart-comparison">
                <div className="exchange-comparision-chart-box">
                  {/* <h3>DAM</h3> */}

                  <div className="flex">
                    {["DAM", "GDAM", "HPDAM", "RTM"].map((exchange, index) => {
                      return (
                        <button
                          key={index}
                          className={`tab-small ${
                            productIndex === index ? "tab-active" : ""
                          } ${
                            index === 0
                              ? "tab-left"
                              : index === 3
                              ? "tab-right"
                              : ""
                          }`}
                          onClick={() => {
                            setProductIndex(index);
                          }}
                        >
                          {exchange}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 ">
                    <DatePicker
                      className="date-picker"
                      dateFormat={"dd/MM/yyyy"}
                      placeholderText="Select Date"
                      selected={selectedDate[index]}
                      maxDate={new Date()}
                      onChange={(date: Date) => {
                        setSelectedDate((prev) => {
                          let newDate = [...prev];
                          newDate[index] = date;
                          return newDate;
                        });

                        getExchangeData({
                          date: date,
                          index: index,
                        });
                      }}
                    />{" "}
                    <CalendarIcon width={20} height={20} />
                  </div>
                </div>
                {loadings[index] ? (
                  <div className="comparison-loading-container">
                    {" "}
                    <LoadingItem />{" "}
                  </div>
                ) : (
                  <ResponsiveContainer>
                    <ExchangeChart
                      data={
                        exchangeIndex === 0
                          ? productIndex === 0
                            ? exchange.iex.dam
                            : productIndex === 1
                            ? exchange.iex.gdam
                            : productIndex === 2
                            ? exchange.iex.hpdam
                            : exchange.iex.rtm
                          : exchangeIndex === 1
                          ? productIndex === 0
                            ? exchange.pxil.dam
                            : productIndex === 1
                            ? exchange.pxil.gdam
                            : productIndex === 2
                            ? exchange.pxil.hpdam
                            : exchange.pxil.rtm
                          : productIndex === 0
                          ? exchange.hpx.dam
                          : productIndex === 1
                          ? exchange.hpx.gdam
                          : productIndex === 2
                          ? exchange.hpx.hpdam
                          : exchange.hpx.rtm
                      }
                      shownLegnends={[]}
                      setShownLegends={function (legends: string[]): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </ResponsiveContainer>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  async function getExchangeData({
    date,
    index,
  }: {
    index: number;
    date: Date;
  }) {
    try {
      let startDate = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000);

      const formattedDate = date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      const formattedStartDate = startDate
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      // setExchangeLoading(true);
      setLoadings((prev) => {
        let newLoadings = [...prev];
        newLoadings[index] = true;
        return newLoadings;
      });
      let apiRes = await buildHttpReq({
        endpoint: "/all_exchange_analytics_api_range",
        body: {
          start_date: formattedStartDate,
          end_date: formattedDate,
        },
        method: "POST",
      });

      // let newExchangeData = exchangeData;
      // newExchangeData[index] = {
      //   iex: FormatExchangeData(apiRes.iex),
      //   hpx: FormatExchangeData(apiRes.hpx),
      //   pxil: FormatExchangeData(apiRes.pxil),
      // };
      // console.log("New Exchange Data", newExchangeData);
      // setExchangeLoading(false);
      // setExchangeData(newExchangeData);

      setExchangeData((prev) => {
        let newExchangeData = [...prev];
        newExchangeData[index] = {
          iex: FormatExchangeData(apiRes.iex),
          hpx: FormatExchangeData(apiRes.hpx),
          pxil: FormatExchangeData(apiRes.pxil),
        };
        return newExchangeData;
      });
      setLoadings((prev) => {
        let newLoadings = [...prev];
        newLoadings[index] = false;
        return newLoadings;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadings((prev) => {
        let newLoadings = [...prev];
        newLoadings[index] = false;
        return newLoadings;
      });
      swal(
        "Something Went Wrong",
        "Error fetching Exchange Data. Please try again later"
      );
    }
  }

  function getLoading() {
    if (state.page === 0) {
      return exchangeLoading;
    } else if (state.page === 1) {
      return exchangeLoading;
    } else {
      return false;
    }
  }
}
