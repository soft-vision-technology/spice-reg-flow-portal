// import { Button, Card, Col, Row, Spin, Tag } from "antd";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";

// const ViewUserPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [user, setUser] = useState(location.state?.user || null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user && id) {
//       setLoading(true);
//       axiosInstance
//         .get(`/api/users/${id}`)
//         .then((res) => setUser(res.data))
//         .catch(() => setUser(null))
//         .finally(() => setLoading(false));
//     }
//   }, [user, id]);

//   // Helper function to get business status color
//   const getBusinessStatusColor = (status) => {
//     switch (status) {
//       case 'STARTING':
//         return 'orange';
//       case 'ACTIVE':
//         return 'green';
//       case 'INACTIVE':
//         return 'red';
//       default:
//         return 'default';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[200px]">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!user) {
//     return <div>No user data found for ID: {id}</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-8">
//       <Card title="User Details" variant={false}>
//         {/* Personal Information */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <div>
//                 <strong>Title:</strong> {user.title}
//               </div>
//             </Col>
//             <Col span={12}>
//               <div>
//                 <strong>Full Name:</strong> {user.name}
//               </div>
//             </Col>
//           </Row>
//           <Row gutter={[16, 16]} className="mt-3">
//             <Col span={12}>
//               <div>
//                 <strong>Initials:</strong> {user.initials}
//               </div>
//             </Col>
//             <Col span={12}>
//               <div>
//                 <strong>NIC Number:</strong> {user.nic}
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {/* Contact Information */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <div>
//                 <strong>Email:</strong> {user.email}
//               </div>
//             </Col>
//             <Col span={12}>
//               <div>
//                 <strong>Contact Number:</strong> {user.contactNumber}
//               </div>
//             </Col>
//           </Row>
//           <Row gutter={[16, 16]} className="mt-3">
//             <Col span={24}>
//               <div>
//                 <strong>Address:</strong> {user.address}
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {/* Location Information */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Location Information</h3>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <div>
//                 <strong>Province ID:</strong> {user.provinceId}
//               </div>
//             </Col>
//             <Col span={12}>
//               <div>
//                 <strong>District ID:</strong> {user.districtId}
//               </div>
//             </Col>
//           </Row>
//           <Row gutter={[16, 16]} className="mt-3">
//             <Col span={12}>
//               <div>
//                 <strong>DS Division:</strong> {user.dsDivision}
//               </div>
//             </Col>
//             <Col span={12}>
//               <div>
//                 <strong>GN Division:</strong> {user.gnDivision}
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {/* Business Information */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Information</h3>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <div>
//                 <strong>Role ID:</strong> {user.roleId}
//               </div>
//             </Col>
//             <Col span={12}>
//               <div>
//                 <strong>Business Status:</strong>{" "}
//                 <Tag color={getBusinessStatusColor(user.businessStatus)}>
//                   {user.businessStatus}
//                 </Tag>
//               </div>
//             </Col>
//           </Row>
//           <Row gutter={[16, 16]} className="mt-3">
//             <Col span={12}>
//               <div>
//                 <strong>Registration Date:</strong>{" "}
//                 {user.createdAt
//                   ? new Date(user.createdAt).toLocaleDateString()
//                   : "N/A"}
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {/* Additional Business Details (if available) */}
//         {(user.businessName ||
//           user.entrepreneur?.businessName ||
//           user.exporter?.businessName ||
//           user.intermediaryTrader?.businessName) && (
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Business Details</h3>
//             <Row gutter={[16, 16]}>
//               <Col span={24}>
//                 <div>
//                   <strong>Business Name:</strong>{" "}
//                   {user.businessName ||
//                     user.entrepreneur?.businessName ||
//                     user.exporter?.businessName ||
//                     user.intermediaryTrader?.businessName ||
//                     "N/A"}
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         )}

//         <Button
//           className="mt-4"
//           type="primary"
//           onClick={() => navigate('/user-management')}
//         >
//           Back to User Management
//         </Button>
//       </Card>
//     </div>
//   );
// };

// export default ViewUserPage;

import { Button, Card, Col, Row, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Hash,
  Package,
  Award,
  Info,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCertificateOptions,
  selectCertificateOptions,
} from "../store/slices/utilsSlice";

const ViewUserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    dispatch(fetchCertificateOptions());
  }, [dispatch]);

  const roleKey =
    user?.role?.name?.charAt(0).toLowerCase() + user?.role?.name?.slice(1); // 'intermediaryTrader', 'entrepreneur', 'exporter'
  const roleData = user?.[roleKey];
  const certificateOptions = useSelector(selectCertificateOptions);
  const certificateIds = roleData?.certificateId || [];
  const matchedCertificates = certificateOptions.filter((opt) =>
    certificateIds.includes(opt.id)
  );

  console.log("selectCertificateOptions →", certificateOptions);

  useEffect(() => {
    if (!user && id) {
      setLoading(true);
      axiosInstance
        .get(`/api/users/${id}`)
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, [user, id]);

  // Helper function to get business status color
  const getBusinessStatusColor = (status) => {
    switch (status) {
      case "STARTING":
        return "orange";
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div>No user data found for ID: {id}</div>;
  }

  const handleGoBack = () => {
    // Navigate back functionality
    console.log("Going back to user management");
    navigate("/user-management");
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <Icon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value || "N/A"}</p>
      </div>
    </div>
  );

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "other", label: "Other", icon: Info },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div className="space-y-3">
            {roleData?.businessProducts?.length > 0 ? (
              roleData?.businessProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {product.product?.name ?? "Unnamed Product"}
                    </h4>
                    <p className="text-sm text-gray-600">{product.value}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.isProcessed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.isProcessed
                      ? "Processed"
                      : product.isRaw
                      ? "Raw"
                      : "Unknown"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </div>
        );
      case "certificates":
        return (
          <div className="space-y-3">
            {matchedCertificates.length > 0 ? (
              matchedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 bg-white rounded-lg shadow-sm border"
                >
                  <h4 className="font-medium text-gray-900">{cert.name}</h4>
                  <p className="text-sm text-gray-600">No issuer info</p>
                  <p className="text-sm text-gray-600">No expiry date</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No certificates found</p>
            )}
          </div>
        );
      case "other":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border text-center">
              <p className="text-2xl font-bold text-blue-600">
                {roleData?.numberOfEmployee?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Number of Employees</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border text-center">
              <p className="text-2xl font-bold text-green-600">
                {roleData?.businessStartDate || "N/A"}
              </p>
              <p className="text-sm text-gray-600"></p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {user.otherInfo?.customerRating || "N/A"}
              </p>
              <p className="text-sm text-gray-600"></p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border text-center">
              <p className="text-2xl font-bold text-purple-600">
                {roleData?.businessExperience?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Business Experience</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-6 grid-rows-4 gap-6 p-8 min-h-screen bg-gray-50">
      {/* Left Panel - Basic Information */}
      <div className="col-span-2 row-span-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Back Button */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 relative">
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center space-x-3 ml-14">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user.title} {user.name}
              </h1>
              <p className="text-sm text-gray-600">
                {user.serialNumber || "No Serial Number"}
                {user.isApproved ? (
                  <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                    Approved
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
                    Not Approved
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        {/* Personal Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-600" />
            Personal Information
          </h2>
          <div className="space-y-1">
            <InfoItem
              icon={User}
              label="Full Name"
              value={`${user.initials} ${user.name}`}
            />
            <InfoItem icon={Hash} label="NIC Number" value={user.nic} />
          </div>
        </div>
        {/* Contact Information */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-gray-600" />
            Contact Information
          </h2>
          <div className="space-y-1">
            <InfoItem icon={Mail} label="Email" value={user.email} />
            <InfoItem
              icon={Phone}
              label="Contact Number"
              value={user.contactNumber}
            />
            <InfoItem icon={MapPin} label="Address" value={user.address} />
          </div>
        </div>
      </div>

      {/* Right Panel - Business Information */}
      <div className="col-span-4 row-span-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="w-7 h-7 mr-3 text-green-600" />
            Business Information
          </h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBusinessStatusColor(user.businessStatus)}`}>
          {user.businessStatus}
          </span>
        </div>

        <div className="p-6">
          {/* Business Status and Role */}
          {/* <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Business Status
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBusinessStatusColor(
                  user.businessStatus
                )}`}
              >
                {user.businessStatus}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Role</h3>
              <p className="text-sm font-semibold text-gray-900">
                {user.roleId}
              </p>
            </div>
          </div> */}

          {/* Business Details */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Business Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Business Name
                  </p>
                  <p className="text-sm text-blue-900">
                    {user.businessName ||
                      user.entrepreneur?.businessName ||
                      user.exporter?.businessName ||
                      user.intermediaryTrader?.businessName ||
                      "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-1">
                    Registration Date
                  </p>
                  <p className="text-sm text-purple-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-700 mb-1">
                      Province
                    </p>
                    <p className="text-sm text-green-900">
                      {user.province.name}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-700 mb-1">
                      District
                    </p>
                    <p className="text-sm text-green-900">
                      {user.district.name}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 mb-1">
                      DS Division
                    </p>
                    <p className="text-sm text-amber-900">{user.dsDivision}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 mb-1">
                      GN Division
                    </p>
                    <p className="text-sm text-amber-900">{user.gnDivision}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information with Tabs */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;
