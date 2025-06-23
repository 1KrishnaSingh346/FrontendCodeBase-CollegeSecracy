import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FiMail, FiSend } from 'react-icons/fi';

const EmailActionModal = ({ isOpen, setIsOpen, type = 'reactivation', onSend, isLoading }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const labels = {
    reactivation: {
      title: 'Reactivate Your Account',
      buttonText: 'Send Reactivation Link',
    },
    reset: {
      title: 'Reset Your Password',
      buttonText: 'Send Password Reset Link',
    },
  };

  const handleSend = async () => {
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSend(email.trim(), type);
      setIsOpen(false);
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 px-6 py-5 text-left align-middle shadow-xl transition-all sm:px-8 sm:py-6">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {labels[type].title}
                </Dialog.Title>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiMail className="text-orange-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    disabled={isSubmitting}
                    onClick={handleSend}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <FiSend />
                        {labels[type].buttonText}
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EmailActionModal;
