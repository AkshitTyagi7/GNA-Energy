import { PowerAtlas } from "./pages/Dashboard/Atlas/Atlas";
import AnalysisTable from "./pages/Dashboard/AttributeAnalysis/attributteAnalysis/AnalysisTable";
import Exchange from "./pages/Dashboard/Exchange/Exchange";
import { BankingAnalytics } from "./pages/Dashboard/BankingAnalytics/BankingAalytics";
import { ConsumptionAnalytics } from "./pages/Dashboard/Consumption/Consumption";
import { MarketMontoring } from "./pages/Dashboard/MarketMonitoring/MarketMonitoring";
import { DemoPage } from "./pages/DemoPage";
import { ExchangeReCharts } from "./pages/ReCharts3";
import { PriceForecasting } from "./pages/Dashboard/PriceForcating/PriceForcasting";
import { BetaMarketMontoring } from "./pages/Dashboard/MarketMonitoring/BetaMarkeMonitoring";
import { BetaConsumption } from "./pages/Dashboard/Consumption/BetaConsumption";
import { Exchange3 } from "./pages/Dashboard/Exchange3/Exchange3";
import { Discom } from "./pages/Dashboard/Discom/Discom";
import { ExchangeComparion } from "./pages/Dashboard/Exchange3/Comparison";
import { ExchangeComparion2 } from "./pages/Dashboard/Exchange3/Comparison2";

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
        element:<MarketMontoring />,
        noDefaultPadding: true

    },
    {
        path:"bankingAnalytics",
        element:<BankingAnalytics />
    },
    {
        path:"discomAnalysis",
        element:<Discom />,
        noDefaultPadding: true

    },
    {
        path:"consumptionAndGenerationAnalytics",
        element:<BetaConsumption />
    },
    {
        path:"exchangeAnalysis",
        element:<Exchange3 />,
        noDefaultPadding: true
    },
    {
        path:"powerAtlas",
        element:<PowerAtlas />
    },

    {
        path:"attributeAnalysis",
        element:<AnalysisTable />
    },

    {
        path:"priceForecasting",
        element:<PriceForecasting />,
        noDefaultPadding:true
    },

    {
        path:"demandForecasting",
        element:{}
    },
    {
        path:"gridFrequencyProfile",
        element:{}
    },
    {
        path:"betaConsumption",
        element: <BetaConsumption />,
        notPrtoected:true
    }
    // {
    //     path:"betaMarketMonitoring",
    //     element: <BetaMarketMontoring />,
    //     notPrtoected:true
    // }
]