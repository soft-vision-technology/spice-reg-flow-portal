

const GeographicDistributionChart = ({ data, loading }) => {
  const maxCount = Math.max(...data.map((d) => d.userCount), 1);
  const chartHeight = 400;
  const chartWidth = 1400;
  const padding = 40;

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Calculate points for the line
  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding,
    y:
      chartHeight -
      ((item.userCount / maxCount) * (chartHeight - 2 * padding) + padding),
    ...item,
  }));

  // Create path for the line
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create area path
  const areaPath =
    pathData +
    ` L ${points[points.length - 1].x} ${chartHeight - padding}` +
    ` L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="border border-gray-200 rounded-lg"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4, 5].map((tick) => {
            const value = Math.round((tick / 5) * maxCount);
            const y =
              chartHeight - padding - (tick / 5) * (chartHeight - 2 * padding);
            return (
              <g key={tick}>
                <line
                  x1={padding - 5}
                  y1={y}
                  x2={padding}
                  y2={y}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" opacity="0.3" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E67324" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E67324" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#E67324"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#E67324"
                strokeWidth="3"
                className="hover:r-8 transition-all cursor-pointer"
              />
              <title>{`${point.districtName}: ${point.userCount} users`}</title>
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {point.districtName}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#E67324]" />
          <span className="text-sm text-gray-600">User Count by District</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E67324]">
            {data.reduce((sum, item) => sum + item.userCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#10B981]">{data.length}</div>
          <div className="text-sm text-gray-600">Districts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#F59E0B]">{maxCount}</div>
          <div className="text-sm text-gray-600">Highest Count</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#6366F1]">
            {data.length > 0 ? (
              data.reduce((sum, item) => sum + item.userCount, 0) / data.length
            ).toFixed(1) : 0}
          </div>
          <div className="text-sm text-gray-600">Average</div>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistributionChart;