const RegistrationOverviewDonut = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const approvalRate =
    total > 0
      ? (
          ((data.find((d) => d.name === "Approved")?.value || 0) / total) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="relative">
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray={`${approvalRate * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10B981]">
                {approvalRate}%
              </div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{item.value}</span>
              <span className="text-xs text-gray-500">
                ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationOverviewDonut;
