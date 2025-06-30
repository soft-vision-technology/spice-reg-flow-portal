import { Funnel } from "@ant-design/plots";

export const RegistrationFunnel = ({ data = [] }) => {
  // data = [ { stage: "Registered", value: 1000 }, ...] ordered
  const config = {
    data,
    xField: "stage",
    yField: "value",
    conversionTag: {
      visible: true,
      offsetX: 10,
      formatter: (datum, datumPrev) => {
        if (!datumPrev) return "";
        const rate = ((datum.value / datumPrev.value) * 100).toFixed(1);
        return `${rate}%`;
      },
    },
    dynamicHeight: true,
    color: ["#5B8FF9", "#61DDAA", "#F6BD16", "#E8684A", "#6DC8EC"],
  };
  return <Funnel {...config} className="w-full h-96" />;
};

export default RegistrationFunnel;
