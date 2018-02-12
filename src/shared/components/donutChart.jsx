import React from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";

const data = [{
  labels: [
    "Web",
    "Facebook",
    "Slack",
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
    ],
    hoverBackgroundColor: [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
    ],
  }],
},
{
  labels: [
    "Fr",
    "Us",
  ],
  datasets: [{
    data: [50, 150],
    backgroundColor: [
      "#FF6384",
      "#36A2EB",
    ],
    hoverBackgroundColor: [
      "#FF6384",
      "#36A2EB",
    ],
  }],
},
{
  labels: [
    "French",
  ],
  datasets: [{
    data: [300],
    backgroundColor: [
      "#FFCE56",
    ],
    hoverBackgroundColor: [
      "#FFCE56",
    ],
  }],
},
{
  labels: [
    "18-24",
  ],
  datasets: [{
    data: [100],
    backgroundColor: [
      "#FF6384",
    ],
    hoverBackgroundColor: [
      "#FF6384",
    ],
  }],
},
];

const options = {
  legend: {
    display: false,
  },
};

const infoStyle = {
  textAlign: "center",
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  padding: "20px 0",
  lineHeight: "1.1",
};

const DonutChart = ({ title, dataset }) => (
  <div>
    <Doughnut data={data[dataset]} options={options} />
    <div style={infoStyle}>{title}</div>
  </div>
);

DonutChart.propTypes = {
  title: PropTypes.string.isRequired,
  dataset: PropTypes.number.isRequired,
};

export default DonutChart;
