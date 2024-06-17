import { useEffect } from "react";
import "./Discom.css";
import Slider from "./Slider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  GeneratorData,
  SortType,
  clearArguments,
  fetchDiscomData,
  setArguments,
  setChartIndex,
  setData,
  setPageIndex,
  setSort,
  setTableData,
  setTableType,
} from "../../../store/state/Discom/Discom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import state from "sweetalert/typings/modules/state";
import { PrimaryColor, SecondaryColor } from "../../../common";
import {
  COLORS,
} from "../../../components/recharts/ReCharts";
import { stat } from "fs";
import Select from "react-select";
import { searchStyle } from "../../../components/Search";
import { DiscomTextItem, DiscomTextItemEditable } from "./TextItem";
import { LoadingItem } from "../../../components/Loading";
import MahaGenco from "./Mahagenco";
import {ReactComponent as  AscendingIcon} from "../../../icons/ascending.svg";
import {ReactComponent as  DescendingIcon} from "../../../icons/descending.svg";
import { clear } from "console";
import { BAR_RADIUS, getColorList } from "../../../models/chart_model";
import { LegendItem } from "../../../components/recharts/components";
export function Discom() {
  const state = useSelector((state: RootState) => state.discom);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);
  const handleSort = (columnName : string) => {
    let sorted = [...state.data.data];
    let sortType = SortType.ASC;
  
    if (state.sortState.sortColumn === columnName) {
      sortType = state.sortState.sortType === SortType.ASC ? SortType.DESC : SortType.ASC;
    }
  
    switch (columnName) {
      case "Generator":
        sorted.sort((a, b) => {
          return sortType === SortType.ASC ? a.Generator.localeCompare(b.Generator) : b.Generator.localeCompare(a.Generator);
        });
        break;
      case "MUs Procured":
        sorted.sort((a, b) => {
          return sortType === SortType.ASC ? a.Adjusted_Mus - b.Adjusted_Mus : b.Adjusted_Mus - a.Adjusted_Mus;
        });
        break;
      case "Total Cost":
        sorted.sort((a, b) => {
          return sortType === SortType.ASC ? a.variable_cost - b.variable_cost : b.variable_cost - a.variable_cost;
        });
        break;
      case "PLF":
        sorted.sort((a, b) => {
          return sortType === SortType.ASC ? Number(a.Adjusted_Availability) - Number(b.Adjusted_Availability) : Number(b.Adjusted_Availability) - Number(a.Adjusted_Availability);
        });
        break;
      case "Variable Charge":
        sorted.sort((a, b) => {
          return sortType === SortType.ASC ? a.Adjusted_variable_charge - b.Adjusted_variable_charge : b.Adjusted_variable_charge - a.Adjusted_variable_charge;
        });
        break;
      default:
        break;
    }
  
    dispatch(setSort({
      sortType: sortType,
      sortColumn: columnName
    }));
    dispatch(setTableData(sorted));
  };
  return (
    <div>
      <div className="header">
        <h1>Discom</h1>
        <div className="discom-header-right">
          <DiscomTextItemEditable
            title="Total MUs"
            titleSpan="Plan"
            value={state.data.mus["Adjusted Mus"]}
            unit=""
            onChange={(value) => {
              dispatch(
                setArguments(
                  state.arguments.copyWith({
                    active_mus: value,
                  })
                )
              );
              dispatch(
                fetchDiscomData(
                  state.arguments.copyWith({
                    active_mus: value,
                  })
                ) as any
              );
            }}
          />
          <DiscomTextItem
            title="Total MUs"
            titleSpan="Actual"
            value={state.data.mus["Actual -Mus"]}
            unit=""
          />

          <DiscomTextItem
            title="Total Cost"
            titleSpan="Plan"
            value={state.data.cost[2]}
            unit="CR"
          />
          <DiscomTextItem
            title="Total Cost"
            titleSpan="Actual"
            value={state.data.cost[0]}
            unit="CR"
          />

          <button
            onClick={() => {
              dispatch(setPageIndex(0));
            }}
            className={`discom-header-button ${
              state.pageIndex === 0 ? "button-active" : ""
            }`}
          >
            MSED
          </button>
          <button
            onClick={() => {
              dispatch(setPageIndex(1));
            }}
            className={`discom-header-button ${
              state.pageIndex === 1 ? "button-active" : ""
            }`}
          >
            MAHAGENCO
          </button>
        </div>
      </div>
      {state.pageIndex === 0 && (
        <div className="body-container">
          <div className="discom-left-container">
            <div className="discom-date-select">
              <Select
                placeholder={state.data.active_month}
                defaultInputValue={state.data.active_month}
                styles={searchStyle}
                options={state.data.date_list.map(
                  (item) =>
                    ({
                      value: item,
                      label: item,
                    } as any)
                )}
                onChange={(value) => {
                  dispatch(
                    setArguments(
                      state.arguments.copyWith({
                        date_list: value!.value,
                      })
                    )
                  );
                  dispatch(
                    fetchDiscomData(
                      state.arguments.copyWith({
                        date_list: value!.value,
                      })
                    ) as any
                  );
                }}
              />
            </div>
            <div className="table-options">
              <div className="table-options-left">
                <button
                  onClick={() => {
                    dispatch(setTableType("actual"));
                  }}
                  className={`table-option-button ${
                    state.tableType === "actual" ? "button-active" : ""
                  }`}
                >
                  Actual
                </button>
                <button
                  onClick={() => {
                    dispatch(setTableType("plan"));
                  }}
                  className={`table-option-button ${
                    state.tableType === "plan" ? "button-active" : ""
                  }`}
                >
                  Plan
                </button>
              </div>
              <div onClick={
                () => {
                  dispatch(setSort({
                    sortType: SortType.ASC,
                    sortColumn: ""
                  }));
                  dispatch(
                    clearArguments()
                  );
                  fetchData();
                }
              } className="table-options-right">Clear</div>
            </div>

            <div className="discom-table">
              <table>
                <thead>
                  <tr>
                  <th
      align="center"
      onClick={() => {
        handleSort("Generator");
      }}
    >
      Generator (MW) <br /> 
      <span className="sortIcon">
        {state.sortState.sortColumn === "Generator" ? state.sortState.sortType === SortType.ASC ? <DescendingIcon /> : <AscendingIcon /> : null}
      </span>
    </th>
    <th onClick={() => handleSort("MUs Procured")}>
      MUs Procured
      <span className="sortIcon">
        {state.sortState.sortColumn === "MUs Procured" ? state.sortState.sortType === SortType.ASC ? <DescendingIcon /> : <AscendingIcon /> : null}
      </span>

    </th>
    <th onClick={() => handleSort("Total Cost")}>
      Total Cost <br /> (₹ cr)   <span className="sortIcon">
        {state.sortState.sortColumn === "Total Cost" ? state.sortState.sortType === SortType.ASC ? <DescendingIcon /> : <AscendingIcon /> : null}
      </span>
    </th>
    <th onClick={() => handleSort("PLF")}>
      PLF (%)
      <span className="sortIcon">
        {state.sortState.sortColumn === "PLF" ? state.sortState.sortType === SortType.ASC ? <DescendingIcon /> : <AscendingIcon /> : null}
      </span>
    </th>
    <th onClick={() => handleSort("Variable Charge")}>
      Variable Charge (₹/KWH)
      <span className="sortIcon">
        {state.sortState.sortColumn === "Variable Charge" ? state.sortState.sortType === SortType.ASC ? <DescendingIcon /> : <AscendingIcon /> : null}
      </span>
    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.loading && (
                    <div className="discom-table-Loading">
                      <LoadingItem />
                    </div>
                  )}
                  {state.data.data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.Generator}</td>
                        <td className="mus-procured"> {item.Adjusted_Mus}</td>
                        <td>{item.variable_cost}</td>
                        {state.tableType === "actual" ? (
                          <td>
                            {(
                              parseFloat(
                                item.Availability.toString().replace("%", "")
                              ) * 100
                            ).toFixed(2)}
                          </td>
                        ) : (
                          <td>
                            <Slider
                              currentValue={
                                ((
                                  parseFloat(
                                    item.Adjusted_Availability.toString()
                                      .replace("%", "")
                                      .replace(" ", "")
                                  ) * 100
                                ).toFixed(2) as any) || 0
                              }
                              maxValue={100}
                              minValue={0}
                              onChange={(value: number) => {
                                dispatch(
                                  setArguments(
                                    state.arguments.copyWith({
                                      active_gen: item.Generator,
                                      active_gen_val: value,
                                    })
                                  )
                                );
                                dispatch(
                                  fetchDiscomData(
                                    state.arguments.copyWith({
                                      active_gen: item.Generator,
                                      active_gen_val: value,
                                    })
                                  ) as any
                                );
                              }}
                            />
                          </td>
                        )}
                        <td>
                          {state.tableType === "actual" ? (
                            item.variable_charge
                          ) : (
                            <Slider
                              currentValue={
                                (item.Adjusted_variable_charge.toFixed(
                                  2
                                ) as any) || 0
                              }
                              maxValue={20}
                              minValue={0}
                              onChange={(value: number) => {
                                dispatch(
                                  setArguments(
                                    state.arguments.copyWith({
                                      active_charge: item.Generator,
                                      active_charge_val: value,
                                    })
                                  )
                                );
                                dispatch(
                                  fetchDiscomData(
                                    state.arguments.copyWith({
                                      active_charge: item.Generator,
                                      active_charge_val: value,
                                    })
                                  ) as any
                                );
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="discom-right-container">
            <div className="discom-right-top">
              <h1 className="chartHeading">Total Procurement</h1>
              <div className="discom-chart-header">
                <div className="discom-chart-tabs">
                  {["Total Procurement", "Total Cost", "Energy Exchange"].map(
                    (item, index) => {
                      return (
                        <button
                          className={
                            state.chartIndex === index ? "tab-active" : ""
                          }
                          onClick={() => {
                            dispatch(setChartIndex(index));
                          }}
                        >
                          {item}
                        </button>
                      );
                    }
                  )}
                </div>
                <div className="discom-chart-legend">
                  <LegendItem  color={PrimaryColor} name="Actual MUs" />
                  <LegendItem  color={SecondaryColor} name="Adjusted MUs" />
                </div>
              </div>
              <div className="discom-chart">
                {state.chartIndex == 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={state.data.data}
                      barGap={1}
                      barCategoryGap={2}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        fontSize={"10px"}
                        height={40}
                        dy={3}
                        minTickGap={4}
                        dataKey="Generator"
                      />
                      <YAxis tickCount={6} fontSize={"12px"} />
                      <Tooltip />
                      <Bar
                        dataKey="Adjusted_Mus"
                        name="Adjusted MUs"
                        fill={PrimaryColor}
                        radius={BAR_RADIUS}
                      />
                      <Bar
                        dataKey="Actual_Mus"
                        name="Actual MUs"
                        fill={SecondaryColor}
                        radius={BAR_RADIUS}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {state.chartIndex == 1 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatTotalCostData(state.data.total_cost)}>
                      <XAxis
                        fontSize={"10px"}
                        height={40}
                        dy={3}
                        minTickGap={4}
                        dataKey="generator"
                      />
                      <YAxis
                        name="Total Cost (₹ cr)"
                        tickCount={6}
                        fontSize={"12px"}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="total_cost"
                        fill={PrimaryColor}
                        radius={BAR_RADIUS}
                        isAnimationActive={false}
                      >
                        {formatTotalCostData(state.data.total_cost).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                getColorList(state.data.total_cost.length)[
                                  index
                                ]
                              }
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {state.chartIndex == 2 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatEnergyChargeData(state.data.energy_charge)}
                    >
                      <XAxis
                        fontSize={"10px"}
                        height={40}
                        dy={3}
                        minTickGap={4}
                        dataKey="Generator"
                      />
                      <YAxis
                        name="Total Cost (₹ cr)"
                        tickCount={6}
                        fontSize={"12px"}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="Energy_charge"
                        fill={PrimaryColor}
                        radius={BAR_RADIUS}
                      >
                        {state.data.energy_charge.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              getColorList(state.data.total_cost.length)[index]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="discom-right-bottom">
              <div className="discom-right-bottom-bysource">
                <h1 className="chartHeading">By Source</h1>
                <div className="discom-sourcechart-legend">
                  {formatSourceData(state.data.source).map((item, index) => {
                    return (
                      <LegendItem color={COLORS[index]} name={item.source} />
                    );
                  })}
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Tooltip />
                    {/* <Legend verticalAlign="top" /> */}
                    <Pie
                      data={formatSourceData(state.data.source)}
                      dataKey="Actual_Mus"
                      nameKey="source"
                    >
                      {formatSourceData(state.data.source).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index > COLORS.length - 1
                                  ? index - COLORS.length
                                  : index
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="discom-right-bottom-byOwnership">
                <h1 className="chartHeading">By Ownership</h1>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatOwnershipData(state.data.ownership)}>
                    <CartesianGrid vertical={false} />

                    <Tooltip />
                    <XAxis
                      fontSize={"10px"}
                      height={40}
                      dy={3}
                      minTickGap={4}
                      dataKey="ownership"
                    />
                    <YAxis fontSize={"12px"} tickCount={6} />
                    <Bar
                      dataKey="Actual_Mus"
                      name="Actual MUs"
                      fill={PrimaryColor}
                      radius={BAR_RADIUS}
                    >
                      {formatOwnershipData(state.data.ownership).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index > COLORS.length - 1
                                  ? index - COLORS.length
                                  : index
                              ]
                            }
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      {state.pageIndex === 1 && <MahaGenco />}
    </div>
  );

  function formatSourceData(data: GeneratorData[]) {
    const sourceCount: { [key: string]: number } = {};
    data.forEach((entry) => {
      const source = entry.source;
      sourceCount[source] =
        (sourceCount[source] || 0) + Number(entry.Actual_Mus);
    });
    const result = Object.keys(sourceCount).map((source) => ({
      source: source,
      Actual_Mus: Number(sourceCount[source].toFixed(2)),
    }));
    console.log(result);
    return result;
  }

  function formatOwnershipData(data: GeneratorData[]) {
    const ownershipCount: { [key: string]: number } = {};
    data.forEach((entry) => {
      const ownership = entry.ownership;
      ownershipCount[ownership] =
        (ownershipCount[ownership] || 0) + Number(entry.Actual_Mus);
    });
    const result = Object.keys(ownershipCount).map((ownership) => ({
      ownership: ownership,
      Actual_Mus: Number(ownershipCount[ownership].toFixed(2)),
    }));
    console.log(result);
    return result;
  }

  function formatEnergyChargeData(data: GeneratorData[]) {
    const result = data.map((entry) => ({
      Generator: entry.Generator,
      Energy_charge: Number(entry.Energy_charge),
    }));
    return result;
  }

  function formatTotalCostData(data: (string | number)[][]) {
    const result = data.map((entry) => ({
      generator: entry[0],
      total_cost: Number(
        (parseFloat(entry[1].toString()) / 10000000).toFixed(2)
      ),
    }));
    return result;
  }
  function fetchData() {
    dispatch(fetchDiscomData(state.arguments) as any);
  }
}
