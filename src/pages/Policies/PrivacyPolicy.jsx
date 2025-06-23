import React from "react";
import { Info, Shield, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const savedMode = localStorage.getItem("darkMode");
  const isDarkMode =
    savedMode === "true" ||
    (savedMode === null &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const theme = {
    background: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    text: isDarkMode ? "text-gray-100" : "text-gray-900",
    secondaryText: isDarkMode ? "text-gray-400" : "text-gray-600",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    card: isDarkMode
      ? "bg-gray-800/80 backdrop-blur-sm"
      : "bg-white/80 backdrop-blur-sm",
    hoverText: isDarkMode ? "hover:text-orange-400" : "hover:text-blue-600",
    divider: isDarkMode ? "border-gray-800" : "border-gray-200",
    icon: "text-blue-500"
  };

  return (
    <div className={`min-h-screen ${theme.background} ${theme.text} py-10 px-4`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className={`${theme.secondaryText}`}>
              This Privacy Policy is effective as of 18 June 2025. 
          </p>
        </div>

        {/* Introduction */}
        <section className={`${theme.card} p-5 rounded-xl border ${theme.border} mb-8`}>
          <div className="flex gap-3 items-start">
            <Info className={`w-5 h-5 mt-1 ${theme.icon}`} />
            <p>
              Welcome to <span className="font-semibold text-blue-400">CollegeSecracy</span>. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our services.
            </p>
          </div>
        </section>

        {/* Information Collection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center">
            <Info className={`w-6 h-6 mr-2 ${theme.icon}`} />
            Information We Collect
          </h2>
          <ul className={`${theme.secondaryText} space-y-2`}>
            {[
              {
                label: "Personal Information",
                desc: "Name, email address, phone number, and contact details"
              },
              {
                label: "Usage Data",
                desc: "IP address, browser type, pages visited, device type"
              },
              {
                label: "Payment Information",
                desc: "Billing details for transactions via secure payment gateways"
              }
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <ChevronRight className={`w-4 h-4 mt-1 mr-2 ${theme.icon}`} />
                <span>
                  <strong>{item.label}:</strong> {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* How We Use Information */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Service Provision",
                desc: "To operate our services, manage user accounts and support"
              },
              {
                title: "Improvements",
                desc: "To analyze user behavior and improve our website experience"
              },
              {
                title: "Communication",
                desc: "To send important updates or promotional content (with consent)"
              }
            ].map((card, i) => (
              <div
                key={i}
                className={`${theme.card} border ${theme.border} rounded-lg p-4`}
              >
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className={theme.secondaryText}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sharing */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Data Sharing & Disclosure</h2>
          <ul className={`${theme.secondaryText} space-y-2`}>
            {[
              "With trusted service providers under confidentiality agreements",
              "When legally required or to protect our rights",
              "During a merger, acquisition, or business transfer"
            ].map((point, index) => (
              <li key={index} className="flex items-start">
                <ChevronRight className={`w-4 h-4 mt-1 mr-2 ${theme.icon}`} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <ul className={`${theme.secondaryText} space-y-2`}>
            {[
              "Request access to or deletion of your data",
              "Correct inaccurate personal information",
              "Object to or limit specific data usage",
              "Withdraw consent at any time"
            ].map((right, i) => (
              <li key={i} className="flex items-start">
                <ChevronRight className={`w-4 h-4 mt-1 mr-2 ${theme.icon}`} />
                <span>{right}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* External Links */}
<div className="mb-10">
  <h2 className="text-2xl font-bold mb-4">External Links</h2>
  <p className={`${theme.secondaryText}`}>
    Our website may contain links to third-party websites or services for your convenience and information. 
    Once you leave our site, we are not responsible for the content, privacy practices, or policies of those websites. 
    We recommend reviewing the privacy policies of any external sites you visit.
  </p>
</div>

        {/* Contact Us */}
        <section className={`${theme.card} p-5 border ${theme.border} rounded-xl`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Mail className={`w-6 h-6 mr-2 ${theme.icon}`} />
            Contact Us
          </h2>
          <ul className={`${theme.secondaryText} space-y-2`}>
            <li className="flex items-start">
              <ChevronRight className={`w-4 h-4 mt-1 mr-2 ${theme.icon}`} />
              Email:{" "}
              <a href="mailto:supportcollegesecracy@gmail.com" className="underline text-blue-400 hover:text-blue-600">
supportcollegesecracy@gmail.com
    </a>
            </li>
            <li className="flex items-start">
              <ChevronRight className={`w-4 h-4 mt-1 mr-2 ${theme.icon}`} />
              Use our{" "}
              <Link to="/contact" className={`${theme.hoverText} underline ml-1`}>
                contact form
              </Link>
            </li>
          </ul>
        </section>

        {/* Footer / Back */}
        <div className="mt-10 text-center">
          <Link to="/" className={`inline-flex items-center ${theme.hoverText}`}>
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
