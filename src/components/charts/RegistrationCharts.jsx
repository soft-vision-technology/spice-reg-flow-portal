// RegistrationCharts.jsx
// All chart components for the SPICE Registration dashboard.
// Built for React + Vite (JavaScript), TailwindCSS, and Ant Design (@ant-design/plots).
// You can split these into separate files if you prefer; each is self‑contained.

import React from "react";
import {
  Pie,
  Area,
  Column,
  Funnel,
  Box,
} from "@ant-design/plots";

/********************* 1. Registration Overview Donut *********************/
export const RegistrationOverviewDonut = ({ data = [] }) => {
  // data = [{ type: "Entrepreneur", value: 120 }, ...]
  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "spider",
      content: "{name}\n{percentage}%",
    },
    legend: false,
    interactions: [{ type: "element-active" }],
  };
  return <Pie {...config} className="w-full h-80" />;
};

/********************* 2. Registrations Over Time (Stacked Area) *********************/
export const RegistrationsOverTimeArea = ({ data = [] }) => {
  /*
    data = [
      { date: "2025-01", count: 30, type: "Entrepreneur" },
      { date: "2025-01", count: 12, type: "Exporter" },
      ...
    ];
  */
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

/********************* 3. Geographic Distribution (Simple Bar Chart) *********************/
// Note: Choropleth maps require complex setup and map data
// Using a simple bar chart instead for geographic distribution
export const GeographicDistributionChart = ({ data = [] }) => {
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

/********************* 4. Demographics Breakdown (Stacked Bar) *********************/
export const DemographicsStackedBar = ({ data = [] }) => {
  /*
    data = [
      { category: "18-25", type: "Entrepreneur", value: 40 },
      { category: "18-25", type: "Exporter", value: 10 },
      ...
    ];
  */
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

/********************* 5. Sector‑wise Participation (Horizontal Bar) *********************/
export const SectorWiseBar = ({ data = [] }) => {
  // data = [{ sector: "Agriculture", value: 95 }, ...]
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

/********************* 6. Approval/Verification Status (Donut) *********************/
export const ApprovalStatusDonut = ({ data = [] }) => {
  // data = [{ stage: "Submitted", value: 300 }, ...]
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

/********************* 7. Registration Time Box Plot *********************/
export const RegistrationTimeBoxPlot = ({ data = [] }) => {
  // Convert simple data to box plot format
  const boxData = data.map(item => ({
    x: item.type,
    low: Math.max(0, item.time - 1.5),
    q1: item.time - 0.8,
    median: item.time,
    q3: item.time + 0.8,
    high: item.time + 1.5,
    outliers: []
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

/********************* 8. Document Submission Compliance (Grid) *********************/
// Simplified heatmap using a table-like structure
export const DocumentComplianceGrid = ({ data = [] }) => {
  // Group data by document type
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.doc]) {
      acc[item.doc] = [];
    }
    acc[item.doc].push(item);
    return acc;
  }, {});

  const getColorByValue = (value) => {
    if (value >= 0.9) return "bg-green-500";
    if (value >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full h-96 overflow-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="font-semibold p-2">Document</div>
          <div className="font-semibold p-2 text-center">Entrepreneur</div>
          <div className="font-semibold p-2 text-center">Exporter</div>
          <div className="font-semibold p-2 text-center">Intermediary Trader</div>
        </div>
        {Object.entries(groupedData).map(([doc, items]) => (
          <div key={doc} className="grid grid-cols-4 gap-2 mb-1">
            <div className="p-2 font-medium">{doc}</div>
            {["Entrepreneur", "Exporter", "Intermediary Trader"].map(type => {
              const item = items.find(i => i.type === type);
              const value = item ? item.value : 0;
              return (
                <div
                  key={type}
                  className={`p-2 text-center text-white rounded ${getColorByValue(value)}`}
                >
                  {(value * 100).toFixed(0)}%
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/********************* 9. Registration Funnel *********************/
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
        const rate = (datum.value / datumPrev.value * 100).toFixed(1);
        return `${rate}%`;
      }
    },
    dynamicHeight: true,
    color: ["#5B8FF9", "#61DDAA", "#F6BD16", "#E8684A", "#6DC8EC"],
  };
  return <Funnel {...config} className="w-full h-96" />;
};

/********************* 10. Dashboard Layout *********************/
export const RegistrationDashboard = (props) => {
  // Destructure props for each data set with default values
  const {
    overview = [],
    timeSeries = [],
    geo = [],
    demographics = [],
    sectors = [],
    approval = [],
    regTime = [],
    docs = [],
    funnel = [],
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registration Overview
        </h3>
        <RegistrationOverviewDonut data={overview} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registrations Over Time
        </h3>
        <RegistrationsOverTimeArea data={timeSeries} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Geographic Distribution
        </h3>
        <GeographicDistributionChart data={geo} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Demographics Breakdown
        </h3>
        <DemographicsStackedBar data={demographics} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Sector-wise Participation
        </h3>
        <SectorWiseBar data={sectors} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Approval Status
        </h3>
        <ApprovalStatusDonut data={approval} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registration Time Distribution
        </h3>
        <RegistrationTimeBoxPlot data={regTime} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Document Compliance
        </h3>
        <DocumentComplianceGrid data={docs} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registration Funnel
        </h3>
        <RegistrationFunnel data={funnel} />
      </div>
    </div>
  );
};

// ----------------------------- Usage Example -----------------------------
// <RegistrationDashboard
//    overview={overviewData}
//    timeSeries={timeSeriesData}
//    geo={geoData}
//    demographics={demoData}
//    sectors={sectorData}
//    approval={approvalData}
//    regTime={regTimeData}
//    docs={docData}
//    funnel={funnelData}
// />
// -------------------------------------------------------------------------