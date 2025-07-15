import React, { useState, useRef } from "react";
import {
  Button,
  Upload,
  Table,
  Card,
  message,
  Spin,
  Alert,
  Space,
  Typography,
  Divider,
  Input,
  Tabs,
  Tooltip,
} from "antd";
import {
  InboxOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  CopyOutlined,
  ClearOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Title, Text } = Typography;
const { TextArea } = Input;

const ImportDataPage = () => {
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [pasteData, setPasteData] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Single cell editing state
  const [editingCell, setEditingCell] = useState(null); // {row: 0, col: 'columnKey'}
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  console.log("Check", excelData, columns);

  const handleBack = () => {
    navigate("/select");
    setExcelData([]);
    setColumns([]);
  };

  const handleFileUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          message.error("The Excel file appears to be empty.");
          setLoading(false);
          return;
        }

        processTableData(jsonData, file.name, "file");
      } catch (error) {
        console.error("Error reading Excel file:", error);
        message.error(
          "Failed to read the Excel file. Please ensure it's a valid Excel file."
        );
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
    return false; // Prevent upload
  };

  const processTableData = (jsonData, sourceName, sourceType) => {
    // First row as headers
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    // Filter out completely empty rows
    const filteredDataRows = dataRows.filter((row) =>
      row.some((cell) => cell !== undefined && cell !== null && cell !== "")
    );

    // Create columns for table
    const tableColumns = headers.map((header, index) => ({
      title: header || `Column ${index + 1}`,
      dataIndex: index,
      key: index,
      width: 150,
      ellipsis: true,
    }));

    // Create data rows with keys
    const tableData = filteredDataRows.map((row, rowIndex) => {
      const rowData = { key: rowIndex };
      headers.forEach((header, colIndex) => {
        rowData[colIndex] = row[colIndex] || "";
      });
      return rowData;
    });

    setColumns(tableColumns);
    setExcelData(tableData);
    setFileName(sourceName);
    setUploadSuccess(true);

    const sourceText = sourceType === "file" ? "file" : "pasted data";
    message.success(
      `Successfully loaded ${filteredDataRows.length} records from ${sourceText}`
    );
  };

  const handlePasteData = () => {
    if (!pasteData.trim()) {
      message.warning("Please paste some data first.");
      return;
    }

    setLoading(true);
    try {
      // Split by lines and then by tabs (Excel copy uses tab-separated values)
      const lines = pasteData.trim().split("\n");
      const jsonData = lines.map((line) => {
        // Split by tab first, if no tabs then split by comma, if no commas then split by spaces
        if (line.includes("\t")) {
          return line.split("\t");
        } else if (line.includes(",")) {
          // Handle CSV format - simple split (doesn't handle quoted commas)
          return line.split(",").map((cell) => cell.trim());
        } else {
          // Fallback to space separation
          return line.split(/\s+/).filter((cell) => cell.length > 0);
        }
      });

      console.log(jsonData);

      if (jsonData.length === 0) {
        message.error("No valid data found in the pasted content.");
        setLoading(false);
        return;
      }

      // Ensure all rows have the same number of columns as the header row
      const maxColumns = Math.max(...jsonData.map((row) => row.length));
      const normalizedData = jsonData.map((row) => {
        const normalizedRow = [...row];
        while (normalizedRow.length < maxColumns) {
          normalizedRow.push("");
        }
        return normalizedRow;
      });

      processTableData(normalizedData, "Pasted Data", "paste");
      setActiveTab("paste"); // Switch to upload tab to show the processed data
    } catch (error) {
      console.error("Error processing pasted data:", error);
      message.error(
        "Failed to process the pasted data. Please check the format."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearPaste = () => {
    setPasteData("");
    message.info("Paste area cleared.");
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPasteData(text);
      message.success("Data pasted from clipboard successfully!");
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      message.error(
        "Failed to access clipboard. Please paste manually using Ctrl+V."
      );
    }
  };

  const handleProcessData = async () => {
    if (excelData.length === 0) {
      message.warning("No data to process. Please upload an Excel file first.");
      return;
    }

    setLoading(true);
    try {
      // Commented API call - uncomment and modify as needed
      /*
      const response = await fetch('/api/import-excel-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: excelData,
          fileName: fileName,
          columns: columns.map(col => col.title),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process data');
      }

      const result = await response.json();
      message.success(`Successfully processed ${excelData.length} records`);
      
      // Navigate to success page or back to form
      navigate('/success', { state: { result } });
      */

      // Simulate API call for demo
      setTimeout(() => {
        message.success(`Successfully processed ${excelData.length} records`);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing data:", error);
      message.error("Failed to process the data. Please try again.");
      setLoading(false);
    }
  };

  const handleBulkValidation = async () => {
    if (excelData.length === 0) {
      message.warning(
        "No data to validate. Please upload an Excel file first."
      );
      return;
    }

    setLoading(true);
    try {
      // Commented API call for bulk validation - uncomment and modify as needed
      /*
      const response = await fetch('/api/validate-bulk-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: excelData,
          validationRules: {
            // Define your validation rules here
            requiredFields: ['name', 'email', 'nic'],
            emailFormat: true,
            nicFormat: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const validationResult = await response.json();
      
      if (validationResult.isValid) {
        message.success('All data is valid and ready for processing');
      } else {
        message.warning(`Found ${validationResult.errors.length} validation errors`);
        // You can show detailed validation errors here
      }
      */

      // Simulate validation for demo
      setTimeout(() => {
        message.success("Data validation completed successfully");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error validating data:", error);
      message.error("Failed to validate the data. Please try again.");
      setLoading(false);
    }
  };

  // Single cell editing functions
  const handleCellClick = (record, column, rowIndex) => {
    if (!isEditing) return;
    
    setEditingCell({ row: rowIndex, col: column.dataIndex });
    setEditValue(record[column.dataIndex] || '');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newData = [...excelData];
      newData[editingCell.row][editingCell.col] = editValue;
      setExcelData(newData);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Start editing mode
  const handleExpandEdit = () => {
    setExpanded(true);
    setIsEditing(true);
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setExpanded(false);
    setIsEditing(false);
    setEditingCell(null);
    setEditValue('');
  };

  // Exit editing mode (keep changes)
  const handleFinishEdit = () => {
    setIsEditing(false);
    if (editingCell) {
      handleCellSave();
    }
    message.success("Editing completed!");
  };

  // Create editable columns
  const editableColumns = columns.map(col => ({
    ...col,
    render: (text, record, index) => {
      const isCurrentCell = editingCell?.row === index && editingCell?.col === col.dataIndex;
      
      if (isCurrentCell && isEditing) {
        return (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onPressEnter={handleCellSave}
            onBlur={handleCellSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCellCancel();
              }
            }}
            size="small"
            style={{ margin: 0 }}
          />
        );
      }
      
      return (
        <div
          onClick={() => handleCellClick(record, col, index)}
          style={{ 
            cursor: isEditing ? 'pointer' : 'default',
            minHeight: '22px', 
            padding: '4px 8px',
            backgroundColor: isEditing ? '#f0f0f0' : 'transparent',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          title={isEditing ? 'Click to edit' : ''}
        >
          {text || (isEditing ? 'Click to edit' : '')}
        </div>
      );
    }
  }));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="mb-4"
        >
          Back to Registration
        </Button>
        <Title level={2} className="text-earth-700 mb-2">
          Import Data from Excel
        </Title>
        <Text type="secondary">
          Upload an Excel file to import multiple records at once
        </Text>
      </div>

      {/* Upload and Paste Section */}
      <Card className="mb-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "paste",
              label: "Copy & Paste",
              children: (
                <div>
                  <Title level={4} className="mb-4">
                    Paste Excel Data
                  </Title>
                  <div className="mb-4">
                    <Text type="secondary" className="block mb-2">
                      Copy data from Excel/Google Sheets and paste it here. The
                      first row will be treated as headers.
                    </Text>
                    <Space className="mb-3">
                      <Button
                        icon={<CopyOutlined />}
                        onClick={handlePasteFromClipboard}
                        type="dashed"
                      >
                        Paste from Clipboard
                      </Button>
                      <Button
                        icon={<ClearOutlined />}
                        onClick={handleClearPaste}
                        type="default"
                        disabled={!pasteData}
                      >
                        Clear
                      </Button>
                    </Space>
                    <TextArea
                      value={pasteData}
                      onChange={(e) => setPasteData(e.target.value)}
                      placeholder="Paste your Excel data here (tab-separated or comma-separated values)&#10;&#10;Example:&#10;Name&#9;Email&#9;Phone&#10;John Doe&#9;john@email.com&#9;123-456-7890&#10;Jane Smith&#9;jane@email.com&#9;098-765-4321"
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="primary"
                        onClick={handlePasteData}
                        disabled={!pasteData.trim()}
                        loading={loading}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Process Pasted Data
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "upload",
              label: "Upload File",
              children: (
                <div>
                  <Title level={4} className="mb-4">
                    Upload Excel File
                  </Title>
                  <Dragger
                    name="file"
                    multiple={false}
                    accept=".xlsx,.xls,.csv"
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    className="mb-4"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag Excel file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for .xlsx, .xls, and .csv files. Only single file
                      upload is supported.
                    </p>
                  </Dragger>
                </div>
              ),
            },
          ]}
        />

        {uploadSuccess && (
          <Alert
            message="Data Loaded Successfully"
            description={`${fileName} has been loaded with ${excelData.length} records`}
            type="success"
            icon={<CheckCircleOutlined />}
            className="mt-4"
          />
        )}
      </Card>

      {/* Data Preview Section */}
      {excelData.length > 0 && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Title level={4} className="mb-0">
                Data Preview
              </Title>
              <Tooltip title="Click 'Edit Data' to enable cell editing. Click on any cell to edit its value.">
                <QuestionCircleOutlined style={{ color: "#1890ff" }} />
              </Tooltip>
            </div>
            <Text type="secondary">
              Showing{" "}
              {expanded ? excelData.length : Math.min(excelData.length, 10)} of{" "}
              {excelData.length} records
            </Text>
          </div>

          <div className="flex justify-end mb-2">
            {!expanded && !isEditing && (
              <Button
                onClick={handleExpandEdit}
                type="primary"
                loading={loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Edit Data
              </Button>
            )}
            {expanded && !isEditing && (
              <Space>
                <Button
                  onClick={handleExpandEdit}
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Edit Data
                </Button>
                <Button 
                  onClick={() => setExpanded(false)} 
                  type="default"
                >
                  Collapse
                </Button>
              </Space>
            )}
          </div>

          <Table
            columns={editableColumns}
            dataSource={expanded ? excelData : excelData.slice(0, 10)}
            pagination={false}
            scroll={{ x: true, y: expanded ? 400 : undefined }}
            size="small"
            bordered
          />

          {excelData.length > 10 && !expanded && (
            <div className="mt-3 text-center">
              <Text type="secondary">
                ... and {excelData.length - 10} more records
              </Text>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={handleFinishEdit}
                type="primary"
                className="bg-green-500 hover:bg-green-600"
              >
                Finish Editing
              </Button>
              <Button onClick={handleCancelEdit} type="default">
                Cancel
              </Button>
            </div>
          )}

          {isEditing && (
            <Alert
              className="mt-4"
              type="info"
              showIcon
              message="Edit Mode Active"
              description="Click on any cell to edit its value. Press Enter to save, Escape to cancel. Click 'Finish Editing' when done."
            />
          )}
        </Card>
      )}

      {/* Action Buttons */}
      {excelData.length > 0 && (
        <Card>
          <Title level={4} className="mb-4">
            Process Data
          </Title>
          <Space size="middle">
            <Button
              type="default"
              icon={<CheckCircleOutlined />}
              onClick={handleBulkValidation}
              loading={loading}
              size="large"
              disabled={isEditing}
            >
              Validate Data
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleProcessData}
              loading={loading}
              size="large"
              className="bg-spice-500 hover:bg-spice-600"
              disabled={isEditing}
            >
              Process & Import Data
            </Button>
          </Space>

          <Divider />

          <Alert
            message="Processing Information"
            description="The validation will check for required fields, data formats, and duplicates. The import process will save all valid records to the database."
            type="info"
            showIcon
          />
        </Card>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center">
            <Spin size="large" />
            <Text className="mt-4 text-lg">Processing your data...</Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportDataPage;