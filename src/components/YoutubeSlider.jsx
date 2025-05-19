import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiYoutube, FiArrowRight, FiX } from "react-icons/fi";

const YouTubeSliderSection = () => {
  const videoCarouselRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null); // For modal preview

  // YouTube video data
  const youtubeVideos = [
    {
      id: "nckBfedOuZk",
      title: "Let's Talk on College JEE MAINS 2025 | #nits #live",
      thumbnail: "https://img.youtube.com/vi/nckBfedOuZk/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=nckBfedOuZk",
      duration: "40:42",
    },
    {
      id: "AZol9P77--Q",
      title: "CSAB Counselling 2025 Explained✅ | Dates, Documents & Step-by-Step Process | NIT,IIT & GFTI #csab",
      thumbnail: "https://img.youtube.com/vi/AZol9P77--Q/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=AZol9P77--Q",
      duration: "15:58",
    },
    {
      id: "0D-x5V3rLdA",
      title: "JOSAA Counselling 2025 Explained✅ | Dates, Documents & Step-by-Step Process | NIT,IIT & GFTI #jossa",
      thumbnail: "https://img.youtube.com/vi/0D-x5V3rLdA/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=0D-x5V3rLdA",
      duration: "14:07",
    },
    {
      id: "I3tjqEfxGfQ",
      title: "JOSSA & CSAB Counselling 2025🔥: Avoid this Mistakes | Chances of Admission Cancel ⚠️ #jossa #csab",
      thumbnail: "https://img.youtube.com/vi/I3tjqEfxGfQ/hqdefault.jpg",
      url: "http://youtube.com/watch?v=I3tjqEfxGfQ",
      duration: "8:52",
    },
    {
      id: "I3pwiiHRa1w",
      title: "Low Percentile GFTI College 2025🔥| 10 to 95 %le | All Category Options | #jeemains #nits",
      thumbnail: "https://img.youtube.com/vi/I3pwiiHRa1w/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=I3pwiiHRa1w",
      duration: "7:37",
    },
    {
      id: "RUw2gDoymF8",
      title: "Document Required For JoSSA & CSAB Counselling 2025📢|Category Certificate With Proof✅ #jee #jossa",
      thumbnail: "https://img.youtube.com/vi/RUw2gDoymF8/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=RUw2gDoymF8",
      duration: "11:51",
    },
  ];

  // Auto slide videos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => 
        prev === youtubeVideos.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Scroll video carousel when index changes
  useEffect(() => {
    if (videoCarouselRef.current) {
      const videoWidth = videoCarouselRef.current.children[0]?.offsetWidth || 300;
      videoCarouselRef.current.scrollTo({
        left: currentVideoIndex * (videoWidth + 16), // 16px gap
        behavior: 'smooth'
      });
    }
  }, [currentVideoIndex]);

  return (
    <motion.section
      id="videos-section"
      className="py-8 px-2 sm:px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 px-2">
          <motion.div
            className="inline-block bg-gradient-to-r from-orange-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            LEARNING RESOURCES
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
              YouTube
            </span>{" "}
            Videos
          </motion.h2>
          <motion.p
            className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Watch our expert-curated videos to enhance your preparation
          </motion.p>
        </div>

        {/* Video Carousel */}
        <div className="relative">
          <div
            ref={videoCarouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-6 scrollbar-hide px-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {youtubeVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="flex-shrink-0 w-[280px] sm:w-72 md:w-80 lg:w-96 snap-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 h-full"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <FiYoutube className="text-white text-xl sm:text-2xl" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm sm:text-base">
                      {video.title}
                    </h3>
                    <div className="mt-2 flex items-center text-xs sm:text-sm text-red-600 dark:text-orange-400">
                      <span>Watch on YouTube</span>
                      <FiArrowRight className="ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {youtubeVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentVideoIndex === index
                    ? "bg-orange-500 w-4"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-2 sm:px-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl w-full max-w-3xl relative"
            >
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg line-clamp-2">
                  {selectedVideo.title}
                </h3>
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-semibold text-red-600 hover:underline whitespace-nowrap"
                >
                  Watch on YouTube
                </a>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 p-1 sm:p-2 rounded-full"
              >
                <FiX className="text-lg sm:text-xl" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default YouTubeSliderSection;