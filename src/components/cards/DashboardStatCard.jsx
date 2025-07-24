import React from "react";
import { Card, Statistic } from "antd";

const DashboardStatCard = ({ title, value, icon, color }) => {
  return (
    <Card 
      className="border-0 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer overflow-hidden relative"
      style={{
        width: '310px',
        height: '120px',
        borderRadius: '8px'
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${color}, transparent)`,
        }}
      />
      
      <div className="relative z-10 h-full flex">
        {/* Left side - Content */}
        <div className="flex-1 flex flex-col justify-center">
          <Statistic
            title={title}
            value={value || 0}
            valueStyle={{
              color: color,
              fontSize: "28px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              lineHeight: "1.2",
            }}
            formatter={(val) => Number(val).toLocaleString()}
            className="font-bold"
          />
        </div>
        
        {/* Right side - Icon */}
        <div className="flex items-center justify-center">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${color}20` }}
          >
            {React.cloneElement(icon, {
              style: { color: color, fontSize: "24px" },
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardStatCard;