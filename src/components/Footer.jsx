import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, MessageSquare, UserCheck, X, Mail, HelpCircle, BookOpen } from "lucide-react";

const Footer = ({ theme = "dark" }) => {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Theme configurations
  const themes = {
    dark: {
      background: "bg-gray-900",
      text: "text-gray-100",
      secondaryText: "text-gray-400",
      border: "border-gray-800",
      card: "bg-gray-800/80 backdrop-blur-lg",
      cardBorder: "border-gray-700/50",
      hoverText: "hover:text-orange-400",
      divider: "border-gray-800",
      button: "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400",
      modal: "bg-gray-800 border-gray-700",
      svgColor: "text-gray-800"
    },
    light: {
      background: "bg-gray-50",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      border: "border-gray-200",
      card: "bg-white/80 backdrop-blur-lg",
      cardBorder: "border-gray-300/50",
      hoverText: "hover:text-blue-600",
      divider: "border-gray-200",
      button: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
      modal: "bg-white border-gray-200",
      svgColor: "text-gray-200"
    }
  };

  const currentTheme = themes[theme] || themes.dark;

  const handleMentorClick = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${currentTheme.modal} rounded-xl p-6 max-w-md w-full border ${currentTheme.border} shadow-xl relative overflow-hidden`}>
            {/* Decorative SVG */}
            <svg 
              className={`absolute -top-10 -right-10 w-32 h-32 opacity-10 ${currentTheme.svgColor}`}
              viewBox="0 0 200 200"
            >
              <path 
                fill="currentColor" 
                d="M45.2,-62.3C58.9,-53.9,70.1,-40.4,75.3,-25.2C80.5,-10,79.7,6.8,73.4,21.8C67.1,36.8,55.4,50,40.5,58.6C25.7,67.2,7.6,71.2,-9.5,73.6C-26.6,76,-52.2,76.8,-70.5,66.8C-88.8,56.8,-99.8,36,-103.1,13.7C-106.5,-8.7,-102.2,-32.6,-87.7,-49.1C-73.2,-65.6,-48.5,-74.6,-27.5,-78.6C-6.5,-82.6,10.8,-81.6,27.3,-75.3C43.8,-69,59.4,-57.4,70.1,-42.8C80.8,-28.2,86.6,-10.6,86.5,6.9C86.4,24.5,80.4,49,67.1,65.1C53.8,81.2,33.3,88.9,12.3,89.8C-8.7,90.7,-29.3,84.8,-45.4,73.6C-61.5,62.5,-73.2,46.2,-80.5,28.3C-87.9,10.4,-91,-9.1,-84.6,-25.7C-78.2,-42.3,-62.3,-56,-45.1,-64.6C-27.9,-73.2,-9.4,-76.8,7.5,-79.6C24.4,-82.4,48.8,-84.4,62.3,-74.7C75.8,-65,78.4,-43.6,80.5,-22.6C82.6,-1.6,84.2,19,77.8,36.3C71.4,53.6,57,67.6,40.8,76.4C24.6,85.2,6.6,88.8,-10.4,90.9C-27.4,93,-53.8,93.6,-70.6,82.2C-87.4,70.8,-94.6,47.4,-96.2,24.3C-97.8,1.2,-93.8,-21.6,-82.8,-40.2C-71.8,-58.8,-53.8,-73.2,-34.6,-79.2C-15.4,-85.2,5,-82.9,24.3,-76.5C43.6,-70.1,61.7,-59.6,72.3,-45.3C82.9,-31,86,-13,84.1,4.4C82.2,21.8,75.3,43.6,62.8,59.3C50.3,75,32.2,84.6,12.8,87.2C-6.6,89.8,-26.3,85.4,-42.1,75.5C-57.9,65.6,-69.8,50.2,-77.2,32.8C-84.6,15.4,-87.5,-4,-83.9,-22.3C-80.3,-40.6,-70.2,-57.8,-55.4,-66.8C-40.6,-75.8,-21.3,-76.6,-1.5,-79.3C18.3,-82,36.6,-86.6,45.2,-62.3Z" 
                transform="translate(100 100)"
              />
            </svg>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Exciting News!</h3>
              <button 
                onClick={() => setShowComingSoon(false)}
                className={`p-1 rounded-full ${currentTheme.hoverText}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-6">
              Our mentorship feature is currently in development and will be available in the next version!
              Stay tuned for this powerful new way to connect with mentors.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className={`${currentTheme.button} text-white font-medium py-2 px-4 rounded-lg w-full transition-all`}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`${currentTheme.background} ${currentTheme.text} pt-16 pb-10 relative overflow-hidden`}>
        {/* Background SVG Elements */}
        <svg 
          className={`absolute bottom-0 left-0 w-full h-auto opacity-5 ${currentTheme.svgColor}`}
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor"
          ></path>
        </svg>

        {/* Floating Circles */}
        <div className={`absolute -left-20 -bottom-20 w-64 h-64 rounded-full ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200/30'} blur-xl`}></div>
        <div className={`absolute -right-20 top-20 w-48 h-48 rounded-full ${theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-200/30'} blur-xl`}></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start">
              <div className="flex items-center mb-4">
                <GraduationCap className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} w-10 h-10 mr-3`} />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                  College<span className="text-blue-400">Secracy</span>
                </h2>
              </div>
              <p className={`${currentTheme.secondaryText} text-center md:text-left mb-6 max-w-md`}>
                Empowering students with innovative tools and resources to navigate their academic journey.
              </p>
              
              {/* Newsletter */}
              <div className="w-full max-w-sm">
                <h4 className="font-medium mb-3">Stay updated</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className={`flex-1 px-4 py-2 rounded-l-lg border ${currentTheme.border} ${currentTheme.background} focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-orange-500' : 'focus:ring-blue-500'}`}
                  />
                  <button className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity`}>
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Resources */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 flex items-center ${currentTheme.border} border-b`}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#tools" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors flex items-center`}>
                      <ArrowRight className="w-4 h-4 mr-2" /> Calculators
                    </a>
                  </li>
                  <li>
                    <Link to="/authForm" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors flex items-center`}>
                      <ArrowRight className="w-4 h-4 mr-2" /> Study Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/authForm" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors flex items-center`}>
                      <ArrowRight className="w-4 h-4 mr-2" /> Jee Materials
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 flex items-center ${currentTheme.border} border-b`}>
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Support
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/contact" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors flex items-center`}>
                      <ArrowRight className="w-4 h-4 mr-2" /> Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors flex items-center`}>
                      <ArrowRight className="w-4 h-4 mr-2" /> FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/feedback" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors flex items-center`}>
                      <ArrowRight className="w-4 h-4 mr-2" /> Feedback
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 ${currentTheme.border} border-b`}>
                  Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/privacy" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors`}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors`}>
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/cookies" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors`}>
                      Cookie Policy
                    </Link>
                  </li>
                                    <li>
                    <Link to="/refund" className={`${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors`}>
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`${currentTheme.card} rounded-xl p-8 mb-12 border ${currentTheme.cardBorder} relative overflow-hidden`}>
            {/* Decorative SVG */}
            <svg 
              className={`absolute -right-10 -top-10 w-40 h-40 opacity-10 ${currentTheme.svgColor}`}
              viewBox="0 0 200 200"
            >
              <path 
                fill="currentColor" 
                d="M45.2,-62.3C58.9,-53.9,70.1,-40.4,75.3,-25.2C80.5,-10,79.7,6.8,73.4,21.8C67.1,36.8,55.4,50,40.5,58.6C25.7,67.2,7.6,71.2,-9.5,73.6C-26.6,76,-52.2,76.8,-70.5,66.8C-88.8,56.8,-99.8,36,-103.1,13.7C-106.5,-8.7,-102.2,-32.6,-87.7,-49.1C-73.2,-65.6,-48.5,-74.6,-27.5,-78.6C-6.5,-82.6,10.8,-81.6,27.3,-75.3C43.8,-69,59.4,-57.4,70.1,-42.8C80.8,-28.2,86.6,-10.6,86.5,6.9C86.4,24.5,80.4,49,67.1,65.1C53.8,81.2,33.3,88.9,12.3,89.8C-8.7,90.7,-29.3,84.8,-45.4,73.6C-61.5,62.5,-73.2,46.2,-80.5,28.3C-87.9,10.4,-91,-9.1,-84.6,-25.7C-78.2,-42.3,-62.3,-56,-45.1,-64.6C-27.9,-73.2,-9.4,-76.8,7.5,-79.6C24.4,-82.4,48.8,-84.4,62.3,-74.7C75.8,-65,78.4,-43.6,80.5,-22.6C82.6,-1.6,84.2,19,77.8,36.3C71.4,53.6,57,67.6,40.8,76.4C24.6,85.2,6.6,88.8,-10.4,90.9C-27.4,93,-53.8,93.6,-70.6,82.2C-87.4,70.8,-94.6,47.4,-96.2,24.3C-97.8,1.2,-93.8,-21.6,-82.8,-40.2C-71.8,-58.8,-53.8,-73.2,-34.6,-79.2C-15.4,-85.2,5,-82.9,24.3,-76.5C43.6,-70.1,61.7,-59.6,72.3,-45.3C82.9,-31,86,-13,84.1,4.4C82.2,21.8,75.3,43.6,62.8,59.3C50.3,75,32.2,84.6,12.8,87.2C-6.6,89.8,-26.3,85.4,-42.1,75.5C-57.9,65.6,-69.8,50.2,-77.2,32.8C-84.6,15.4,-87.5,-4,-83.9,-22.3C-80.3,-40.6,-70.2,-57.8,-55.4,-66.8C-40.6,-75.8,-21.3,-76.6,-1.5,-79.3C18.3,-82,36.6,-86.6,45.2,-62.3Z" 
                transform="translate(100 100)"
              />
            </svg>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-xl font-bold mb-2">Ready to enhance your learning?</h3>
                <p className={`${currentTheme.secondaryText}`}>
                  Join thousands of students using our tools to succeed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button
                  onClick={handleMentorClick}
                  className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center`}
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Become a Mentor
                </button>
                <button
                  onClick={() => navigate("/authForm")}
                  className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center`}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Join Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t ${currentTheme.divider}">
            <div className={`${currentTheme.secondaryText} text-sm mb-4 md:mb-0`}>
              &copy; {new Date().getFullYear()} CollegeSecracy. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <i className="fa-brands fa-linkedin text-xl"></i>
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <i className="fa-brands fa-x-twitter text-xl"></i>
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <i className="fa-brands fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;