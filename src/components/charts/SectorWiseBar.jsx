import { Column } from "@ant-design/plots";

const SectorWiseBar = ({ data = [] }) => {
  const config = {
    data,
    xField: "value",
    yField: "sector",
    columnStyle: { radius: [0, 4, 4, 0] },
    tooltip: { showMarkers: false },
    label: {
      position: "middle",
      style: { fill: "#fff" },
    },
  };
  return <Column {...config} className="w-full h-80" />;
};

export default SectorWiseBar;