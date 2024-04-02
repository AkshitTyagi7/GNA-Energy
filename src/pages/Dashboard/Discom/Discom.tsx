import { useEffect } from "react";
import "./Discom.css";
import Slider from "./Slider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { fetchDiscomData } from "../../../store/state/Discom/Discom";
export function Discom() {
  const data = useSelector((state: RootState) => state.discom);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="header">
        <h1>Discom</h1>
        <div className="discom-header-right">
          <button className="discom-header-button button-active">MSED</button>
          <button className="discom-header-button">MAHAGENCO</button>
        </div>
      </div>
      <div className="body-container">
        <div className="discom-left-container">
          <div className="table-options">
            <div className="table-options-left">
              <button className="table-option-button">Actual</button>
              <button className="table-option-button button-active">
                Plan
              </button>
            </div>
            <div className="table-options-right">Clear</div>
          </div>
          <div className="discom-table">
            <table>
              <thead>
                <tr>
                  <th>Generator (MW)</th>
                  <th>MUs Procured</th>
                  <th>Total Cost (₹ cr)</th>
                  <th>PLF (%)</th>
                  <th>Variable Change (₹/KWH)</th>
                </tr>
              </thead>
              {data.data.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.Generator}</td>
                    <td className="mus-procured"> {item.Adjusted_Mus}</td>
                    <td>{item.variable_cost}</td>
                    <td>
                      <Slider
                        currentValue={(
                          parseFloat(
                            data.data.data[
                              index
                            ].Adjusted_Availability.toString()
                              .replace("%", "")
                              .replace(" ", "")
                          ) * 100
                        ).toFixed(2) as any || 0}
                        maxValue={100}
                        minValue={0}
                        onChange={(value: number) => {}}
                      />
                    </td>
                    <td>
                      <Slider
                        currentValue={item.Adjusted_variable_charge.toFixed(2) as any || 0}
                        maxValue={20}
                        minValue={0}
                        onChange={(value: number) => {}}
                      />
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        <div className="discom-right-container">
          <div className="discom-right-top">
            <h1 className="chartHeading">Total Procurement</h1>
          </div>
          <div className="discom-right-bottom">
            <div className="discom-right-bottom-bysource">
              <h1 className="chartHeading">By Source</h1>
            </div>
            <div className="discom-right-bottom-byOwnership">
              <h1 className="chartHeading">By Ownership</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function fetchData() {
    dispatch(fetchDiscomData(data.arguments) as any);
  }
}
