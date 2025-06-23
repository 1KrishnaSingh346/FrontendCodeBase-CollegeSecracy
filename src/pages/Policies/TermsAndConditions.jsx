import React from "react";
import { FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = ({ theme = "dark" }) => {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className={`${currentTheme.secondaryText}`}>
            These Terms and Conditions are effective as of 18 June 2025.
          </p>
        </div>

        {/* 1. Introduction */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className={currentTheme.secondaryText}>
            Welcome to <span className="font-semibold text-blue-400">CollegeSecracy</span>. These Terms & Conditions govern your use of our website and services. By accessing this platform, you agree to comply with and be legally bound by these terms.
          </p>
        </section>

        {/* 2. User Responsibilities */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">2. User Responsibilities</h2>
          <ul className={`space-y-2 ${currentTheme.secondaryText}`}>
            <li className="flex">
              <ChevronRight className="mt-1 mr-2 text-purple-500" />
              You agree not to misuse the services or attempt unauthorized access.
            </li>
            <li className="flex">
              <ChevronRight className="mt-1 mr-2 text-purple-500" />
              You are responsible for keeping your account secure.
            </li>
            <li className="flex">
              <ChevronRight className="mt-1 mr-2 text-purple-500" />
              You agree not to post illegal, offensive, or harmful content.
            </li>
          </ul>
        </section>

        {/* 3. Intellectual Property */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">3. Intellectual Property</h2>
          <p className={currentTheme.secondaryText}>
            All content on this platform, including text, graphics, logos, and software, is protected under copyright and other laws. Unauthorized use is strictly prohibited.
          </p>
        </section>

        {/* 4. Disclaimer of Warranties */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">4. Disclaimer of Warranties</h2>
          <p className={currentTheme.secondaryText}>
            Our website is provided "as is" and "as available" without any warranties of any kind. We do not guarantee accuracy, completeness, or availability of content or functionality.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
          <p className={currentTheme.secondaryText}>
            We are not liable for any direct, indirect, incidental, or consequential damages arising out of your use or inability to use the service.
          </p>
        </section>

        {/* 6. Monetization Disclosure */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">6. Monetization & Ads</h2>
          <p className={currentTheme.secondaryText}>
            This website may display advertisements or contain affiliate links. We may earn revenue from such interactions, but we do not endorse specific products unless explicitly stated.
          </p>
        </section>

        {/* 7. Termination */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
          <p className={currentTheme.secondaryText}>
            We may suspend or terminate your access without notice if you breach these terms or misuse the platform.
          </p>
        </section>

        {/* 8. Modifications */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
          <p className={currentTheme.secondaryText}>
            We reserve the right to change these terms at any time. Continued use of the platform implies acceptance of the updated terms.
          </p>
        </section>

        {/* 9. Governing Law */}
        <section className="mb-10 border-t pt-6 border-dashed">
          <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
          <p className={currentTheme.secondaryText}>
            These Terms shall be governed in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts located in Varanasi, Uttar Pradesh.
          </p>
        </section>

        {/* 10. Contact Info */}
        <div className={`${currentTheme.card} rounded-xl p-6 mt-8 border ${currentTheme.border}`}>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className={`${currentTheme.secondaryText} mb-2`}>
            For any queries, feedback, or complaints regarding these Terms, reach out to us at:
          </p>
          <ul className={`${currentTheme.secondaryText} space-y-2 text-sm`}>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 mt-1 mr-2 text-orange-500" />
                        Email: <a href="mailto:supportcollegesecracy@gmail.com" className="underline text-blue-400 hover:text-blue-600">
      supportcollegesecracy@gmail.com
    </a>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 mt-1 mr-2 text-orange-500" />
                        Via our <Link to="/contact" className={`${currentTheme.hoverText} underline`}>contact form</Link>
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

export default TermsAndConditions;
