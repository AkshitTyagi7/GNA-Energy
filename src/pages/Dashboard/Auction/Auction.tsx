import { useEffect, useState } from "react";
import { entityAuction } from "./entities_with_auctions"; // Adjust the import path
import "./Auction.css";
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
  console.debug(forecastData);
  const [allForcastData, setAllForcastData] = useState<Auction[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 100 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
  );
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const maxDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);

  const [selectExc, setSelectExc] = useState<any[]>([]);
  const [priceCheck, setPriceCheck] = useState<boolean>(false);
  const [quantityCheck, setQuantityCheck] = useState<boolean>(false);

  function isElementInArray<T>(element: T, array: T[]): boolean {
    return array.includes(element);
  }

  const handleSelectType = (val: any) => {
    const index = selectExc.indexOf(val);
    if (index !== -1) {
      if (selectExc.length == 1) {
        fetchData({
          startDate: startDate,
          endDate: endDate,
          entity: selectedEntity,
        });
      } else {
        setData(forecastData.filter((i) => i.exchange_type__name !== val));
      }
      setSelectExc(selectExc.filter((ele) => ele != val));
    } else {
      let data = allForcastData.filter(
        (ele) => ele.exchange_type__name === val
      );
      if (selectExc.length == 0) {
        setData(data);
      } else {
        setData((prev: any[]) => [...prev, ...data]);
      }
      setSelectExc((prev) => [...prev, val]);
    }
  };

  const handleSelectPrice = () => {
    if (priceCheck) {
      setPriceCheck(false);
      let data = allForcastData.filter((ele) => ele.accepted_price_kwh == null);
      setData((prev) => [...prev, ...data]);
      return;
    }
    let data = forecastData.filter((ele) => ele.accepted_price_kwh != null);
    if (quantityCheck) {
      setData((prev) => [...prev, ...data]);
    } else {
      setData(data);
    }
    setPriceCheck(true);
  };
  const handleSelectQuantity = () => {
    if (quantityCheck) {
      let data = allForcastData.filter(
        (ele) => ele.allocated_quantity_mw == null
      );
      setData((prev) => [...prev, ...data]);
      setQuantityCheck(false);
      return;
    }

    let data = forecastData.filter((ele) => ele.allocated_quantity_mw != null);
    if (quantityCheck) {
      setData((prev) => [...prev, ...data]);
    } else {
      setData(data);
    }
    setQuantityCheck(true);
  };

  useEffect(() => {
    fetchData({
      startDate: startDate,
      endDate: endDate,
      entity: selectedEntity,
    });
  }, [startDate, endDate, selectedEntity]);

  async function fetchData({
    startDate,
    endDate,
    entity,
  }: {
    startDate: Date;
    endDate: Date;
    entity: string;
  }) {
    try {
      const response = await fetch(
        `https://api-data.gna.energy/data/search-auction/?start_date=${
          startDate.toISOString().split("T")[0]
        }&end_date=${endDate.toISOString().split("T")[0]}&buyer=${entity}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setData(data.auctions);
      setAllForcastData(data.auctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
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
              selectedEntity !== ""
                ? [
                    {
                      label: selectedEntity,
                      value: entityAuction.find(
                        (item) => item.name === selectedEntity
                      )?.id,
                    },
                  ]
                : []
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
      <div className="filterSection">
        <div className="selectButton">
          <div
            style={{
              borderRadius: "8px 0px 0px 8px",
            }}
            className={
              isElementInArray("DEEP", selectExc)
                ? "fiterActive"
                : "fiterInactive"
            }
            onClick={() => handleSelectType("DEEP")}
          >
            DEEP
          </div>
          <div
            className={
              isElementInArray("IEX", selectExc)
                ? "fiterActive"
                : "fiterInactive"
            }
            onClick={() => handleSelectType("IEX")}
          >
            IEX
          </div>
          <div
            style={{
              borderRadius: "0px 8px 8px 0px",
            }}
            className={
              isElementInArray("PXIL", selectExc)
                ? "fiterActive"
                : "fiterInactive"
            }
            onClick={() => handleSelectType("PXIL")}
          >
            PXIL
          </div>
        </div>
      </div>
      <div className="detContainermain">
        <div className="contentHeading">
          <div>Initiation Date</div>
          <div>Initiation Time</div>
          <div>Start Date</div>
          <div>Start Time</div>
          <div>End Date</div>
          <div>End Time</div>
          <div>Allocated Price(kWh)</div>
          <div>Allocated Quantity(MW)</div>
          <div>Buy Quantity(MW)</div>
          <div className="buyerList">Buyer</div>
          <div>Exchange</div>
        </div>
        <div className="elemDetailsSec">
          {forecastData.map((auction) => (
            <div className="tableDetails" key={auction.id}>
              <div>{auction.auction_initiation_date}</div>
              <div>{auction.auction_initiation_time}</div>
              <div>{auction.delivery_start_date}</div>
              <div>{auction.delivery_start_time}</div>
              <div>{auction.delivery_end_date}</div>
              <div>{auction.delivery_end_time}</div>
              <div>{auction.accepted_price_kwh?.toFixed(2)}</div>
              <div>{auction.allocated_quantity_mw}</div>
              <div>{auction.buy_total_quantity_mw}</div>
              <div className="buyerList2">{auction.buyer__name}</div>
              <div>{auction.exchange_type__name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
