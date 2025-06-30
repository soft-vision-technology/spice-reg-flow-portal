import {
  RegistrationOverviewDonut,
  RegistrationsOverTimeArea,
  GeographicDistributionChart,
  DemographicsStackedBar,
  SectorWiseBar,
  // ApprovalStatusDonut,
  // RegistrationTimeBoxPlot,
  // DocumentComplianceGrid,
  // RegistrationFunnel,
} from "./index";

export const RegistrationDashboard = (props) => {
  const {
    overview = [],
    timeSeries = [],
    geo = [],
    demographics = [],
    sectors = [],
    // approval = [],
    // regTime = [],
    // docs = [],
    // funnel = [],
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registration Overview
        </h3>
        <RegistrationOverviewDonut data={overview} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registrations Over Time
        </h3>
        <RegistrationsOverTimeArea data={timeSeries} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Geographic Distribution
        </h3>
        <GeographicDistributionChart data={geo} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Demographics Breakdown
        </h3>
        <DemographicsStackedBar data={demographics} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Sector-wise Participation
        </h3>
        <SectorWiseBar data={sectors} />
      </div>

      {/* <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Approval Status
        </h3>
        <ApprovalStatusDonut data={approval} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registration Time Distribution
        </h3>
        <RegistrationTimeBoxPlot data={regTime} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Document Compliance
        </h3>
        <DocumentComplianceGrid data={docs} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Registration Funnel
        </h3>
        <RegistrationFunnel data={funnel} />
      </div> */}
    </div>
  );
};