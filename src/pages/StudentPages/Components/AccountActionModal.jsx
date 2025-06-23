import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';

const AccountActionModal = ({ type, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (type === 'delete' && (!password || !agreed)) return;
    onConfirm({ type, reason, password });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 relative shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition"
          aria-label="Close modal"
        >
          <FiX size={22} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
          {type === 'deactivate' ? 'Deactivate Account' : 'Delete Account'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 text-center">
          {type === 'deactivate'
            ? 'You can reactivate anytime by logging back in.'
            : 'This will permanently delete your account and data.'}
        </p>

        {/* Deactivation Reason */}
        {type === 'deactivate' && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Taking a break"
            />
          </div>
        )}

        {/* Delete Password + Confirmation */}
        {type === 'delete' && (
          <>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <label className="flex items-start text-sm text-gray-700 dark:text-gray-300 mb-2">
              <input
                type="checkbox"
                className="mr-2 mt-1"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I understand this action is <strong className="ml-1 text-red-600 dark:text-red-400">permanent</strong>.
            </label>
          </>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={type === 'delete' && (!password || !agreed)}
            className={`px-4 py-2 rounded-md text-sm font-semibold text-white transition ${
              type === 'deactivate'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-red-600 hover:bg-red-700'
            } ${type === 'delete' && (!password || !agreed) && 'opacity-50 cursor-not-allowed'}`}
          >
            {type === 'deactivate' ? 'Deactivate' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountActionModal;
