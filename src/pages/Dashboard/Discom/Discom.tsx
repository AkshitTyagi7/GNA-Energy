import { useEffect } from "react";
import "./Discom.css";
import Slider from "./Slider";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
export function Discom() {
  const data = useSelector((state: RootState) => state.discom);
  useEffect(() => {}, []);
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
                        currentValue={5}
                        maxValue={10}
                        minValue={0}
                        onChange={(value: number) => {}}
                      />
                    </td>
                    <td>
                      <Slider
                        currentValue={9}
                        maxValue={10}
                        minValue={0}
                        onChange={(value: number) => {}}
                      />
                    </td>
                  </tr>
                );
              })}
              {/* <tr>
                            <td>Adani Power</td>
                            <td className="mus-procured"> 100</td>
                            <td>100</td>
                            <td><Slider currentValue={5} maxValue={10} minValue={0} onChange={(value: number) => {
                                 
                                } }                            
                            /></td>
                            <td><Slider currentValue={9} maxValue={10} minValue={0} onChange={(value: number) => {
                                 
                                } }                            
                            /></td>
                        </tr> */}
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
}
