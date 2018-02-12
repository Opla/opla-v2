import React from "react";
import { Line } from "react-chartjs-2";

const data = {
  labels: ["02/28", "03/01", "03/02", "03/03", "03/04", "03/05", "03/06"],
  datasets: [
    {
      label: "Monthly Users",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      pointStyle: "circle",
      data: [20, 30, 40, 44, 50, 55, 56],
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      gridLines: {
        lineWidth: 0,
        color: "rgba(0,0,0,0)",
        drawBorder: false,
        zeroLineWidth: 0,
        zeroLineColor: "rgba(0,0,0,0)",
      },
    }],
  },
  legend: {
    display: true,
    position: "right",
    labels: {
      fontColor: "#666",
    },
  },
};

const styles = {
  graphContainer: {
    padding: "16px",
  },
};

const infoStyle = {
  fontSize: "24px",
  fontWeight: "300",
  color: "#666",
  paddingBottom: "20px",
};

const UsersCharts = () => (
  <div style={styles.graphContainer}>
    <div style={infoStyle}> Active users</div>
    <Line data={data} options={options} />
  </div>
);

export default UsersCharts;
