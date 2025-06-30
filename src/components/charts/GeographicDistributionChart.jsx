import { Column } from "@ant-design/plots";

const GeographicDistributionChart = ({ data = [] }) => {
  const config = {
    data,
    xField: "value",
    yField: "name",
    columnStyle: { radius: [4, 4, 0, 0] },
    tooltip: { showMarkers: false },
    label: {
      position: "middle",
      style: { fill: "#fff" },
    },
  };
  return <Column {...config} className="w-full h-96" />;
};

export default GeographicDistributionChart;