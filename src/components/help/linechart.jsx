import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);


function TableLineChart({ lastData }) {


  const data = {
    labels: lastData.map(item => item.time),
    datasets: [
      {
        label: 'Temperature',
        data: lastData.map(item => item.temperature),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
      {
        label: 'Humidity',
        data: lastData.map(item => item.humidity),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
      },
      {
        label: 'Light',
        data: lastData.map(item => item.light),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      },]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Sensor',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}

export default TableLineChart;
