import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { Temperature } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: Temperature[];
}

export function TemperatureChart({ data }: Props) {
  const chartData: ChartData<'line'> = {
    labels: data.map((temp) => format(new Date(temp.date), 'HH:mm')),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map((temp) => temp.temperature),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}