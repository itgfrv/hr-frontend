import React from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  date: string;
  count: number;
}

interface StatisticChartProps {
  name: string;
  description?: string;
  data: DataPoint[];
  loading?: boolean;
  error?: string;
}

const StatisticDataChart: React.FC<StatisticChartProps> = ({
  name,
  description,
  data,
  loading = false,
  error,
}) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: "Количество",
        data: data.map(item => item.count),
        borderColor: "rgba(59, 130, 246, 0.7)",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">{name}</h1>
      {description && (
        <p className="text-gray-600 mb-4 text-center text-sm italic">
          {description}
        </p>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Загрузка...</p>}

      {!loading && !error && (
        <div style={{ height: "400px", width: "100%" }}>
          <Chart
            type="line"
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    title: (context) => context[0].label,
                    label: (context) => `Значение: ${context.raw}`
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Дата",
                  },
                  grid: {
                    display: false
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: "Значение",
                  },
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StatisticDataChart;