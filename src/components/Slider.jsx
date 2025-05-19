import { useState, useRef, useEffect } from "react";
import { userData } from "../utils/constants";
import { FaStar, FaRegStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Spinner from "../components/Loaders/Spinner";
import avatar1 from "../assets/avatar.png";
import avatar2 from "../assets/avatar.png";
import avatar3 from "../assets/avatar.png";
import avatar4 from "../assets/avatar.png";
import avatar5 from "../assets/avatar.png";
import avatar6 from "../assets/avatar.png";


export default function Slider() {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);


  // Color theme constants
  const theme = {
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryText: 'text-orange-500',
    secondary: 'bg-blue-500',
    secondaryHover: 'hover:bg-blue-600',
    dark: 'bg-gray-900',
    light: 'bg-gray-100',
    textDark: 'text-gray-900',
    textLight: 'text-gray-100',
    borderPrimary: 'border-orange-500',
    borderSecondary: 'border-blue-500'
  };

  // Local fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (Array.isArray(userData)) {
          // Ensure all profile images have fallbacks
          const processedData = userData.map(item => ({
            ...item,
            profileImage: item.profileImage || fallbackImage
          }));
          
          setData(processedData);
          const initialRatings = {};
          userData.forEach((_, index) => {
            initialRatings[index] = 0;
          });
          setRatings(initialRatings);
        } else {
          throw new Error("No valid data available");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        setData([{
          id: 1,
          name: "Demo User",
          profileImage: localAvatars[0],
          testimonial: "This is a placeholder testimonial in case the real data fails to load."
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRating = (index, star) => {
    setRatings(prev => ({
      ...prev,
      [index]: star
    }));
    // API call to save rating would go here
  };

  const scrollByDistance = () => {
    if (!sliderRef.current) return 0;
    const item = sliderRef.current.querySelector('.slider-item');
    return item ? item.offsetWidth + 40 : 300;
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ 
        left: scrollByDistance(), 
        behavior: "smooth" 
      });
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ 
        left: -scrollByDistance(), 
        behavior: "smooth" 
      });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme.dark}`}>
        <Spinner className={`text-orange-500 h-12 w-12`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${theme.secondary} ${theme.textLight} text-center`}>
        <p>Error loading testimonials: {error}</p>
        <p className="text-sm mt-2">Showing placeholder content instead</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full mt-12 p-4 ${theme.light} rounded-xl`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme.textDark} text-center`}>
        Customer Testimonials
      </h2>
      
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-10 hide-scrollbar snap-x snap-mandatory"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`slider-item snap-start flex-shrink-0 w-[90vw] md:w-[500px] p-6 rounded-xl shadow-lg ${theme.dark} ${theme.textLight}`}
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full h-16 w-16 overflow-hidden border-2 border-orange-500">
                <img 
                  src={item.profileImage} 
                  alt={item.name} 
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="ml-4">
                <h3 className={`text-xl font-semibold ${theme.textLight}`}>{item.name}</h3>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => handleRating(index, star)}
                      className="focus:outline-none"
                    >
                      {ratings[index] >= star ? (
                        <FaStar className={`text-orange-500 text-lg`} />
                      ) : (
                        <FaRegStar className={`text-orange-500 text-lg`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-gray-300 italic">
              <p>"{item.testimonial}"</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 ${theme.primary} ${theme.primaryHover} ${theme.textLight} p-3 rounded-full shadow-lg z-10 transition-all`}
        onClick={handlePrev}
        aria-label="Previous testimonial"
      >
        <FaArrowLeft />
      </button>
      <button
        className={`absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 ${theme.primary} ${theme.primaryHover} ${theme.textLight} p-3 rounded-full shadow-lg z-10 transition-all`}
        onClick={handleNext}
        aria-label="Next testimonial"
      >
        <FaArrowRight />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (sliderRef.current) {
                const item = sliderRef.current.querySelectorAll('.slider-item')[index];
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            className={`w-3 h-3 rounded-full ${index === 0 ? theme.primary : 'bg-gray-500'}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}