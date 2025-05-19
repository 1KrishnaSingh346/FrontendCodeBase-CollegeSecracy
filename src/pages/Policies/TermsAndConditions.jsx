import React from "react";
import { FileText, ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { TermsAndConditons } from "../../utils/constants";

const TermsAndConditions = ({ theme = "dark" }) => {
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
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className={`${currentTheme.secondaryText} max-w-2xl mx-auto`}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Sections */}
        {TermsAndConditons.map((section, index) => (
          <div key={index} className={`mb-8 ${index > 0 ? `pt-6 border-t ${currentTheme.divider}` : ''}`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-500" />
              {section.title}
            </h2>
            
            {section.content && (
              <p className={`${currentTheme.secondaryText} mb-4`}>
                {section.content}
                {section.link && (
                  <a href={section.link.href} className={`${currentTheme.hoverText} underline`}>
                    {section.link.text}
                  </a>
                )}
              </p>
            )}

            {section.list && (
              <ul className={`${currentTheme.secondaryText} space-y-2`}>
                {section.list.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-purple-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Contact */}
        <div className={`${currentTheme.card} rounded-xl p-6 mt-8 border ${currentTheme.border}`}>
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <p className={`${currentTheme.secondaryText}`}>
            For questions about these terms, please contact us at {' '}
            <a href="mailto:legal@collegesecracy.com" className={`${currentTheme.hoverText} underline`}>
              legal@collegesecracy.com
            </a>
          </p>
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

export default TermsAndConditions;