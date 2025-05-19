import React from "react";
import { Info, Shield, Mail, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = ({ theme = "dark" }) => {
  // Theme configurations
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

  const savedMode = localStorage.getItem('darkMode');
  const isDarkMode = savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const currentTheme = isDarkMode ? themes.dark : themes.light;

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} py-12 px-4 sm:px-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className={`${currentTheme.secondaryText} max-w-2xl mx-auto`}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className={`${currentTheme.card} rounded-xl p-6 mb-8 border ${currentTheme.border}`}>
          <div className="flex items-start">
            <Info className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 text-blue-500" />
            <div>
              <p className={`${currentTheme.text}`}>
                Welcome to <span className="font-semibold text-blue-400">CollegeSecracy</span>. 
                We are committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, and safeguard your personal information when you use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2 text-blue-500" />
            Information We Collect
          </h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            We collect several types of information from and about users of our website, including:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2 mb-6`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span><strong>Personal Information:</strong> Name, email address, phone number, and other contact details</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span><strong>Usage Data:</strong> IP address, browser type, pages visited, and other technical information</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span><strong>Payment Information:</strong> Billing details for processing transactions (handled securely by our payment processors)</span>
            </li>
          </ul>
        </div>

        {/* How We Use Information */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            We use the information we collect for various purposes, including:
          </p>
          <div className="grid gap-4 mb-6">
            <div className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
              <h3 className="font-bold text-lg mb-2">Service Provision</h3>
              <p className={`${currentTheme.secondaryText}`}>
                To provide and maintain our services, including account management and customer support
              </p>
            </div>
            <div className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
              <h3 className="font-bold text-lg mb-2">Improvements</h3>
              <p className={`${currentTheme.secondaryText}`}>
                To analyze usage patterns and improve our website and services
              </p>
            </div>
            <div className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
              <h3 className="font-bold text-lg mb-2">Communication</h3>
              <p className={`${currentTheme.secondaryText}`}>
                To contact you with important notices and (if consented) marketing communications
              </p>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Data Sharing & Disclosure</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            We may share your information in the following circumstances:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2 mb-6`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>With service providers who assist in our operations (under strict confidentiality agreements)</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>When required by law or to protect our legal rights</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>In connection with a business transfer, such as a merger or acquisition</span>
            </li>
          </ul>
        </div>

        {/* Your Rights */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            Depending on your jurisdiction, you may have certain rights regarding your personal data:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2 mb-6`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>Request access to or deletion of your personal data</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>Correct inaccurate information</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>Object to or restrict certain processing activities</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>Withdraw consent where processing is based on consent</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-blue-500" />
            Contact Us
          </h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            If you have questions about this policy or your personal data:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>Email: <a href="mailto:privacy@collegesecracy.com" className={`${currentTheme.hoverText} underline`}>privacy@collegesecracy.com</a></span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
              <span>Use our <Link to="/contact" className={`${currentTheme.hoverText} underline`}>contact form</Link></span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className={`inline-flex items-center ${currentTheme.hoverText} transition-colors`}
          >
            <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;