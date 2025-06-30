import { Pie } from "@ant-design/plots";

const ApprovalStatusDonut = ({ data = [] }) => {
  const config = {
    data,
    angleField: "value",
    colorField: "stage",
    innerRadius: 0.7,
    radius: 1,
    statistic: { title: false },
    label: {
      type: "outer",
      content: "{name}: {value}",
    },
  };
  return <Pie {...config} className="w-full h-72" />;
};

export default ApprovalStatusDonut;
