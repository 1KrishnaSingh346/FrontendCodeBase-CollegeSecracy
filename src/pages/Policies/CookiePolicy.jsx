import React from "react";
import { Link } from "react-router-dom";
import { Info, Cookie, Shield, ChevronRight } from "lucide-react";

const CookiePolicy = ({ theme = "dark" }) => {
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
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-blue-500 rounded-full p-3 mb-4">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className={`${currentTheme.secondaryText} max-w-2xl mx-auto`}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className={`${currentTheme.card} rounded-xl p-6 mb-8 border ${currentTheme.border}`}>
          <div className="flex items-start">
            <Info className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 text-orange-500" />
            <div>
              <p className={`${currentTheme.text}`}>
                This Cookie Policy explains how CollegeSecracy ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website. By using our site, you consent to our use of cookies in accordance with this policy.
              </p>
            </div>
          </div>
        </div>

        {/* What Are Cookies */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Cookie className="w-6 h-6 mr-2 text-orange-500" />
            What Are Cookies?
          </h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the site owners.
          </p>
          <p className={`${currentTheme.secondaryText}`}>
            Cookies do not typically contain any information that personally identifies a user, but personal information that we store about you may be linked to the information stored in and obtained from cookies.
          </p>
        </div>

        {/* Types of Cookies We Use */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-500" />
            Types of Cookies We Use
          </h2>
          
          <div className="grid gap-4 mb-6">
            {/* Essential Cookies */}
            <div className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
              <h3 className="font-bold text-lg mb-2">Essential Cookies</h3>
              <p className={`${currentTheme.secondaryText} mb-3`}>
                These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you.
              </p>
              <div className={`${currentTheme.secondaryText} text-sm bg-gray-800/50 dark:bg-gray-700/30 rounded px-3 py-2 inline-block`}>
                Example: Authentication cookies
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
              <h3 className="font-bold text-lg mb-2">Analytics Cookies</h3>
              <p className={`${currentTheme.secondaryText} mb-3`}>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
              </p>
              <div className={`${currentTheme.secondaryText} text-sm bg-gray-800/50 dark:bg-gray-700/30 rounded px-3 py-2 inline-block`}>
                Example: Google Analytics cookies
              </div>
            </div>

            {/* Preference Cookies */}
            <div className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
              <h3 className="font-bold text-lg mb-2">Preference Cookies</h3>
              <p className={`${currentTheme.secondaryText} mb-3`}>
                These cookies enable the website to provide enhanced functionality and personalization based on your choices.
              </p>
              <div className={`${currentTheme.secondaryText} text-sm bg-gray-800/50 dark:bg-gray-700/30 rounded px-3 py-2 inline-block`}>
                Example: Theme preference cookies
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Management */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            Most web browsers allow some control of most cookies through the browser settings. You can:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2 mb-6`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-orange-500" />
              <span>Review your browser's cookie settings and adjust them to your preference</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-orange-500" />
              <span>Delete existing cookies from your device</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-orange-500" />
              <span>Set your browser to refuse all or some cookies</span>
            </li>
          </ul>
          <p className={`${currentTheme.secondaryText}`}>
            Please note that if you disable cookies, some features of our website may not function properly.
          </p>
        </div>

        {/* Changes to This Policy */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
          <p className={`${currentTheme.secondaryText}`}>
            You are advised to review this Cookie Policy periodically for any changes.
          </p>
        </div>

        {/* Contact Information */}
        <div className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            If you have any questions about this Cookie Policy, please contact us:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2`}>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-orange-500" />
              <span>By email: privacy@collegesecracy.com</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-orange-500" />
              <span>Through our <Link to="/contact" className={`${currentTheme.hoverText} underline`}>contact form</Link></span>
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

export default CookiePolicy;