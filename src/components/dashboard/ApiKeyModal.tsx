import React from "react";
import { FaKey, FaPlus, FaBolt } from "react-icons/fa";

interface ApiKeyModalProps {
  showModal: boolean;
  isEdit: boolean;
  modalDesc: string;
  modalKey: string;
  setModalDesc: (desc: string) => void;
  setShowModal: (show: boolean) => void;
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
  MAX_DESCRIPTION_LENGTH: number;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  showModal,
  isEdit,
  modalDesc,
  modalKey,
  setModalDesc,
  setShowModal,
  handleSave,
  MAX_DESCRIPTION_LENGTH
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-md relative border border-blue-100 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl p-1 touch-manipulation"
          onClick={() => setShowModal(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-blue-800 flex items-center gap-2">
          <FaKey size={20} className="sm:w-[22px] sm:h-[22px]" color="#2563eb" /> {isEdit ? 'Edit key description' : 'Add API key'}
        </h2>
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4"
        >
          <label className="text-sm sm:text-base font-semibold text-gray-800">
            Description
            <div className="relative">
              <input
                className="mt-1 w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={modalDesc}
                onChange={e => setModalDesc(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
                placeholder="For test"
                maxLength={MAX_DESCRIPTION_LENGTH}
                required
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {modalDesc.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
            </div>
          </label>
          <label className="text-sm sm:text-base font-semibold text-gray-800">Your API key
            <input
              className="mt-1 w-full border border-blue-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 text-xs sm:text-sm font-mono overflow-x-auto"
              value={modalKey}
              readOnly
            />
          </label>
          <div className="text-xs sm:text-sm text-gray-600 py-1 px-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <FaBolt size={16} className="text-blue-500 flex-shrink-0" />
            <div>This key will have a limit of <span className="font-semibold">500 credits</span>.</div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base touch-manipulation"
              onClick={() => setShowModal(false)}
            >Cancel</button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 touch-manipulation"
            >{isEdit ? 'Save' : <><FaPlus size={16} /> Save</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
}; 