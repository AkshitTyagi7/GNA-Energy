import { useEffect } from "react"
import { FormatConsumptionData } from "./FormatData"
import { ConsumptionData } from "./Data"

export function BetaConsumption(){
    useEffect(() => {
        FormatConsumptionData(ConsumptionData)
    }, [])
    return (
        <div>
            <h1>Beta Consumption</h1>
        </div>
    )

}