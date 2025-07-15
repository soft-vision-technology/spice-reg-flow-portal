import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Tabs,
  Spin,
  Alert,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearError,
  selectCategoryData,
  selectCategoryLoading,
  selectCategoryError,
} from "../store/slices/settingsSlice";

const { TabPane } = Tabs;

const SettingsPage = () => {
  const dispatch = useDispatch();
  
  // Local state for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("");
  const [form] = Form.useForm();

  // Categories configuration
  const categories = [
    { key: "spices", label: "Spice Products", title: "Spice Products" },
    { key: "certificates", label: "Certificate Types", title: "Certificate Types" },
    { key: "experience", label: "Business Experience", title: "Business Experience" },
    { key: "employees", label: "Employee Ranges", title: "Number of Employees" },
  ];

  // Fetch all data on component mount
  useEffect(() => {
    categories.forEach(category => {
      dispatch(fetchItems(category.key));
    });
  }, [dispatch]);

  // Collect all category states at the top level
  const categoryStates = {};
  categories.forEach(category => {
    categoryStates[category.key] = {
      data: useSelector(state => selectCategoryData(state, category.key)),
      loading: useSelector(state => selectCategoryLoading(state, category.key)),
      error: useSelector(state => selectCategoryError(state, category.key)),
    };
  });

  // Check if any category is loading
  const isAnyLoading = categories.some(category =>
    categoryStates[category.key].loading
  );

  // Handle add new item
  const handleAdd = (category) => {
    setCurrentCategory(category);
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Handle edit item
  const handleEdit = (item, category) => {
    setCurrentCategory(category);
    setEditingItem(item);
    form.setFieldsValue({ name: item.name });
    setModalVisible(true);
  };

  // Handle delete item
  const handleDelete = async (id, category) => {
    try {
      await dispatch(deleteItem({ category, id })).unwrap();
      message.success("Item deleted successfully");
    } catch (error) {
      message.error(error.message || "Failed to delete item");
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        // Update existing item
        await dispatch(updateItem({ 
          category: currentCategory, 
          id: editingItem.id, 
          itemData: values 
        })).unwrap();
        message.success("Item updated successfully");
      } else {
        // Add new item
        await dispatch(createItem({ 
          category: currentCategory, 
          itemData: values 
        })).unwrap();
        message.success("Item added successfully");
      }
      
      handleCloseModal();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingItem(null);
    setCurrentCategory("");
  };

  // Handle error dismissal
  const handleDismissError = (category) => {
    dispatch(clearError({ category }));
  };

  // Table columns
  const getColumns = (category) => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, category)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          />
          <Popconfirm
            title="Delete Item"
            description="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.id, category)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Render table for each category
  const renderTable = (categoryConfig) => {
    const { data, loading, error } = categoryStates[categoryConfig.key];
    
    return (
      <Card
        className="mb-6 shadow-sm"
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">
              {categoryConfig.title}
            </span>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd(categoryConfig.key)}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              loading={loading}
            >
              Add New
            </Button>
          </div>
        }
        bodyStyle={{ padding: "16px" }}
      >
        {error && (
          <Alert
            message="Error Loading Data"
            description={error}
            type="error"
            closable
            onClose={() => handleDismissError(categoryConfig.key)}
            className="mb-4"
            showIcon
          />
        )}
        
        <Spin spinning={loading} tip="Loading...">
          <Table
            dataSource={data}
            columns={getColumns(categoryConfig.key)}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            size="middle"
            locale={{
              emptyText: "No items found. Click 'Add New' to create one.",
            }}
          />
        </Spin>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Settings Management
          </h1>
          <p className="text-gray-600">
            Manage your application's configuration data
          </p>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            defaultActiveKey="spices"
            className="p-6"
            size="large"
            tabBarStyle={{ marginBottom: "24px" }}
          >
            {categories.map(categoryConfig => (
              <TabPane 
                tab={categoryConfig.label} 
                key={categoryConfig.key}
              >
                {renderTable(categoryConfig)}
              </TabPane>
            ))}
          </Tabs>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">
                {editingItem ? "Edit Item" : "Add New Item"}
              </span>
            </div>
          }
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={handleCloseModal}
          okText={editingItem ? "Update" : "Add"}
          cancelText="Cancel"
          className="top-20"
          confirmLoading={isAnyLoading}
          okButtonProps={{
            className: "bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700",
          }}
          width={500}
        >
          <div className="py-4">
            <Form 
              form={form} 
              layout="vertical" 
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Item Name
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter a name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                  { max: 100, message: "Name cannot exceed 100 characters" },
                  {
                    pattern: /^[a-zA-Z0-9\s\-_]+$/,
                    message: "Name can only contain letters, numbers, spaces, hyphens, and underscores",
                  },
                ]}
              >
                <Input 
                  placeholder="Enter item name" 
                  className="rounded-md"
                  size="large"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SettingsPage;