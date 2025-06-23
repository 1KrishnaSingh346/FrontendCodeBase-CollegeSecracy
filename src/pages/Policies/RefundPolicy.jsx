import React from "react";
import { FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  const themes = {
    dark: {
      background: "bg-gray-900",
      text: "text-gray-100",
      secondaryText: "text-gray-400",
      border: "border-gray-800",
      card: "bg-gray-800/80 backdrop-blur-sm",
      hoverText: "hover:text-orange-400",
      divider: "border-gray-800"
    },
    light: {
      background: "bg-gray-50",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      border: "border-gray-200",
      card: "bg-white/80 backdrop-blur-sm",
      hoverText: "hover:text-blue-600",
      divider: "border-gray-200"
    }
  };

  const savedMode = localStorage.getItem("darkMode");
  const isDarkMode = savedMode === "true" || (savedMode === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const currentTheme = isDarkMode ? themes.dark : themes.light;

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} py-12 px-4 sm:px-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Refund Policy</h1>
          <p className={`${currentTheme.secondaryText} italic`}>
           This Refund Policy is effective as of 18 June 2025.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. No Refunds Policy</h2>
          <p className={currentTheme.secondaryText}>
            At <span className="font-semibold text-blue-400">CollegeSecracy</span>, we offer digital products and services that are delivered instantly upon purchase. Due to the nature of our offerings, <strong>all sales are final</strong> and we do not provide refunds under any circumstances.
          </p>
          <ul className={`list-disc list-inside space-y-2 mt-2 ${currentTheme.secondaryText}`}>
            <li>Change of mind after purchase</li>
            <li>Inability to use the tool due to personal or technical issues</li>
            <li>Accidental or duplicate purchases</li>
            <li>Misunderstanding of product features (please read descriptions carefully)</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">2. Instant Access & Delivery</h2>
          <p className={currentTheme.secondaryText}>
            All tools, plans, and digital features are automatically activated and linked to your account immediately after successful payment. Since you receive full value immediately, refunding would result in irreversible usage.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">3. No Free Trials</h2>
          <p className={currentTheme.secondaryText}>
            CollegeSecracy does not offer free trials. Users are encouraged to carefully review plan details, pricing, and usage before making a payment.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">4. Payment Security</h2>
          <p className={currentTheme.secondaryText}>
            All transactions are processed securely through <strong>Razorpay</strong>. Your card and payment data is never stored on our servers and is protected by bank-level encryption.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">5. Responsibility & Agreement</h2>
          <p className={currentTheme.secondaryText}>
            By proceeding with a purchase, you fully acknowledge and agree to this Refund Policy. If you do not agree, please do not continue with the payment.
          </p>
        </section>

        {/* Section 6: Support */}
        <div className={`${currentTheme.card} rounded-xl p-6 mt-8 border ${currentTheme.border}`}>
          <h2 className="text-xl font-bold mb-4">6. Need Help?</h2>
          <p className={`${currentTheme.secondaryText} mb-2`}>
            If you have any questions before purchasing, feel free to reach out. While we don’t provide refunds, we are here to help you understand the product.
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2 text-sm`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 text-orange-500" />
              Email: <a href="mailto:support@collegesecracy.com" className="underline text-blue-400 hover:text-blue-600">
                support@collegesecracy.com
              </a>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 text-orange-500" />
              Or use our <Link to="/contact" className={`${currentTheme.hoverText} underline`}>contact form</Link>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link to="/" className={`inline-flex items-center ${currentTheme.hoverText}`}>
            <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
