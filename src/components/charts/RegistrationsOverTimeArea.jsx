import { useState } from "react";

const RegistrationsOverTimeArea = ({ data, weeklyData }) => {
  const [viewMode, setViewMode] = useState('monthly');
  
  // Use appropriate data based on view mode
  const currentData = viewMode === 'monthly' ? data : weeklyData;
  const timeLabel = viewMode === 'monthly' ? 'month' : 'week';
  
  return (
    <div className="h-60">
      {/* Toggle Buttons - Always visible */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === 'weekly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
        </div>
        
        {/* Legend */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E67324]" />
            <span className="text-xs font-semibold text-gray-600">Registrations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-xs font-semibold text-gray-600">Approvals</span>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      {!currentData || currentData.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-gray-500">No data available</div>
        </div>
      ) : (
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2 h-48">
          {(() => {
            // Calculate max value for scaling
            const maxValue = Math.max(
              ...currentData.map((d) => Math.max(d.registrations || 0, d.approvals || 0)),
              1 // Ensure maxValue is at least 1 to avoid division by zero
            );

            return currentData.map((item, index) => (
              <div key={`${viewMode}-${index}`} className="flex flex-col items-center">
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
                <span className="text-xs text-gray-500 mt-2">{item[timeLabel] || item.month}</span>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
};

export default RegistrationsOverTimeArea;