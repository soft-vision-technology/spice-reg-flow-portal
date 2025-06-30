import { Box } from "@ant-design/plots";

const RegistrationTimeBoxPlot = ({ data = [] }) => {
  // Convert simple data to box plot format
  const boxData = data.map((item) => ({
    x: item.type,
    low: Math.max(0, item.time - 1.5),
    q1: item.time - 0.8,
    median: item.time,
    q3: item.time + 0.8,
    high: item.time + 1.5,
    outliers: [],
  }));

  const config = {
    data: boxData,
    xField: "x",
    yField: ["low", "q1", "median", "q3", "high"],
    boxStyle: {
      stroke: "#545454",
      fill: "#1890FF",
      fillOpacity: 0.3,
    },
    tooltip: {
      fields: ["low", "q1", "median", "q3", "high"],
      formatter: (datum) => {
        return {
          name: "Registration Time (days)",
          value: `Median: ${datum.median}`,
        };
      },
    },
  };
  return <Box {...config} className="w-full h-80" />;
};

export default RegistrationTimeBoxPlot;
