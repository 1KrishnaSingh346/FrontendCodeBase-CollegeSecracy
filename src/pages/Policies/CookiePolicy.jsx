import React from "react";
import { Link } from "react-router-dom";
import { Info, Cookie, Shield, ChevronRight } from "lucide-react";

const CookiePolicy = ({ theme = "dark" }) => {
  const themes = {
    dark: {
      background: "bg-gray-900",
      text: "text-gray-100",
      secondaryText: "text-gray-400",
      border: "border-gray-800",
      card: "bg-gray-800/80 backdrop-blur-sm",
      hoverText: "hover:text-orange-400",
    },
    light: {
      background: "bg-gray-50",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      border: "border-gray-200",
      card: "bg-white/80 backdrop-blur-sm",
      hoverText: "hover:text-blue-600",
    }
  };

  const savedMode = localStorage.getItem("darkMode");
  const isDarkMode = savedMode === "true" || (savedMode === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const currentTheme = isDarkMode ? themes.dark : themes.light;

  return (
    <main className={`min-h-screen ${currentTheme.background} ${currentTheme.text} py-12 px-4 sm:px-6 lg:px-8`}>
      <section className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-blue-500 rounded-full p-3 mb-4">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className={`${currentTheme.secondaryText}`}>This Cookie Policy is effective as of 18 June 2025.
</p>
        </header>

        {/* Intro */}
        <article className={`${currentTheme.card} rounded-xl p-6 mb-8 border ${currentTheme.border}`}>
          <div className="flex items-start">
            <Info className="w-5 h-5 mt-0.5 mr-3 text-orange-500" />
            <p>
              This Cookie Policy explains how <span className="font-semibold text-blue-400">CollegeSecracy</span> ("we", "us", or "our") uses cookies and similar technologies when you visit our website. By using our site, you consent to the use of cookies as described here.
            </p>
          </div>
        </article>

        {/* What Are Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Cookie className="w-6 h-6 mr-2 text-orange-500" /> What Are Cookies?
          </h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            Cookies are small data files placed on your device. They help websites function efficiently and provide insights for optimization.
          </p>
          <p className={`${currentTheme.secondaryText}`}>
            They usually don’t contain personal information, but can be linked with data we store.
          </p>
        </section>

        {/* Cookie Types */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-500" /> Types of Cookies We Use
          </h2>

          <div className="grid gap-5">
            {[
              {
                title: "Essential Cookies",
                desc: "Required for core functionality. These can't be disabled.",
                example: "Authentication cookies"
              },
              {
                title: "Analytics Cookies",
                desc: "Used to analyze traffic and performance.",
                example: "Google Analytics cookies"
              },
              {
                title: "Preference Cookies",
                desc: "Enable personalization and remember choices.",
                example: "Theme preference cookies"
              },
            ].map((cookie, i) => (
              <div key={i} className={`${currentTheme.card} rounded-lg p-5 border ${currentTheme.border}`}>
                <h3 className="font-bold text-lg mb-2">{cookie.title}</h3>
                <p className={`${currentTheme.secondaryText} mb-2`}>{cookie.desc}</p>
                <div className="text-sm px-3 py-1 rounded bg-gray-700/40 dark:bg-gray-600/30 inline-block">
                  Example: {cookie.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
          <p className={`${currentTheme.secondaryText} mb-3`}>
            You can manage cookies via your browser settings:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-400">
            <li>Adjust settings to block or allow cookies.</li>
            <li>Delete stored cookies anytime.</li>
            <li>Disable cookies to limit tracking (may affect functionality).</li>
          </ul>
        </section>

        {/* Third Party Disclaimer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Third-Party Links</h2>
          <p className={`${currentTheme.secondaryText}`}>
            Our website may link to third-party services. We don’t control their practices and suggest reviewing their own cookie and privacy policies.
          </p>
        </section>

        {/* Contact Info */}
        <section className={`${currentTheme.card} rounded-xl p-6 border ${currentTheme.border}`}>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className={`${currentTheme.secondaryText} mb-4`}>
            For questions about this Cookie Policy:
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
        </section>

        {/* Back Home */}
        <footer className="mt-12 text-center">
          <Link to="/" className={`inline-flex items-center ${currentTheme.hoverText}`}>
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back to Home
          </Link>
        </footer>
      </section>
    </main>
  );
};

export default CookiePolicy;
