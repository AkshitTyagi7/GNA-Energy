import React from 'react';
import { ReactComponent as Stat } from "../../icons/Stat.svg";
import { ReactComponent as DateIcon } from "../../icons/DateIcon.svg";
import { CsrcPSSPData } from '../../models/csrc';

interface DataDisplayProps {
  title: string;
  latestData: string | number;
  prevData: string | number;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ title, latestData, prevData }) => (
  <div className="eachEnergyContainer">
    <div className="powSupHeading">{title}</div>
    <div className="powSupToday">{latestData}</div>
    <div className="powSuppast">{prevData}</div>
  </div>
);

interface PowerSupplyData {
  date: string;
  enrgy_met_mu: number;
  enrgy_shrtage_mu: number;
  outage: number;
  frequency: number;
  max_demand_met_during_the_day_mw_from_nldc_scada: number;
  solar_hour_peak: number;
  demand_met_during_evening_peak_hrsmw_at_19_00_hrs_from_rldcs: number;
  peak_shrtage_mw: number;
}


interface PowerSupplyComponentProps {
  pspdata: CsrcPSSPData ;
}

const PowerSupplyComponent: React.FC<PowerSupplyComponentProps> = ({ pspdata }) => {
  if (!pspdata) return null;

  const { latest, prev } = pspdata;
  const dataFields = [
    { title: 'Energy Met (MU)', key: 'enrgy_met_mu' },
    { title: 'Energy Shortage (MU)', key: 'enrgy_shrtage_mu' },
    { title: 'Generation Outage (MW)', key: 'outage' },
    { title: 'Frequency (49.9-50.05)', key: 'frequency' },
    { title: 'Max Demand (MW)', key: 'max_demand_met_during_the_day_mw_from_nldc_scada' },
    { title: 'Solar Hour Peak (MW)', key: 'solar_hour_peak' },
    { title: 'Evening Peak (MW)', key: 'demand_met_during_evening_peak_hrsmw_at_19_00_hrs_from_rldcs' },
    { title: 'Peak Shortage (MW)', key: 'peak_shrtage_mw' },
  ];

  return (
    <div className="powerSuppContainer">
      <div className="powSupPosContainer">
        <div className="powSupPos">
          <Stat style={{ fontSize: '24px' }} />
          <span>Power Supply Position</span>
        </div>
        <div className="dateTextPowSup">{latest.data.date}</div>
      </div>
      <div className="powSupDispContainer">
        <div className="dateContainer">
          <DateIcon style={{ fontSize: '25px' }} />
          <div className="dateNow">{latest.data.date}</div>
          <div className="datePast">{prev.data.date}</div>
        </div>
        {dataFields.map(({ title, key }) => (
          <DataDisplay
            key={key}
            title={title}
            latestData={latest.data[key as keyof PowerSupplyData]}
            prevData={prev.data[key as keyof PowerSupplyData]}
          />
        ))}
      </div>
    </div>
  );
};

export default PowerSupplyComponent;
