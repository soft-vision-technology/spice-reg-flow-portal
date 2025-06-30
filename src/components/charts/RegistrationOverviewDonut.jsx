import { Pie } from "@ant-design/plots";

const RegistrationOverviewDonut = ({ data = [] }) => {
  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: { type: "spider", content: "{name}\n{percentage}%" },
    legend: false,
    interactions: [{ type: "element-active" }],
  };
  return <Pie {...config} className="w-full h-80" />;
};

export default RegistrationOverviewDonut;
