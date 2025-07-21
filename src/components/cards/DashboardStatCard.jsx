import React from "react";
import { Card, Statistic } from "antd";

const DashboardStatCard = ({ title, value, icon, color }) => {
  return (
    <Card className="text-center border-0 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer rounded-lg overflow-hidden relative">
      <div
        className="absolute top-0 left-0 w-full h-1 group-hover:h-2 transition-all duration-300"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${color}, transparent)`,
        }}
      />
      <div className="relative z-10 pt-2">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${color}1A` }}
        >
          {React.cloneElement(icon, {
            style: { color: color, fontSize: "20px" },
          })}
        </div>
        <Statistic
          title={title}
          value={value || 0}
          valueStyle={{
            color: color,
            fontSize: "24px",
            fontWeight: "bold",
          }}
          formatter={(val) => Number(val).toLocaleString()}
        />
      </div>
    </Card>
  );
};

export default DashboardStatCard;
