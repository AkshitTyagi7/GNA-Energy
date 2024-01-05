import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { LineChart } from '../../../../components/charts/Charts';

const RealTime = () => {
    const data = {
        labels: ["00:15 - 00:30", "00:30 - 00:45", "00:45 - 01:00"],
        datasets: [
            {
                label: "DAM_rates_Modal",
                data: [2.9004299999999996, 2.9009799999999997, 2.83007],
                borderColor: 'red',
            },
            {
                label: "GDAM_rates_Modal",
                data: [3.06556, 2.9004299999999996, 2.9009799999999997],
                borderColor: 'blue',
            },
            {
                label: "RTM_rates_Modal",
                data: [4.055809999999999, 4.07677, 4.0690599999999995],
                borderColor: 'green',
            },
        ],
    };

    useEffect(() => {
    }, []);

    return (
        <div>
            <LineChart data={
                {
                    labels: ["00:15 - 00:30", "00:30 - 00:45", "00:45 - 01:00"],
                values:[2.9004299999999996, 2.9009799999999997, 2.83007],
                backgroundColor:['red'],
                }     
                          
            } options={{}} />
        </div>
    );
};

export default RealTime;
