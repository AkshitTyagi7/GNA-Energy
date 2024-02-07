import { PowerAtlas } from "./pages/Dashboard/Atlas/Atlas";
import AnalysisTable from "./pages/Dashboard/AttributeAnalysis/attributteAnalysis/AnalysisTable";
import Exchange from "./pages/Dashboard/Exchange/Exchange";
import { BankingAnalytics } from "./pages/Dashboard/BankingAnalytics/BankingAalytics";
import { ConsumptionAnalytics } from "./pages/Dashboard/Consumption/Consumption";
import { MarketMontoring } from "./pages/Dashboard/MarketMonitoring/MarketMonitoring";
import { DemoPage } from "./pages/DemoPage";
import ReCharts from "./pages/Recharts";
import ReCharts2 from "./pages/Dashboard/Exchange2/Exchange2";
import { ExchangeReCharts } from "./pages/ReCharts3";
import { PriceForecasting } from "./pages/Dashboard/PriceForcating/PriceForcasting";
import { BetaMarketMontoring } from "./pages/Dashboard/MarketMonitoring/BetaMarkeMonitoring";

{/* <Route path="demoPage" element={<DemoPage />} />
<Route path="marketmonitoring" element={<MarketMontoring />} />
<Route path="bankingAnalytics" element={<BankingAnalytics />} />
<Route path="discomAnalysis" element={<AnalysisTable />} />
<Route path="consumptionAndGenerationAnalytics" element={<ConsumptionAnalytics />} />
<Route path="exchangeAnalysis" element={<Exchange />} />
<Route path="powerAtlas" element={<PowerAtlas />} />
<Route path="recharts" element={<ReCharts />} />
<Route path="attributeAnalysis" element={<AnalysisTable />} /> */}

export const DashboardRoutes=[

    {
        path:"marketmonitoring",
        element:<BetaMarketMontoring />
    },
    {
        path:"bankingAnalytics",
        element:<BankingAnalytics />
    },
    {
        path:"discomAnalysis",
        element:<AnalysisTable />
    },
    {
        path:"consumptionAndGenerationAnalytics",
        element:<ConsumptionAnalytics />
    },
    {
        path:"exchangeAnalysis",
        element:<ReCharts2 />
    },
    {
        path:"powerAtlas",
        element:<PowerAtlas />
    },
    {
        path:"recharts",
        element:<ReCharts />
    },
    {
        path:"recharts2",
        element:<ReCharts2 />,
        notPrtoected:true
    },
    {
        path:"attributeAnalysis",
        element:<AnalysisTable />
    },
    {
        path:"recharts3",
        element:<ExchangeReCharts />,
        notPrtoected:true
    },
    // <DashBoardItem title="Price Forecasting" to="priceForecasting" />
    // <DashBoardItem title="Demand Forecasting" to="demandForecasting" />
    // <DashBoardItem title="Grid Frequency Profile" to="gridFrequencyProfile" />
    {
        path:"priceForecasting",
        element:<PriceForecasting />,
    },
    {
        path:"demandForecasting",
        element:{}
    },
    {
        path:"gridFrequencyProfile",
        element:{}
    },
    // {
    //     path:"betaMarketMonitoring",
    //     element: <BetaMarketMontoring />,
    //     notPrtoected:true
    // }
]