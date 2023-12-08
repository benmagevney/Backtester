import { Line } from 'react-chartjs-2';
import {
    ActiveElement,
    LineElement,
    CategoryScale,
    ChartEvent,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    PointElement,
    Tooltip,
    Filler,
} from 'chart.js';

import { DataType } from '../utils/App.type';
import { useRef } from 'react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler);

type ChartProps = {
    data: DataType,
};


const getChartData = (data: DataType) => {


    return {
        labels: data.dates.map((date) => date.split(" ")[0]),
        datasets: [
            {
                label: 'Buy Dates',
                data: data.dates.map((date, index) => data.buy_dates.includes(date) ? data.underlier_values[index] : null),
                fill: false,
                backgroundColor: 'green',
                borderColor: 'green',
                pointRadius: 5,
                showLine: false,
            },
            {
                label: 'Sell Dates',
                data: data.dates.map((date, index) => data.sell_dates.includes(date) ? data.underlier_values[index] : null),
                fill: false,
                backgroundColor: 'red',
                borderColor: 'red',
                pointRadius: 5,
                showLine: false,
            },
            {
                label: 'Percent Gain',
                data: data.underlier_values,
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    }
};


const getOptions = () => ({

});

export function BuySellChart({ data }: ChartProps) {

    const chartRef = useRef<ChartJS<'line'>>(null);

    return (
        <div style={{ paddingTop: "25px" }}>
            <Line
                ref={chartRef}
                // options={getOptions()}
                data={getChartData(data)}
            // {...props}
            />
        </div >
    )
}

