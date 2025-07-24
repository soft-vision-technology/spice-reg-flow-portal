const   SectorWiseBar = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const maxCount = 100;

  return (
    <div className="h-64 overflow-y-auto pr-2 space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {item.productName || item.sector}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-800">
                {item.count}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`bg-gradient-to-r ${item.count > 2 ? 'from-[#E67324]' : 'from-[#5aee69]'} to-[#5ae9] h-3 rounded-full transition-all duration-500`}

              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectorWiseBar;