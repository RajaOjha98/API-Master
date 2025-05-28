import { FaChartLine, FaPlus, FaRegChartBar, FaSignal, FaChartPie, FaKey } from "react-icons/fa";
import { useAnalytics } from "@/context/AnalyticsContext";

interface HeaderProps {
  handleAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ handleAdd }) => {
  // Use the analytics context
  const { analytics, isLoading } = useAnalytics();
  
  // Current and previous month labels
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString('default', { month: 'short' });
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-gray-800 tracking-tight flex items-center gap-2">
            <FaChartLine size={24} className="md:w-8 md:h-8" color="#3b82f6" /> Dashboard
          </h1>
          <p className="text-base md:text-lg text-gray-600">Manage your API keys and monitor usage stats</p>
        </div>
      </div>

      {/* Analytics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total API Calls Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-medium text-sm">Total API Calls</h3>
            <FaRegChartBar className="text-blue-500" size={18} />
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-800">{formatNumber(analytics.totalApiCalls)}</span>
                <span className={`text-xs ml-2 ${analytics.totalApiCallsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {analytics.totalApiCallsChange >= 0 ? '+' : ''}{analytics.totalApiCallsChange}%
                </span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">vs {previousMonth}</div>
        </div>

        {/* Active Keys Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-medium text-sm">Active Keys</h3>
            <FaKey className="text-green-500" size={18} />
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-800">{analytics.activeKeys}</span>
                <span className={`text-xs ml-2 ${analytics.activeKeysChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {analytics.activeKeysChange >= 0 ? '+' : ''}{analytics.activeKeysChange}
                </span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">vs {previousMonth}</div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-medium text-sm">Success Rate</h3>
            <FaSignal className="text-purple-500" size={18} />
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-800">{analytics.successRate.toFixed(1)}%</span>
                <span className={`text-xs ml-2 ${analytics.successRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {analytics.successRateChange >= 0 ? '+' : ''}{analytics.successRateChange}%
                </span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">vs {previousMonth}</div>
        </div>

        {/* Average Response Time Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-medium text-sm">Avg Response Time</h3>
            <FaChartPie className="text-yellow-500" size={18} />
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-800">{analytics.avgResponseTime}ms</span>
                <span className={`text-xs ml-2 ${analytics.avgResponseTimeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {analytics.avgResponseTimeChange >= 0 ? '-' : '+'}{Math.abs(analytics.avgResponseTimeChange)}ms
                </span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">vs {previousMonth}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your API Keys</h2>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 sm:px-6 rounded-lg font-bold shadow-lg text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleAdd}
        >
          <FaPlus size={16} /> Generate API key
        </button>
      </div>
    </>
  );
}; 