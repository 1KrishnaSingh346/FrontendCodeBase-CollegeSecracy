// ToolsSlider.jsx

import React, { useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiBarChart2, FiPercent, FiDollarSign } from 'react-icons/fi';
import { SparklesIcon } from '@heroicons/react/24/solid';
import ToolCard from './ToolCard';

const ToolsSlider = ({ user, navigate, setShowPremiumToolsModal }) => {
  const sliderRef = useRef(null);

  const scrollBy = (offset) => {
    sliderRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

useEffect(() => {
  const interval = setInterval(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;

    // If at or near end, reset to beginning
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, 3000);

  return () => clearInterval(interval);
}, []);


  const allTools = [
    {
      title: "Rank Calculator",
      description: "Calculate expected rank based on marks",
      icon: <FiBarChart2 className="text-blue-500" />,
      onClick: () => navigate(`/${user.role}-dashboard/tools/rank-calculator`),
      type: 'free',
    },
    {
      title: "Percentile Calculator",
      description: "Estimate JEE Main percentile",
      icon: <FiPercent className="text-purple-500" />,
      onClick: () => navigate(`/${user.role}-dashboard/tools/percentile-calculator`),
      type: 'free',
    },
    {
      title: "CGPA Calculator",
      description: "Calculate CGPA from percentage",
      icon: <FiDollarSign className="text-green-500" />,
      onClick: () => navigate(`/${user.role}-dashboard/tools/cgpa-calculator`),
      type: 'free',
    },
    ...user?.premiumTools?.map(({ toolId }) => ({
      title: toolId?.title,
      description: toolId?.description,
      icon: <SparklesIcon className="text-orange-500 w-5 h-5" />,
      onClick: () => navigate(`/${user.role}-dashboard/tools/${toolId.link}`),
      type: 'premium',
    })) || [],
    {
      title: "Unlock Premium",
      description: "Get access to all advanced study tools",
      icon: <SparklesIcon className="text-orange-500 w-5 h-5" />,
      onClick: () => setShowPremiumToolsModal(true),
      type: 'locked',
    },
  ];

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button onClick={() => scrollBy(-viewportWidth())} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 rounded-full p-1 z-10">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={() => scrollBy(viewportWidth())} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 rounded-full p-1 z-10">
        <FiChevronRight size={24} />
      </button>

      {/* Tool Cards Slider */}
      <div ref={sliderRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x scroll-smooth px-2 py-4">
        {allTools.map((tool, idx) => (
          <div key={idx} className="snap-center shrink-0 w-[240px] sm:w-[280px]">
            <ToolCard
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={tool.onClick}
              isFree={tool.type === 'free'}
              accessType={tool.type === 'premium' ? 'premium' : ''}
              locked={tool.type === 'locked'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const viewportWidth = () => window.innerWidth * 0.8;

export default ToolsSlider;
