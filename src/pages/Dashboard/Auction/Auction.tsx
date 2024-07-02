import { useEffect, useState } from "react";
import { entityAuction } from './entities_with_auctions'; // Adjust the import path
import './Auction.css';
import { SearchBox } from "../../../components/Search";

interface Auction {
  id: number;
  accepted_price_kwh: number | null;
  allocated_quantity_mw: number | null;
  auction_initiation_date: string | null;
  auction_initiation_time: string | null;
  auction_no: string | null;
  auction_result_date: string | null;
  auction_result_time: string | null;
  booking_accepted_price_kwh: number | null;
  total_count_of_sellers_who_participated_in_the_auction: number | null;
  booking_quantity_mw: number | null;
  buy_minimum_quantity_mw: number | null;
  buy_total_quantity_mw: number | null;
  buyer__name: string | null; // Assuming buyer's name
  delivery_end_date: string | null;
  delivery_end_time: string | null;
  delivery_start_date: string | null;
  delivery_start_time: string | null;
  duplicate: number | null;
  exchange_type__name: string | null; // Assuming exchange type's name
  requisition_no: string | null;
  type__name: string | null; // Assuming type's name
}

interface Entity {
  id: number;
  name: string;
}

export function AuctionPage() {
  const [forecastData, setData] = useState<Auction[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 100 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
  );
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const maxDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    fetchData({
      startDate: startDate,
      endDate: endDate,
      entity: selectedEntity,
    });
  }, [startDate, endDate, selectedEntity]);

  async function fetchData({ startDate, endDate, entity }: { startDate: Date; endDate: Date; entity: string }) {
    try {
      const response = await fetch(
        `https://api-data.gna.energy/data/search-auction/?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&buyer=${entity}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setData(data.auctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  }

  return (
    <div className="auction-container">
      <div className="header">
        <h1>Auctions</h1>
        <div className="search-box">
          <SearchBox
            options={entityAuction.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            selectedOptions={
                selectedEntity !== '' ? [{ label: selectedEntity, value: entityAuction.find((item) => item.name === selectedEntity)?.id }] : []
            }
            onChange={(e: any) => {
              setSelectedEntity(e.label);
            }}
            placeholder="Select Entity"
          />
        </div>
        <div className="date-selection">
          <input
            type="date"
            max={endDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            value={startDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            onChange={(e) => {
              setStartDate(new Date(e.target.value));
            }}
          />
          to
          <input
            type="date"
            max={maxDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            value={endDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            onChange={(e) => {
              setEndDate(new Date(e.target.value));
            }}
          />
        </div>
      </div>
      <div className="container2 content2-padding-body">
        <div className="onechart-container">
          <h1 className="chartHeading">Auctions</h1>
          <div className="auction-table-wrapper">
          <table className="auction-table">
            <thead>
              <tr>
                <th>Initiation Date</th>
                <th>Initiation Time</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Price (kWh)</th>
                <th>Quantity (MW)</th>
                <th>Buyer</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody className="auction-table-body">
              {forecastData.map((auction) => (
                <tr key={auction.id}>
                  <td>{auction.auction_initiation_date}</td>
                  <td>{auction.auction_initiation_time}</td>
                  <td>{auction.delivery_start_date}</td>
                  <td>{auction.delivery_start_time}</td>
                  <td>{auction.delivery_end_date}</td>
                  <td>{auction.delivery_end_time}</td>
                  <td>{auction.accepted_price_kwh?.toFixed(2)}</td>
                  <td>{auction.allocated_quantity_mw}</td>
                  <td>{auction.buyer__name}</td>
                  <td>{auction.exchange_type__name}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
  );
}
