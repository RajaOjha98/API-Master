import React from "react";
import { FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrash, FaBolt, FaPlus } from "react-icons/fa";
import { ApiKey } from "./types";

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  isLoading: boolean;
  error: string | null;
  visibleKeyId: number | null;
  copiedKeyId: number | null;
  fetchApiKeys: () => void;
  toggleKeyVisibility: (id: number) => void;
  copyToClipboard: (key: string, id: number) => void;
  simulateUsage: (id: number) => void;
  handleEdit: (key: ApiKey) => void;
  handleDelete: (id: number) => void;
  handleAdd: () => void;
  displayKey: (key: string, id: number) => string;
  truncateText: (text: string, maxLength: number) => string;
}

export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({
  apiKeys,
  isLoading,
  error,
  visibleKeyId,
  copiedKeyId,
  fetchApiKeys,
  toggleKeyVisibility,
  copyToClipboard,
  simulateUsage,
  handleEdit,
  handleDelete,
  handleAdd,
  displayKey,
  truncateText
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-blue-50 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm sm:text-base text-blue-700 font-semibold">{apiKeys.length} API Keys</span>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 mb-4 rounded-lg border border-red-200 text-sm">
          {error} <button className="underline" onClick={fetchApiKeys}>Try again</button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-3 text-gray-700">Loading API keys...</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          {/* For mobile view (stacked cards) */}
          <div className="md:hidden space-y-4">
            {apiKeys.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No API keys found. Click "Generate API key" to create one.
              </p>
            ) : (
              apiKeys.map((k, i) => (
                <div key={k.id} className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 text-gray-800 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-blue-900 truncate max-w-[65%]" title={k.description}>
                      #{i + 1}: {truncateText(k.description, 20)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className={`text-blue-600 hover:text-blue-800 transition-all p-2 touch-manipulation`}
                        onClick={() => toggleKeyVisibility(k.id)}
                        title={visibleKeyId === k.id ? "Hide API Key" : "View API Key"}
                      >
                        {visibleKeyId === k.id ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                      
                      <button
                        className={`${copiedKeyId === k.id ? 'text-green-600' : 'text-blue-600'} hover:text-blue-800 transition-all p-2 touch-manipulation`}
                        onClick={() => copyToClipboard(k.key, k.id)}
                        title="Copy API Key"
                      >
                        <FaCopy size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-blue-700 mb-2 break-all min-h-[48px] border border-blue-100 p-3 rounded bg-blue-50" style={{ lineHeight: '1.5' }}>
                    {displayKey(k.key, k.id)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Added: <span className="font-medium">{k.added}</span></div>
                    <div>Expires: <span className="font-medium">{k.expires}</span></div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${k.usage > 0 ? 'text-blue-700' : 'text-gray-500'}`}>
                        Usage: {k.usage}/{k.limit}
                      </span>
                      <button
                        onClick={() => simulateUsage(k.id)}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded p-1 touch-manipulation"
                        title="Simulate API usage"
                      >
                        <FaBolt size={12} />
                      </button>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-all p-2 touch-manipulation"
                        onClick={() => handleEdit(k)}
                        title="Edit API Key"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-all p-2 touch-manipulation"
                        onClick={() => handleDelete(k.id)}
                        title="Delete API Key"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* For tablet and desktop view (table) */}
          <table className="hidden md:table w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-blue-900 text-base">
                <th className="py-3 font-bold w-10 pl-4 border-b border-blue-100">#</th>
                <th className="py-3 font-bold w-[20%] px-3 border-b border-blue-100">Description</th>
                <th className="py-3 font-bold w-[35%] px-3 border-b border-blue-100">
                  <div className="truncate">Key</div>
                </th>
                <th className="py-3 font-bold hidden lg:table-cell w-[15%] px-3 border-b border-blue-100">Added</th>
                <th className="py-3 font-bold hidden lg:table-cell w-[15%] px-3 border-b border-blue-100">Expires</th>
                <th className="py-3 font-bold w-[15%] px-3 border-b border-blue-100">Usage</th>
                <th className="py-3 text-center w-[100px] px-2 border-b border-blue-100">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-transparent">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No API keys found. Click "Generate API key" to create one.
                  </td>
                </tr>
              ) : (
                apiKeys.map((k, i) => (
                  <tr key={k.id} className="bg-blue-50 hover:bg-blue-100 text-gray-800 transition-all shadow-sm">
                    <td className="py-3 px-4 font-bold text-blue-900 rounded-l-xl border-t border-l border-b border-blue-100">{i + 1}</td>
                    <td className="py-3 text-blue-900 truncate max-w-[150px] px-3 font-medium border-t border-b border-blue-100" title={k.description}>
                      {truncateText(k.description, 25)}
                    </td>
                    <td className="py-3 font-mono text-sm text-blue-700 px-3 border-t border-b border-blue-100">
                      <div className="truncate max-w-full" style={{ minWidth: '220px', wordBreak: 'break-all', whiteSpace: 'normal', lineHeight: '1.5' }}>
                        {displayKey(k.key, k.id)}
                      </div>
                    </td>
                    <td className="py-3 hidden lg:table-cell truncate px-3 border-t border-b border-blue-100" style={{ minWidth: '120px' }}>{k.added}</td>
                    <td className="py-3 hidden lg:table-cell truncate px-3 border-t border-b border-blue-100" style={{ minWidth: '120px' }}>{k.expires}</td>
                    <td className="py-3 px-3 border-t border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${k.usage > 0 ? 'text-blue-700' : 'text-gray-500'}`}>
                          {k.usage}/{k.limit}
                        </span>
                        <button
                          onClick={() => simulateUsage(k.id)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded p-1 touch-manipulation"
                          title="Simulate API usage"
                        >
                          <FaBolt size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 rounded-r-xl border-t border-r border-b border-blue-100">
                      <div className="flex justify-center gap-3 px-2">
                        <button
                          className={`text-blue-600 hover:text-blue-800 transition-all p-1 touch-manipulation`}
                          onClick={() => toggleKeyVisibility(k.id)}
                          title={visibleKeyId === k.id ? "Hide API Key" : "View API Key"}
                        >
                          {visibleKeyId === k.id ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                        
                        <button
                          className={`${copiedKeyId === k.id ? 'text-green-600' : 'text-blue-600'} hover:text-blue-800 transition-all p-1 touch-manipulation`}
                          onClick={() => copyToClipboard(k.key, k.id)}
                          title="Copy API Key"
                        >
                          <FaCopy size={18} />
                        </button>
                        
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-all p-1 touch-manipulation"
                          onClick={() => handleEdit(k)}
                          title="Edit API Key"
                        >
                          <FaEdit size={18} />
                        </button>
                        
                        <button
                          className="text-red-500 hover:text-red-700 transition-all p-1 touch-manipulation"
                          onClick={() => handleDelete(k.id)}
                          title="Delete API Key"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 text-sm sm:text-base text-blue-700">
        You can find our <a href="#" className="text-blue-600 hover:underline font-bold">API documentation here</a>
      </div>

      {/* Fixed mobile add button for better thumb access */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <button
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg flex items-center justify-center touch-manipulation"
          onClick={handleAdd}
          aria-label="Generate API key"
        >
          <FaPlus size={24} />
        </button>
      </div>
    </div>
  );
}; 