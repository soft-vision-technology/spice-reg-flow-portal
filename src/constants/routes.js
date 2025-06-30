import React from "react";

const LandingPage = React.lazy(() => import('../pages/dashboardPage'))
const CompanySelection = React.lazy(() => import('../pages/auth/CompanySelection'))
const CompanySwitcher = React.lazy(() => import('../pages/auth/CompanySwitcher'))
const Login = React.lazy(() => import('../pages/auth/Login'))
const BankDetails = React.lazy(() => import("../pages/company/bank-details/BankDetails"))
const AddBankDetails = React.lazy(() => import("../pages/company/bank-details/AddBankDetails"))
const TANDetails = React.lazy(() => import("../pages/company/tan-details/TANDetails"))
const FinancialInformation = React.lazy(() => import("../pages/company/FinancialInformation"))

const routes = [
    { path: '/', exact: true, name: 'LandingPage', element: LandingPage},
    { path: '/dashboard', exact: true, name: 'Home', element: DashbboardPage},
    { path: '/company/company-select', exact: true, name: 'CompanySelection', element: CompanySelection},
    { path: '/company/company-switcher', exact: true, name: 'CompanySwitcher', element: CompanySwitcher},
    { path: 'company/financial-info', exact: true, name: 'FinancialInformation', element: FinancialInformation},
    { path: '/company/bank-details', exact: true, name: 'Bank Details', element: BankDetails },
    { path: '/company/bank-details/add-bank-details', exact: true, name: 'Add Bank Details', element: AddBankDetails},
    { path: '/company/tandetails', exact: true, name: 'TAN Details', element: TANDetails},
]

export default routes;