import React, { useState } from "react";
import { ReactComponent as Logo } from "../../icons/Logo.svg";
import { ReactComponent as Cerc } from "../../icons/Cerc.svg";
import { ReactComponent as Stat } from "../../icons/Stat.svg";
import { ReactComponent as DateIcon } from "../../icons/DateIcon.svg";
import { ReactComponent as Collective } from "../../icons/Collective.svg";
import { ReactComponent as CollMar } from "../../icons/CollMar.svg";
import { ReactComponent as HPX } from "../../icons/HPX.svg";
import { ReactComponent as IconDown } from "../../icons/IconDown.svg";
import { ReactComponent as IconUp } from "../../icons/IconUp.svg";
import { ReactComponent as Pxil } from "../../icons/Pxil.svg";
import { ReactComponent as IEX } from "../../icons/IEX.svg";
import "./MarketMonitoring.css";

const MarketMonitoring = () => {
  return (
    <div className="cerccontainer">
      <div className="topNavbar">
        <Cerc />
        <div className="navHeading">CERC Market Monitor</div>
        <Logo />
      </div>
      <div className="powerSuppContainer">
        <div className="powSupPosContainer">
          <div className="powSupPos">
            <Stat style={{ fontSize: "24px" }} />
            <span>Power Supply Position</span>
          </div>
          <div className="dateTextPowSup">04 July 24</div>
        </div>
        <div className="powSupDispContainer">
          <div className="dateContainer">
            <DateIcon style={{ fontSize: "25px" }} />
            <div className="dateNow">04-07-24</div>
            <div className="datePast">03-07-24</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">
              Energy Met <br />
              (MU)
            </div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Energy Shortage (MU)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Generation Outage (MW)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Frequency (49.9-50.05)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Max Demand (MW)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Solar Hour Peak (MW)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Evening Peak (MW)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Peak Shortage (MW)</div>
            <div className="powSupToday">694.00</div>
            <div className="powSuppast">694.00</div>
          </div>
        </div>
      </div>
      <div className="collectiveMarketCont">
        <div className="cmContainer">
          <div className="collHeadContainer">
            <div className="headingContSub">
              <div className="collHeading">
                <Collective style={{ fontSize: "24px" }} />
                <span>Collective Market</span>
              </div>
              <div className="collTypesSec">
                <div className="activeCollType">DAM</div>
                <div className="inactiveCollType">G-DAM</div>
                <div className="inactiveCollType">HPDAM</div>
              </div>
            </div>
            <div className="dateTextPowSup">04 July 24</div>
          </div>
          <div className="marketContianer">
            <div className="marketTypeCont">
              <div className="marketImageArea2">
                <CollMar style={{ fontSize: "36px" }} />
              </div>
              <div className="marketTextArea">
                <div className="mcpButton">MCP</div>
              </div>
              <div className="marketTextArea">
                <div className="mcpButton">MCV</div>
              </div>
              <div className="marketTextArea">
                <div className="sellButton">Sell Bid</div>
              </div>
              <div className="marketTextArea">
                <div className="sellButton">Purchase Bid</div>
              </div>
            </div>
            <div className="marketDetailsCont">
              <div className="marketImageArea">
                <HPX style={{ height: "28px", width: "86px" }} />
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCOntDown">
                    <IconDown />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
            </div>
            <div className="marketDetailsCont">
              <div className="marketImageArea">
                <IEX style={{ height: "28px", width: "86px" }} />
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
            </div>
            <div className="marketDetailsCont">
              <div className="marketImageArea">
                <Pxil style={{ height: "28px", width: "86px" }} />
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
              <div className="marketTextArea">
                <div className="valEach">
                  <div className="mainValue1">9784.79</div>
                  <div className="iconCont">
                    <IconUp />
                    <span>7.2% </span>
                  </div>
                </div>
                <div className="valEach">
                  <div className="mainVal2">Yesterday</div>
                  <div className="mainVal2Right">9784.79</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rtmContainer">
          <div className="rtmHeadCont">
            <div className="rtmHeadText">Real Time Market</div>
            <div className="timerTxt">12:54</div>
          </div>
          <div className="rtmGraphContainer"></div>
          <div className="rtmDetailsCont">
            <div className="rtmL1">
              <CollMar style={{ height: "26px" }} />
              <div>MCP</div>
              <div>MCV</div>
            </div>
            <div className="rtmL2">
              <HPX style={{ height: "26px" }} />
              <div>987.66</div>
              <div>987.66</div>
            </div>
            <div className="rtmL2">
              <IEX style={{ height: "26px" }} />
              <div>6565</div>
              <div>554</div>
            </div>
            <div className="rtmL2">
              <Pxil style={{ height: "26px" }} />
              <div>452</div>
              <div>452</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottomText">
        Powered By <b>GNA Energy</b>
      </div>
    </div>
  );
};

export default MarketMonitoring;
