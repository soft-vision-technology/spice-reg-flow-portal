import React from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const SelectPage = React.lazy(() => import('../pages/SelectPage'));
const ExporterPage = React.lazy(() => import('../pages/ExporterPage'));
const ExistingBusinessPage = React.lazy(() => import('../pages/ExistingBusinessPage'));
const IntermediaryPage = React.lazy(() => import('../pages/IntermediaryPage'));
const ReportsPage = React.lazy(() => import('../pages/ReportsPage'));
const UserManagement = React.lazy(() => import('../pages/UserManagement'));
const ApprovalPage = React.lazy(() => import('../pages/ApprovalPage'));
const ViewUser = React.lazy(()=>import('../pages/ViewUserPage'));
const EditPage = React.lazy(() => import('../pages/EditPage'));
const DeletePage = React.lazy(() => import('../components/approval/ApprovalForDelete'));
const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage'));
const RegisterUser = React.lazy(() => import('../AdminPages/RegisterUser'));
const ImportDataPage = React.lazy(() => import('../pages/ImportDataPage'));
const SettingsPage = React.lazy(() => import('../pages/SettingsPage'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const DevEnvPage = React.lazy(() => import('../pages/test_page.jsx'));

// Auth pages
const Landing = React.lazy(() => import('../pages/Landing.jsx'));

export const routes = [
  // Public routes
  { path: '/', exact: true, name: 'Landing', element: Landing, protected: false},
  
  // Protected dashboard routes
  { path: '/dashboard', exact: true, name: 'Dashboard', element: Dashboard, protected: true },
  { path: '/select', exact: true, name: 'SelectPage', element: SelectPage, protected: true },
  { path: '/like-to-start', exact: true, name: 'ExporterPage', element: ExporterPage, protected: true },
  { path: '/have-business', exact: true, name: 'ExistingBusinessPage', element: ExistingBusinessPage, protected: true },
  { path: '/export-form', exact: true, name: 'ExporterForm', element: ExporterPage, protected: true },
  { path: '/intermediary-form', exact: true, name: 'IntermediaryPage', element: IntermediaryPage, protected: true },
  { path: '/reports', exact: true, name: 'ReportsPage', element: ReportsPage, protected: true },
  { path: '/user-management', exact: true, name: 'UserManagement', element: UserManagement, protected: true },
  { path: '/users/:id', exact: true, name: 'ViewUser', element:ViewUser, protected: true },
  { path: '/user-management-edit/:id', exact: true, name: 'EditPage', element: EditPage, protected: true },
  { path: '/admin/approve/review/editData/:id', exact: true, name: 'ApprovalPage', element: ApprovalPage, protected: true },
  { path: '/admin/approve/review/deleteData/:id', exact: true, name: 'DeletePage', element: DeletePage, protected: true },
  { path: '/notifications', exact: true, name: 'NotificationsPage', element: NotificationsPage, protected: true },
  { path: '/import-data', exact: true, name: 'ImportDataPage', element: ImportDataPage, protected: true },

  
  // Admin routes (role-based protection)
  { path: '/create', exact: true, name: 'RegisterUser', element: RegisterUser, protected: true, requiredRole: 1 },
  { path: '/settings', exact: true, name: 'SettingsPage', element: SettingsPage, protected: true, requiredRole: 1 },
  
  // 404 route - should be last
  { path: '*', exact: false, name: 'NotFound', element: NotFound, protected: false },
  { path: '/dev-env/page_', exact: true, name: 'DevEnvPage', element: DevEnvPage, protected: true },
];

// Helper function to create route elements with protection
export const createRouteElement = (route) => {
  const Component = route.element;
  
  if (route.protected) {
    if (route.requiredRole) {
      return (
        <ProtectedRoute requiredRole={route.requiredRole}>
          <Component />
        </ProtectedRoute>
      );
    }
    return (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    );
  }
  
  return <Component />;
};