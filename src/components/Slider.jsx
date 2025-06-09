import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";
import { avatar } from "@/assets/script";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TestimonialSlider() {
  const { getApprovedFeedbacks } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  const fallbackAvatar = avatar;

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApprovedFeedbacks();
      if (response.success) {
        const uniqueTestimonials = Array.from(
          new Map(response.data.map(item => [item.id, item])).values()
        );
        setTestimonials(uniqueTestimonials);
      } else {
        throw new Error(response.error || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      setError(err.message || "Something went wrong");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: testimonials.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, testimonials.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, testimonials.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center">
        <p>Error loading testimonials: {error}</p>
        <button
          onClick={fetchTestimonials}
          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="p-8 bg-gray-100 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Customer Testimonials
        </h2>
        <p className="text-gray-600">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 mb-12">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-orange-600">
        What Our Users Say
      </h2>

      <Slider {...sliderSettings} className="px-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="px-2">
            <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full mx-2">
              <div className="flex items-center mb-4">
                {!testimonial.anonymous && (
                  <div className="rounded-full h-14 w-14 overflow-hidden border-2 border-orange-500">
                    <img
                      src={testimonial.profilePic || fallbackAvatar}
                      alt={testimonial.name || "User"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = fallbackAvatar;
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )}
                <div className={testimonial.anonymous ? "" : "ml-4"}>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {testimonial.anonymous ? "Anonymous" : testimonial.name}
                  </h3>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-lg ${
                          testimonial.rating >= star
                            ? "text-orange-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-4 italic leading-relaxed">
                “{testimonial.message}”
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
