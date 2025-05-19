import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQItem = ({ question, answer, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-2 rounded-lg md:p-4 p-3 mb-3 transition-all duration-300 ${
        isOpen
          ? darkMode
            ? "bg-gradient-to-r from-gray-800 to-gray-700 border-orange-400 shadow-lg"
            : "bg-gradient-to-r from-blue-50 to-orange-50 border-orange-400 shadow-lg"
          : darkMode
          ? "bg-gray-800 border-gray-700 shadow-md"
          : "bg-white border-gray-200 shadow-md"
      } ${darkMode ? "shadow-gray-900/50" : "shadow-gray-300/50"} ${
        darkMode ? "hover:shadow-orange-500/20" : "hover:shadow-orange-200/50"
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4
          className={`text-base md:text-xl font-medium ${
            isOpen
              ? darkMode
                ? "text-orange-400"
                : "text-blue-800"
              : darkMode
              ? "text-gray-300 group-hover:text-orange-400"
              : "text-gray-800 group-hover:text-orange-600"
          } transition-colors`}
        >
          {question}
        </h4>
        <button
          className={`transform transition-all duration-300 text-xl md:text-2xl font-bold ${
            isOpen
              ? "rotate-45 text-orange-500"
              : darkMode
              ? "text-gray-400 group-hover:text-orange-400"
              : "text-blue-600 group-hover:text-orange-500"
          }`}
          aria-label={isOpen ? "Collapse answer" : "Expand answer"}
        >
          +
        </button>
      </div>
      {isOpen && (
        <div className="mt-3 md:mt-4 pl-1 md:pl-2 animate-fadeIn">
          <p
            className={`text-sm md:text-base ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } border-l-4 ${
              darkMode ? "border-orange-500" : "border-orange-400"
            } pl-3 md:pl-4 py-1`}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQs = ({ FAQs, page, darkMode }) => {
  const [showAll, setShowAll] = useState(false);
  const initialFAQsToShow = 5;
  const faqsToDisplay = showAll ? FAQs : FAQs.slice(0, initialFAQsToShow);

  return (
    <section
      id="faqs"
      className={`py-8 md:py-12 ${
        page === "contact"
          ? darkMode
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-800"
            : "bg-gradient-to-b from-white via-blue-50 to-blue-100"
          : darkMode
          ? "bg-gray-900"
          : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2
            className={`text-2xl md:text-4xl font-bold ${
              darkMode ? "text-orange-400" : "text-gray-800"
            } mb-3 md:mb-4`}
          >
            Frequently Asked Questions
          </h2>
          <div
            className={`w-16 md:w-20 h-1 ${
              darkMode
                ? "bg-gradient-to-r from-orange-500 to-blue-600"
                : "bg-gradient-to-r from-orange-400 to-blue-500"
            } mx-auto rounded-full`}
          ></div>
          <p
            className={`mt-3 md:mt-4 text-sm md:text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Find answers to common questions about our platform and services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-3 md:space-y-4">
            {faqsToDisplay.map((faq, index) => (
              <FAQItem
                key={`${page}-faq-${faq.id || index}`}
                question={faq.question}
                answer={faq.answer}
                darkMode={darkMode}
              />
            ))}
          </div>

          {FAQs.length > initialFAQsToShow && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className={`font-medium py-2 px-6 rounded-lg transition-all ${
                  darkMode
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}

          <div className="mt-8 md:mt-12 text-center">
            <p
              className={`text-sm md:text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } mb-3 md:mb-4`}
            >
              Still have questions?
            </p>
            <Link
              to="/contact"
              className={`inline-block ${
                darkMode
                  ? "bg-gradient-to-r from-orange-600 to-blue-700"
                  : "bg-gradient-to-r from-orange-500 to-blue-600"
              } text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;