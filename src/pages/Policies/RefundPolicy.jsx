import React from "react";

const RefundPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="bg-gray-200 max-w-[95%] sm:max-w-4xl w-full shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-4 text-center">
          💰 Refund Policy
        </h1>
        <p className="text-gray-500 text-center mb-6 italic text-sm sm:text-base">
          Last Updated: February 2025
        </p>

        {/* Introduction */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">1. General Policy</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          At <span className="font-semibold text-blue-600">CollegeSecracy</span>, we strive to provide high-quality services. 
          However, if you are not satisfied, we offer refunds under certain conditions outlined below.
        </p>

        {/* Refund Eligibility */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">2. Refund Eligibility</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm sm:text-base">
          <li>Refunds are applicable only for purchases made within the last <b>7 days</b>.</li>
          <li>Services that have been <b>partially used</b> may be eligible for a <b>partial refund</b>.</li>
          <li>Subscription fees are <b>non-refundable</b> after the trial period.</li>
          <li>No refunds for violations of our Terms & Conditions.</li>
        </ul>

        {/* How to Request a Refund */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">3. How to Request a Refund</h2>
        <ul className="list-decimal list-inside text-gray-600 space-y-2 mt-2 text-sm sm:text-base">
          <li>Send an email to{" "}
            <a href="mailto:refunds@collegesecracy.com" className="text-blue-500 underline">
              refunds@collegesecracy.com
            </a>{" "}with your order details and reason.</li>
          <li>Our team will review your request within <b>3-5 business days</b>.</li>
          <li>If approved, the refund will be processed within <b>7-10 business days</b>.</li>
        </ul>

        {/* Non-Refundable Services */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">4. Non-Refundable Services</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 text-sm sm:text-base">
          <li>One-time consultations or personalized coaching services.</li>
          <li>Completed digital course materials or downloads.</li>
          <li>Subscription renewals after the trial period.</li>
        </ul>

        {/* Late or Missing Refunds */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">5. Late or Missing Refunds</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 text-sm sm:text-base">
          <li>Check your bank account and confirm with your payment provider.</li>
          <li>Contact your credit card company; processing times may vary.</li>
          <li>If the issue persists, email us at{" "}
            <a href="mailto:support@collegesecracy.com" className="text-blue-500 underline">
              support@collegesecracy.com
            </a>.
          </li>
        </ul>

        {/* Policy Updates */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">6. Changes to This Policy</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          We reserve the right to modify this policy at any time. The latest version will be available on our website.
        </p>

        {/* Contact Us */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-800">7. Contact Us</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          If you have any questions, reach out at{" "}
          <a href="mailto:support@collegesecracy.com" className="text-blue-500 underline">
            support@collegesecracy.com
          </a>.
        </p>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="bg-blue-600 text-white px-5 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
