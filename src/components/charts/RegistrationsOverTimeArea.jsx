const RegistrationsOverTimeArea = ({ data }) => {
  // Handle empty data or loading state
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.registrations || 0, d.approvals || 0)),
    1 // Ensure maxValue is at least 1 to avoid division by zero
  );

  return (
    <div className="h-64">
      <div className="flex justify-end mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E67324]" />
          <span className="text-sm text-gray-600">Registrations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="text-sm text-gray-600">Approvals</span>
        </div>
      </div>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex-1 flex flex-col justify-end w-full gap-1">
              <div
                className="bg-[#E67324] rounded-t opacity-80 min-h-[4px] transition-all duration-300 hover:opacity-100"
                style={{ height: `${((item.registrations || 0) / maxValue) * 100}%` }}
                title={`${item.registrations || 0} registrations`}
              />
              <div
                className="bg-[#10B981] rounded-t opacity-80 min-h-[4px] transition-all duration-300 hover:opacity-100"
                style={{ height: `${((item.approvals || 0) / maxValue) * 100}%` }}
                title={`${item.approvals || 0} approvals`}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationsOverTimeArea;