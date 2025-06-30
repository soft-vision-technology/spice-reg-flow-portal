import { Area } from "@ant-design/plots";

const RegistrationsOverTimeArea = ({ data = [] }) => {
  const config = {
    data,
    xField: "date",
    yField: "count",
    seriesField: "type",
    isStack: true,
    smooth: true,
    areaStyle: { fillOpacity: 0.7 },
  };
  return <Area {...config} className="w-full h-80" />;
};

export default RegistrationsOverTimeArea;
