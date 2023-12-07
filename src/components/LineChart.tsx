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
} from 'chart.js';

import { DataType } from '../utils/App.type';
import { useRef } from 'react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type ChartProps = {
    data: DataType,
};

const getChartData = (data: DataType) => (
    {
        labels: data.dates.map((date) => date.split(" ")[0]),
        datasets: [
            {
                label: 'Strategy Values',
                data: data.strategy_values,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Underlier Values',
                data: data.underlier_values,
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    }
);


const getOptions = () => ({

});

export function LineChart({ data }: ChartProps) {

    const chartRef = useRef<ChartJS<'line'>>(null);


    return (
        <>
            <Line
                ref={chartRef}
                // options={getOptions()}
                data={getChartData(data)}
            // {...props}
            />
        </>
    )
}

