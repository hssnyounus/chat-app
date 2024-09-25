import React from 'react';
import { Line, Doughnut } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend, plugins, scales } from "chart.js";
import { getLast7Days } from '../../lib/features';


ChartJS.register(
    CategoryScale,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend

);

const labels = getLast7Days();

const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false
        },
    },

    scales: {
        x: {
            grid: {
                display: false
            }

        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            }

        }
    }
}

const LineChart = ({ value = [] }) => {

    const data = {
        labels,
        datasets: [
            {
                data: value,
                label: "Revenue",
                fill: true,
                backgroundColor: "rgba(75,12,192,0.3)",
                borderColor: "rgba(75,12,192,1)"
            }
        ],
    };

    return <Line data={data} options={lineChartOptions} />
};


const doughnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
    },
    cutout: 120
}

const DoughnutChart = ({ value = [], labels = [] }) => {

    const data = {
        labels,
        datasets: [
            {
                data: value,
                label: "Total Chats vs Group Chats",
                fill: true,
                backgroundColor: ["rgba(75,12,192,0.3)", "orange"],
                borderColor: ["rgba(75,12,192,1)", "orange"],
                offset: 40
            }
        ],
    };

    return <Doughnut style={{ zIndex: 10 }} data={data} options={doughnutChartOptions} />
};

export {
    LineChart,
    DoughnutChart
}