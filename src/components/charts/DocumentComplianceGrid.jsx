const DocumentComplianceGrid = ({ data = [] }) => {
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
          <div className="font-semibold p-2 text-center">
            Intermediary Trader
          </div>
        </div>
        {Object.entries(groupedData).map(([doc, items]) => (
          <div key={doc} className="grid grid-cols-4 gap-2 mb-1">
            <div className="p-2 font-medium">{doc}</div>
            {["Entrepreneur", "Exporter", "Intermediary Trader"].map((type) => {
              const item = items.find((i) => i.type === type);
              const value = item ? item.value : 0;
              return (
                <div
                  key={type}
                  className={`p-2 text-center text-white rounded ${getColorByValue(
                    value
                  )}`}
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

export default DocumentComplianceGrid;
