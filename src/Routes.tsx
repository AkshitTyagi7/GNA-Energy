import { PowerAtlas } from "./pages/Dashboard/Atlas/Atlas";
import AnalysisTable from "./pages/Dashboard/AttributeAnalysis/attributteAnalysis/AnalysisTable";
import Exchange from "./pages/Dashboard/Exchange/Exchange";
import { BankingAnalytics } from "./pages/Dashboard/BankingAnalytics/BankingAalytics";
import { ConsumptionAnalytics } from "./pages/Dashboard/Consumption/Consumption";
import { MarketMontoring } from "./pages/Dashboard/MarketMonitoring/MarketMonitoring";
import { DemoPage } from "./pages/DemoPage";
import ReCharts from "./pages/Recharts";

{/* <Route path="demoPage" element={<DemoPage />} />
<Route path="marketMonioring" element={<MarketMontoring />} />
<Route path="bankingAnalytics" element={<BankingAnalytics />} />
<Route path="discomAnalysis" element={<AnalysisTable />} />
<Route path="consumptionAndGenerationAnalytics" element={<ConsumptionAnalytics />} />
<Route path="exchangeAnalysis" element={<Exchange />} />
<Route path="powerAtlas" element={<PowerAtlas />} />
<Route path="recharts" element={<ReCharts />} />
<Route path="attributeAnalysis" element={<AnalysisTable />} /> */}

export const DashboardRoutes=[
    {
        path:"demoPage",
        element:<DemoPage />
    },
    {
        path:"marketMonioring",
        element:<MarketMontoring />
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
        element:<Exchange />
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
        path:"attributeAnalysis",
        element:<AnalysisTable />
    }
]