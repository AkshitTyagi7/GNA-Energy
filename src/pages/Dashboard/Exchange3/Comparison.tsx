import { useEffect, useState } from "react";
import {
  COST_UNIT,
  ENERGY_UNIT,
  MEGA_POWER_UNIT,
  VOLUME_UNIT,
} from "../../../Units";
import {
  PrimaryColor,
  QuaternaryColor,
  SecondaryColor,
  TertiaryColor,
  buildHttpReq,
  buildUrl,
} from "../../../common";
import { tab } from "./interface/tabs";
import "./styles.css";
import { ExchangeLegend } from "./interface/legends";
import {
  ComparisonData,
  ExchangeColors,
  ExchangeData,
  FormatDataOfRealtime,
  FormatExchangeData,
  RealTimeChartData,
  // formatRealTimeChartData,
} from "./FormatData";
import {
  BuyerSellerChart,
  BuyerSellerPieChart,
  ExchangeChart,
  UtilizationTrendChart,
} from "./Chart";
import { ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchExchangeData,
  setSelectedExchange,
  setSelectedProduct,
} from "../../../store/state/Exchange/ExchangeState";
import Loading, { LoadingItem } from "../../../components/Loading";
import swal from "sweetalert";
import Select from "react-select";
import { getColorList } from "../../../components/charts/ReCharts";
import { DEMO_COMPARISON_DATA } from "./DemoData";
export function ExchangeComparion() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [RealTimeChartData, setRealTimeChartData] = useState<
    RealTimeChartData[]
  >([]);
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

  const [buyerSellerPage, setBuyerSellerPage] = useState(0);

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

  const Years = [  2023, 2024];
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
  const maxDate = new Date();
  const dateOptions: {
    value: Date;
    label: string;
    color: string;
  }[] = Years.flatMap((year, i1) => {
    return Months.map((month, i2) => {
      if (new Date(year, Months.indexOf(month), 1).getTime() <= maxDate.getTime()){
        return {
          id: i1 + i2,
          value: new Date(year, Months.indexOf(month), 1),
          label: `${month} ${year}`,
          color: getColorList(Years.length * Months.length)[i1 + i2],
        };
      }
      return undefined;
    });
  }).reverse().filter((option) => option !== undefined) as {
    value: Date;
    label: string;
    color: string;
  }[];
  const state = useSelector((state: RootState) => state.exchange);
  let [selectedYears, setSelectedYears] = useState<
    { name: number; color: string }[]
  >([]);
  let [selectedMonths, setSelectedMonths] = useState<number>(0);
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState<{
    value: Date;
    label: string;
  }[]>([]);

  useEffect(() => {
    // getExchangeData({ start_date: startDate, end_date: endDate });
  }, []);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1>Exchange</h1>
        </div>
        <div className="header-side-area">
          <Select isMulti={true}
          onChange={(value) => {
            setSelectedOptions(value as any);       
            getExchangeData({ dates: value.map((e) => e.value) });
          }}
          options={
            /* date options that are not in the selected options */
            dateOptions.filter(
              (option) =>
                !selectedOptions.map((e) => e.label).includes(option.label)
            )
          }
        
          
           />
        </div>
      </div>
      {/* Content */}
      {/* Removing Padding for the Market Editing Page */}
      <div
        className="loading-container"
        style={{ display: getLoading() ? "flex" : "none" }}
      >
        <LoadingItem />
      </div>
      <div className={state.page != 3 ? "content2-padding-body" : ""}>
        {/* Filters */}
        {getActivateFilter(false) && (
          <div className="filters">
            <div className="legend-exchangeSelection">
              <div className="exchange-selection">
                {state.page === (0 as any)
                  ? ["IEX", "PXIL", "HPX"].map((exchange, index) => {
                      return (
                        <button
                          key={index}
                          className={`tab-small ${
                            state.Exchange.selectedExchange === index
                              ? "tab-active"
                              : ""
                          } ${
                            index === 0
                              ? "tab-left"
                              : index === 2
                              ? "tab-right"
                              : ""
                          }`}
                          onClick={() => {
                            dispatch(setSelectedExchange(index));
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
                          onClick={() => {
                            dispatch(setSelectedProduct(index));
                          }}
                        >
                          {exchange}
                        </button>
                      );
                    })}
              </div>
              <div className="legend">
                Legends
                <div className="legend-items">
                  {selectedOptions.map((legend, index) => {
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
                        <p style={{ color: dateOptions.filter((e)=> e.label == legend.label)[0].color }}>
                          {" "}
                          <div
                            className="dot"
                            style={{ backgroundColor: dateOptions.filter((e)=> e.label == legend.label)[0].color }}
                          ></div>{" "}
                          {legend.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Chart Area */}
        {state.page === 0 ? (
          <div className="exchange-chart-area">
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="DAM"
                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.dam
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.dam
                      : state.Exchange.data.hpx.dam
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="GDAM"
                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.gdam
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.gdam
                      : state.Exchange.data.hpx.gdam
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="HPDAM"
                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.hpdam
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.hpdam
                      : state.Exchange.data.hpx.hpdam
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="RTM"
                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.rtm
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.rtm
                      : state.Exchange.data.hpx.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <ExchangeChart
              shownLegnends={[]}
              setShownLegends={function (legends: string[]): void {}}
              data={state.Exchange.data.iex.dam}
              title="DAM"
              syncId="byProduct"
              height="6%"
              width="99%"
              showBrush={true}
              onlyBrush={true}
            />
          </div>
        ) : state.page == 1 ? (
          <div className="exchange-chart-area">
            <div className="exchange-byProduct-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="IEX"
                  data={
                    state.Exchange.selectedProduct === 0
                      ? state.Exchange.data.iex.dam
                      : state.Exchange.selectedProduct === 1
                      ? state.Exchange.data.iex.gdam
                      : state.Exchange.selectedProduct === 2
                      ? state.Exchange.data.iex.hpdam
                      : state.Exchange.data.iex.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byProduct-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="PXIL"
                  data={
                    state.Exchange.selectedProduct === 0
                      ? state.Exchange.data.pxil.dam
                      : state.Exchange.selectedProduct === 1
                      ? state.Exchange.data.pxil.gdam
                      : state.Exchange.selectedProduct === 2
                      ? state.Exchange.data.pxil.hpdam
                      : state.Exchange.data.pxil.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byProduct-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="HPX"
                  data={
                    state.Exchange.selectedProduct === 0
                      ? state.Exchange.data.hpx.dam
                      : state.Exchange.selectedProduct === 1
                      ? state.Exchange.data.hpx.gdam
                      : state.Exchange.selectedProduct === 2
                      ? state.Exchange.data.hpx.hpdam
                      : state.Exchange.data.hpx.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <ExchangeChart
              shownLegnends={[]}
              setShownLegends={function (legends: string[]): void {}}
              data={state.Exchange.data.iex.dam}
              title="DAM"
              syncId="byProduct"
              height="4%"
              width="100%"
              showBrush={true}
              onlyBrush={true}
            />
          </div>
        ) : (
          <div></div>
        )}{" "}
      </div>
    </div>
  );
  async function getExchangeData({
    dates
  }: {
    dates: Date[]
    
  }) {
    try {
    //  const res = await buildHttpReq({
    //   endpoint :  "all_exchange_multiple_api_range",
    //   method : "POST",
    //   body : dates.map((e) => (
    //     JSON.stringify(
    //     {
      
    //       start_date: e  .toLocaleDateString("en-GB")
    //       .split("/")
    //       .join("-"),

    //       /* End date is the last day of the month of start_date */
    //       end_date: new Date(e.getFullYear(), e.getMonth() + 1, 0)
    //         .toLocaleDateString("en-GB")
    //         .split("/")
    //         .join("-"),

          
        
    //   })))
      
    // })
      let comparisonData: ComparisonData[] = [];
/*       for (let i = 0; i < DEMO_COMPARISON_DATA.length; i++) {
        let data = {
          iex: FormatExchangeData(DEMO_COMPARISON_DATA[i].data.iex),
          hpx: FormatExchangeData(DEMO_COMPARISON_DATA[i].data.hpx),
          pxil: FormatExchangeData(DEMO_COMPARISON_DATA[i].data.pxil)
      
      };
        comparisonData.push({
          date: DEMO_COMPARISON_DATA[i].date_range.start_date,
          data: data,
        });

        console.log(comparison_data);
        
      } */




  //  fetch(
  //   buildUrl("all_exchange_multiple_api_range"),
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //     },
  //     body: JSON.stringify({
  //       dates: dates.map((e) => ({
  //         start_date: e
  //           .toLocaleDateString("en-GB")
  //           .split("/")
  //           .join("-"),
  //         end_date: new Date(e.getFullYear(), e.getMonth() + 1, 0)
  //           .toLocaleDateString("en-GB")
  //           .split("/")
  //           .join("-"),
  //       })),
  //     }),
  //   }
  //  ).then((res) => res.json()).then((data) => {
  //   console.log(data);


  // }
  
  // )
  

    } catch (error) {
      console.error("Error fetching data:", error);
      swal(
        "Something Went Wrong",
        "Error fetching Exchange Data. Please try again later",
        "warning"
      );
    }
  }

  function getActivateFilter(isBuyerSeller?: boolean): boolean {
    if (state.page === 0) {
      return true;
    } else if (state.page === 1) {
      return true;
    } else if (state.page === 3) {
      if (isBuyerSeller) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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
