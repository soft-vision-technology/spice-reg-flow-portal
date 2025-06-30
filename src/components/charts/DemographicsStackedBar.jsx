import { Column } from "@ant-design/plots";

const DemographicsStackedBar = ({ data = [] }) => {

  const config = {
    data,
    isStack: true,
    xField: "value",
    yField: "category",
    seriesField: "type",
    legend: { position: "top-left" },
  };
  return <Column {...config} className="w-full h-80" />;
};

export default DemographicsStackedBar;