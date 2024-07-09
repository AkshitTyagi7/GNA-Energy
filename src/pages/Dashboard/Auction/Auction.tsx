import { useEffect, useState } from "react";
import { entityAuction } from "./entities_with_auctions"; // Adjust the import path
import "./Auction.css";
import { SearchBox } from "../../../components/Search";
import { Auction, TAM } from "../../../models/auction";

interface Entity {
  id: number;
  name: string;
}

interface FetchDataParams {
  startDate: Date;
  endDate: Date;
  entity?: string;
}

const EXCHANGE_TYPES = ["DEEP", "IEX", "HPX", "PXIL"];
const products = [
  { name: "DAILY", key: "DAILY" },
  { name: "CONTINGENCY", key: "CONTINGENCY" },
  { name: "Intra day", key: "Intra day" },
  { name: "Day Ahead Contingency", key: "Day Ahead Contingency" },
  { name: "Monthly", key: "Monthly" },
  { name: "Intraday", key: "Intraday" },
];
const TABS = ["RA", "TAM"];

const formatDateString = (date: Date): string =>
  date.toLocaleDateString("en-GB").split("/").reverse().join("-");

const fetchData = async ({ startDate, endDate, entity }: FetchDataParams) => {
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
    return data.auctions;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
};

const fetchTAMData = async ({ startDate, endDate }: FetchDataParams) => {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('start_date', startDate.toISOString().split("T")[0]);
    formData.append('end_date', endDate.toISOString().split("T")[0]);

    // Post request to https://datahub.gna.energy/tam_exchange_api
    const response = await fetch(
      'https://datahub.gna.energy/tam_exchange_api', {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let tamData: TAM[] = [];
    data.forEach((date: any) => {
      date.data.forEach((auction: any) => {
        tamData.push({
          date: date.date,
          exchange: auction.exchange,
          product: auction.product,
          total_traded_volume_mwh: auction.total_traded_volume_mwh,
          weighted_average_price_rs_mwh: auction.weighted_average_price_rs_mwh
        });
      });
    });

    return tamData;
  } catch (error) {
    console.error("Error fetching TAM data:", error);
    return [];
  }
}

const ITEMS_PER_PAGE = 100; // Define the number of items per page

export function AuctionPage() {
  const [forecastData, setData] = useState<Auction[]>([]);
  const [TAMData, setTAMData] = useState<TAM[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("RA");
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 40 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000));
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectExc, setSelectExc] = useState<string[]>([]);
  const [selectTamExc, setSelectTamExc] = useState<string[]>([]);
  const [selectTamProduct, setSelectTamProduct] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentTAMPage, setCurrentTAMPage] = useState<number>(1);

  useEffect(() => {
    fetchData({ startDate, endDate, entity: selectedEntity }).then(setData);
    fetchTAMData({ startDate, endDate }).then(setTAMData);
  }, [startDate, endDate, selectedEntity]);

  const handleSelectType = (type: string) => {
    setSelectExc((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleTAMSelectExc = (type: string) => {
    setSelectTamExc((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleTAMSelectProduct = (type: string) => {
    setSelectTamProduct((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const filteredAuctions =
    selectExc.length === 0
      ? forecastData
      : forecastData.filter((auction) =>
          selectExc.includes(auction.exchange_type__name!)
        );

  const filteredTAMAuctions = () => {
    if (selectTamExc.length === 0 && selectTamProduct.length === 0) {
      return TAMData;
    } else if (selectTamExc.length === 0) {
      return TAMData.filter((auction) =>
        selectTamProduct.includes(auction.exchange!)
      );
    } else if (selectTamProduct.length === 0) {
      return TAMData.filter((auction) =>
        selectTamExc.includes(auction.product!)
      );
    } else {
      return TAMData.filter((auction) =>
        selectTamExc.includes(auction.exchange!) && selectTamProduct.includes(auction.product!)
      );
    }
  };

  const paginatedAuctions = filteredAuctions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedTAMAuctions = filteredTAMAuctions().slice(
    (currentTAMPage - 1) * ITEMS_PER_PAGE,
    currentTAMPage * ITEMS_PER_PAGE
  );

  const RA = () => {
    return (
      <div>
        <div className="filterSection">
          <div className="search-box">
            <SearchBox
              options={entityAuction.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              selectedOptions={
                selectedEntity
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
              onChange={(e: any) => setSelectedEntity(e.label)}
              placeholder="Select Entity"
            />
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
        <AuctionTable auctions={paginatedAuctions} />
        
      </div>
    );
  };

  const TAM = () => {
    return (
      <div>
        <div className="filterSection">
          <div className="selectButton">
            {products.map((type, index) => (
              <div
                key={type.key}
                style={{
                  borderRadius:
                    index === 0
                      ? "8px 0px 0px 8px"
                      : index === products.length - 1
                      ? "0px 8px 8px 0px"
                      : undefined,
                }}
                className={
                  selectTamExc.includes(type.key) ? "fiterActive" : "fiterInactive"
                }
                onClick={() => handleTAMSelectExc(type.key)}
              >
                {type.name}
              </div>
            ))}
          </div>
          <div className="selectButton">
            {EXCHANGE_TYPES.filter((v) => v != "DEEP").map((type, index) => (
              <div
                key={type}
                style={{
                  borderRadius:
                    index === 0
                      ? "8px 0px 0px 8px"
                      : index === EXCHANGE_TYPES.length - 2
                      ? "0px 8px 8px 0px"
                      : undefined,
                }}
                className={
                  selectTamProduct.includes(type) ? "fiterActive" : "fiterInactive"
                }
                onClick={() => handleTAMSelectProduct(type)}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
        <TAMTable auctions={paginatedTAMAuctions} />
    
      </div>
    );
  };
  const TAMTable = ({ auctions }: { auctions: TAM[] }) => (
    <div className="detContainermain">
      <div className="contentHeading">
        <div className="large-col">Date</div>
        <div className="large-col">Exchange</div>
        <div className="large-col">Product</div>
        <div className="large-col">Total Traded Volume(MWh)</div>
        <div className="large-col">Weighted Average Price(Rs/MWh)</div>
      </div>
      <div className="elemDetailsSec">
        {auctions.map((auction) => (
          <div className="tableDetails" key={auction.date}>
            <div className="large-col">{auction.date}</div>
            <div className="large-col">{auction.exchange}</div>
            <div className="large-col">{auction.product}</div>
            <div className="large-col">{auction.total_traded_volume_mwh}</div>
            <div className="large-col">{auction.weighted_average_price_rs_mwh}</div>
          </div>
        ))}
            <Pagination
            currentPage={currentTAMPage}
            totalItems={filteredTAMAuctions().length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentTAMPage}
          />
      </div>
    </div>
  );
  const AuctionTable = ({ auctions }: { auctions: Auction[] }) => (
    <div className="detContainermain">
      <div className="contentHeading">
        <div className="auction_no">Auction Number</div>
        <div>Initiation Date</div>
        <div>Delivery Start Date</div>
        <div>Delivery Start Time</div>
        <div>Delivery End Date</div>
        <div>Delivery End Time</div>
        <div>Allocated Price(kWh)</div>
        <div>Allocated Quantity(MW)</div>
        <div>Buy Quantity(MW)</div>
        <div className="buyerList">Buyer</div>
        <div>Exchange</div>
      </div>
      <div className="elemDetailsSec">
        {auctions.map((auction) => (
          <div className="tableDetails" key={auction.id}>
            <div className="auction_no">{auction.auction_no}</div>
            <div>{auction.auction_initiation_date}</div>
            <div>{auction.delivery_start_date}</div>
            <div>{auction.delivery_start_time}</div>
            <div>{auction.delivery_end_date}</div>
            <div>
              {auction.delivery_end_time === "23:59:59"
                ? "24:00"
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
            totalItems={filteredAuctions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
      </div>
    </div>
  );
  
  

  return (
    <div className="auction-container">
      <div className="header">
        <h1>TAM and DEEP</h1>
        <div className="selectButton">
          {TABS.map((tab, index) => (
            <div
              onClick={() => setSelectedTab(tab)}
              key={tab}
              style={{
                borderRadius:
                  index === 0
                    ? "8px 0px 0px 8px"
                    : index === TABS.length - 1
                    ? "0px 8px 8px 0px"
                    : undefined,
              }}
              className={selectedTab == tab ? "fiterActive" : "fiterInactive"}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="date-selection">
          <input
            type="date"
            max={formatDateString(endDate)}
            value={formatDateString(startDate)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          to
          <input
            type="date"
            value={formatDateString(endDate)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>
      {selectedTab === "RA" ? <RA /> : <TAM />}
    </div>
  );
  
}



const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };
  const noOfPageShowing =10;

  // return (
  //   <div className="pagination">
  //     <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
  //       Previous
  //     </button>
  //     {Array.from({ length: totalPages }, (_, index) => (
  //       <button
  //         key={index + 1}
  //         onClick={() => handleClick(index + 1)}
  //         className={index + 1 === currentPage ? "active" : ""}
  //       >
  //         {index + 1}
  //       </button>
  //     ))}
  //     <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
  //       Next
  //     </button>
  //   </div>
  // );

  return (
    <div className="pagination">
      <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => {
        if (index+1 >= currentPage - noOfPageShowing/2 && index+1 <= currentPage + noOfPageShowing/2) {
          return (
            <button
              key={index + 1}
              onClick={() => handleClick(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
            >
              {index + 1}
            </button>
          );
        }
      })}
      <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};
