import { useState } from 'react';
import { 
  FiActivity, 
  FiHeart, 
  FiMoon, 
  FiSun, 
  FiCoffee, 
  FiCheck, 
  FiChevronRight,
  FiBook,
  FiUsers,
  FiPhone,
  FiCalendar,
  FiAward,
  FiBarChart2,
  FiClock,
  FiZap,
  FiLayers
} from 'react-icons/fi';

const MentalHealthComponent = () => {
  const [activeTab, setActiveTab] = useState('tips');
  const [completedTips, setCompletedTips] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [showMoreTips, setShowMoreTips] = useState(false);

  const healthTips = [
    { id: 1, text: "Practice 10 minutes of mindfulness meditation", category: "mindfulness", duration: "10 min" },
    { id: 2, text: "Take a 5-minute break every 25 minutes of study", category: "study", duration: "5 min" },
    { id: 3, text: "Get 7-8 hours of quality sleep tonight", category: "sleep", duration: "Night" },
    { id: 4, text: "Drink at least 8 glasses of water today", category: "hydration", duration: "Daily" },
    { id: 5, text: "Do 15 minutes of stretching or light exercise", category: "exercise", duration: "15 min" },
    { id: 6, text: "Write down 3 things you're grateful for", category: "mindfulness", duration: "5 min" },
    { id: 7, text: "Connect with a friend or family member", category: "social", duration: "15 min" },
    { id: 8, text: "Limit screen time 1 hour before bed", category: "sleep", duration: "Night" },
  ];

  const moodTrackers = [
    { id: 1, mood: "Happy", emoji: "😊", color: "bg-amber-100 text-amber-800", darkColor: "bg-amber-900/20 text-amber-200" },
    { id: 2, mood: "Stressed", emoji: "😫", color: "bg-red-100 text-red-800", darkColor: "bg-red-900/20 text-red-200" },
    { id: 3, mood: "Tired", emoji: "😴", color: "bg-blue-100 text-blue-800", darkColor: "bg-blue-900/20 text-blue-200" },
    { id: 4, mood: "Anxious", emoji: "😟", color: "bg-purple-100 text-purple-800", darkColor: "bg-purple-900/20 text-purple-200" },
    { id: 5, mood: "Focused", emoji: "🧠", color: "bg-emerald-100 text-emerald-800", darkColor: "bg-emerald-900/20 text-emerald-200" },
  ];

  const resources = [
    {
      title: "Coping with Exam Stress",
      description: "10 proven techniques to manage stress during exams",
      icon: <FiActivity className="w-5 h-5" />,
      category: "Study",
      color: "bg-blue-100 text-blue-600",
      darkColor: "bg-blue-900/30 text-blue-400"
    },
    {
      title: "Sleep Hygiene Guide",
      description: "Improve your sleep quality with these tips",
      icon: <FiMoon className="w-5 h-5" />,
      category: "Wellness",
      color: "bg-purple-100 text-purple-600",
      darkColor: "bg-purple-900/30 text-purple-400"
    },
    {
      title: "Counseling Services",
      description: "Connect with professional counselors",
      icon: <FiUsers className="w-5 h-5" />,
      category: "Support",
      color: "bg-emerald-100 text-emerald-600",
      darkColor: "bg-emerald-900/30 text-emerald-400"
    },
    {
      title: "Mindfulness Exercises",
      description: "Audio guides for relaxation and focus",
      icon: <FiSun className="w-5 h-5" />,
      category: "Mindfulness",
      color: "bg-amber-100 text-amber-600",
      darkColor: "bg-amber-900/30 text-amber-400"
    },
  ];

  const stats = [
    { name: "Wellness Streak", value: "5 days", icon: <FiAward className="w-5 h-5" />, trend: "up" },
    { name: "Mood Average", value: "7.2/10", icon: <FiBarChart2 className="w-5 h-5" />, trend: "neutral" },
    { name: "Tips Completed", value: `${completedTips.length}/${showMoreTips ? healthTips.length : 5}`, icon: <FiCheck className="w-5 h-5" />, trend: "up" },
  ];

  const toggleTipCompletion = (tipId) => {
    if (completedTips.includes(tipId)) {
      setCompletedTips(completedTips.filter(id => id !== tipId));
    } else {
      setCompletedTips([...completedTips, tipId]);
    }
  };

  const getIconForCategory = (category) => {
    switch(category) {
      case 'mindfulness': return <FiSun className="w-4 h-4" />;
      case 'sleep': return <FiMoon className="w-4 h-4" />;
      case 'hydration': return <FiCoffee className="w-4 h-4" />;
      case 'exercise': return <FiHeart className="w-4 h-4" />;
      case 'social': return <FiUsers className="w-4 h-4" />;
      default: return <FiActivity className="w-4 h-4" />;
    }
  };

  const handleSaveJournal = () => {
    if (journalEntry.trim() && selectedMood) {
      alert(`Journal saved!\nMood: ${selectedMood.mood}\nEntry: ${journalEntry}`);
      setJournalEntry('');
      setSelectedMood(null);
    }
  };

  const displayedTips = showMoreTips ? healthTips : healthTips.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-850 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <FiHeart className="mr-2 text-pink-500" />
            Wellness Center
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-xs">
            Daily Check-in
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center">
                <div className={`p-1.5 rounded-md mr-2 ${stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                  stat.trend === 'down' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-100 dark:border-gray-700">
        <nav className="-mb-px flex space-x-0 sm:space-x-8 overflow-x-auto px-4">
          <button
            onClick={() => setActiveTab('tips')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'tips'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiCheck className="mr-2" />
            Wellness Tips
          </button>
          <button
            onClick={() => setActiveTab('mood')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'mood'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiActivity className="mr-2" />
            Mood Tracker
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'resources'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiBook className="mr-2" />
            Resources
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Wellness Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Today's Wellness Plan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete your daily wellness routine</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                completedTips.length === displayedTips.length 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
              }`}>
                {completedTips.length}/{displayedTips.length} completed
              </span>
            </div>
            
            <div className="space-y-3">
              {displayedTips.map(tip => (
                <div 
                  key={tip.id}
                  onClick={() => toggleTipCompletion(tip.id)}
                  className={`p-4 rounded-lg border flex items-start cursor-pointer transition-all ${
                    completedTips.includes(tip.id)
                      ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-xs'
                  }`}
                >
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 mt-0.5 ${
                    completedTips.includes(tip.id)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {completedTips.includes(tip.id) && <FiCheck className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      completedTips.includes(tip.id)
                        ? 'text-green-800 dark:text-green-200 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {tip.text}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {getIconForCategory(tip.category)}
                        <span className="ml-1">{tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {tip.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!showMoreTips && healthTips.length > 5 && (
              <button 
                onClick={() => setShowMoreTips(true)}
                className="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center"
              >
                Show more tips ({healthTips.length - 5} remaining)
                <FiChevronRight className="ml-1" />
              </button>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/20">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                <FiZap className="mr-2 text-blue-600 dark:text-blue-400" />
                Quick Wellness Break
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Take a moment to breathe deeply. Inhale for 4 seconds, hold for 4, exhale for 6.
              </p>
              <button className="text-xs font-medium px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                Start Breathing Exercise
              </button>
            </div>
          </div>
        )}
        
        {/* Mood Tracker Tab */}
        {activeTab === 'mood' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">How are you feeling today?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select your current mood to track your emotional wellbeing</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {moodTrackers.map(tracker => (
                <button
                  key={tracker.id}
                  onClick={() => setSelectedMood(tracker)}
                  className={`p-4 rounded-lg flex flex-col items-center transition-all ${
                    selectedMood?.id === tracker.id 
                      ? 'ring-2 ring-blue-500 shadow-sm ' + tracker.color + ' dark:' + tracker.darkColor
                      : tracker.color + ' dark:' + tracker.darkColor
                  }`}
                >
                  <span className="text-3xl mb-2">{tracker.emoji}</span>
                  <span className="text-sm font-medium">{tracker.mood}</span>
                </button>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                  <FiBook className="mr-2 text-blue-600 dark:text-blue-400" />
                  Daily Reflection
                </h4>
                {selectedMood && (
                  <span className={`text-xs px-2 py-1 rounded-full ${selectedMood.color} dark:${selectedMood.darkColor}`}>
                    Feeling {selectedMood.mood.toLowerCase()}
                  </span>
                )}
              </div>
              
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write about your day, thoughts, or feelings..."
                className="w-full px-3 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              ></textarea>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FiClock className="mr-1" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <button 
                  onClick={handleSaveJournal}
                  disabled={!selectedMood || !journalEntry.trim()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedMood && journalEntry.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  Save Entry
                </button>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-100 dark:border-purple-900/20">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                <FiLayers className="mr-2 text-purple-600 dark:text-purple-400" />
                Mood Insights
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {selectedMood 
                  ? `You've been feeling ${selectedMood.mood.toLowerCase()} recently. ${selectedMood.mood === 'Happy' ? 'Keep up the great work!' : 'Consider trying some relaxation techniques.'}`
                  : "Track your mood regularly to see patterns and insights over time."}
              </p>
            </div>
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Wellness Resources</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tools and information to support your mental health</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, index) => (
                <div 
                  key={index}
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all bg-white dark:bg-gray-800 cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className={`p-2.5 rounded-lg mr-4 ${resource.color} dark:${resource.darkColor}`}>
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {resource.description}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {resource.category}
                        </span>
                        <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg p-5 border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg mr-4">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Need Immediate Help?</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    If you're in crisis or need someone to talk to, these resources are available 24/7.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm px-3 py-2 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                      Crisis Text Line: Text HOME to 741741
                    </button>
                    <button className="w-full text-left text-sm px-3 py-2 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                      National Suicide Prevention Lifeline: 988
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthComponent;