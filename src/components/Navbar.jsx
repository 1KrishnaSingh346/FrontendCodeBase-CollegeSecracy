import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { GraduationCap } from "lucide-react";
import PropTypes from 'prop-types';
import Logo from "/Logo.webp";

const Navbar = ({ isLoggedIn = false, theme = 'dark' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Theme-based styles
  const themeStyles = {
    navBg: theme === 'dark' ? 'bg-white/20' : 'bg-gray-500/20',
    navText: theme === 'dark' ? 'text-white' : 'text-white',
    navHover: theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-800',
    dropdownBg: theme === 'dark' ? 'bg-gray-800/95' : 'bg-gray-200/70',
    dropdownText: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
    dropdownHover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-400',
    buttonBg: theme === 'dark' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-500 hover:bg-orange-600',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
    buttonHover: theme === 'dark' ? 'hover:bg-white/30' : 'hover:bg-gray-300/80',
    mobileMenuBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    mobileMenuText: theme === 'dark' ? 'text-gray-200' : 'text-black'
  };

  return (
    <nav className={`fixed top-0 w-full flex items-center justify-between px-4 md:py-0 sm:px-6  z-50 backdrop-blur-md ${themeStyles.navBg} border-b ${themeStyles.borderColor}`}>
      {/* Logo and Mobile Menu Button */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link 
          to="/" 
          className={`text-2xl sm:text-3xl font-bold flex items-center bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity`}
        >
         <img className="md:h-16 h-12 w-32 md:w-44 text-white" src={Logo} alt="collegesecracy"></img>
          
        </Link>

        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes size={24} className={themeStyles.navText} />
          ) : (
            <FaBars size={24} className={themeStyles.navText} />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
        <Link 
          to="/" 
          className={`${themeStyles.navText}/90 ${themeStyles.navHover} font-medium transition-colors px-2`}
        >
          Home
        </Link>

        
        <div className="relative">
          <button
            className={`flex items-center ${themeStyles.navText}/90 ${themeStyles.navHover} font-medium transition-colors px-2`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>Company</span>
            <FaChevronDown className={`ml-1 text-xs transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-48 ${themeStyles.dropdownBg} backdrop-blur-lg rounded-lg shadow-xl py-1 z-20 border ${themeStyles.borderColor}`}>
              <Link 
                to="/about" 
                className={`block px-4 py-2 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`block px-4 py-2 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
              >
                Contact Us
              </Link>
              <Link 
                to="/terms" 
                className={`block px-4 py-2 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/privacy" 
                className={`block px-4 py-2 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
              >
                Privacy Policy
              </Link>
            </div>
          )}
        </div>
        
        <a 
          href="#tools" 
          className={`${themeStyles.navText}/90 ${themeStyles.navHover} font-medium transition-colors px-2`}
        >
          Tools
        </a>
        
        <a 
          href="#counseling-plans" 
          className={`${themeStyles.navText}/90 ${themeStyles.navHover} font-medium transition-colors px-2`}
        >
          Counseling Plans
        </a>
        
        <Link
          to={isLoggedIn ? "/resources" : "/authForm"}
          className={`${themeStyles.navText}/90 ${themeStyles.navHover} font-medium transition-colors px-2`}
        >
          Resources
        </Link>

        {!isLoggedIn ? (
          <Link 
            to="/authForm" 
            className={`${themeStyles.buttonBg} ${themeStyles.buttonText} px-6 py-2 rounded-full border ${themeStyles.borderColor} transition-all duration-300 ml-4`}
          >
            Register Now
          </Link>
        ) : (
          <Link 
            to="/profile" 
            className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} ${themeStyles.navText} px-6 py-2 rounded-full transition-all duration-300 ml-4`}
          >
            Profile
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden fixed inset-0 ${themeStyles.mobileMenuBg} z-40 mt-16`}>
          <div className={`p-4 ${themeStyles.mobileMenuBg}`}>
            <Link 
              to="/" 
              className={`block ${themeStyles.mobileMenuText} hover:text-orange-500 font-medium py-4 border-b ${themeStyles.borderColor}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <button
              className={`flex items-center justify-between w-full ${themeStyles.mobileMenuText} hover:text-orange-500 font-medium py-4 border-b ${themeStyles.borderColor}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Company</span>
              <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className={`pl-4 space-y-3 ${themeStyles.dropdownBg} rounded-lg my-2 p-2`}>
                <Link 
                  to="/about" 
                  className={`block py-3 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/contact" 
                  className={`block py-3 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <Link 
                  to="/terms" 
                  className={`block py-3 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Terms & Conditions
                </Link>
                <Link 
                  to="/privacy" 
                  className={`block py-3 ${themeStyles.dropdownText} ${themeStyles.dropdownHover}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Privacy Policy
                </Link>
              </div>
            )}
  
            <a 
              href="#tools" 
              className={`block ${themeStyles.mobileMenuText} hover:text-orange-500 font-medium py-4 border-b ${themeStyles.borderColor}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </a>
            
            <a 
              href="#counseling-plans" 
              className={`block ${themeStyles.mobileMenuText} hover:text-orange-500 font-medium py-4 border-b ${themeStyles.borderColor}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Counseling Plans
            </a>
            
            <Link
              to={isLoggedIn ? "/resources" : "/authForm"}
              className={`block ${themeStyles.mobileMenuText} hover:text-orange-500 font-medium py-4 border-b ${themeStyles.borderColor}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>

            <div className="mt-6 space-y-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/authForm?type=register"
                    className={`block ${theme === 'dark' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-blue-600 hover:bg-blue-500'} text-white text-center font-medium py-3 px-4 rounded-full`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register Now
                  </Link>
                  <Link
                    to="/authForm?type=login"
                    className={`block border ${themeStyles.borderColor} hover:border-orange-500 ${themeStyles.mobileMenuText} text-center font-medium py-3 px-4 rounded-full`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link
                  to="/profile"
                  className={`block ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} ${themeStyles.mobileMenuText} text-center font-medium py-3 px-4 rounded-full`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark'])
};

Navbar.defaultProps = {
  isLoggedIn: false,
  theme: 'dark'
};

export default Navbar;