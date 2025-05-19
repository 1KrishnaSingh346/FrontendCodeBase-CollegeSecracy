import { useState } from 'react';
import { FiRefreshCw, FiBookmark, FiShare2 } from 'react-icons/fi';

const QuoteComponent = () => {
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const quotes = [
    {
      text: "Success is the sum of small efforts, repeated day in and day out.",
      author: "Robert Collier",
      category: "Motivation"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
      category: "Perseverance"
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
      category: "Action"
    },
    {
      text: "You don't have to be great to start, but you have to start to be great.",
      author: "Zig Ziglar",
      category: "Beginnings"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      category: "Belief"
    },
    {
      text: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
      category: "Achievement"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Passion"
    },
  ];

  const getRandomQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex && quotes.length > 1);
    setCurrentQuoteIndex(newIndex);
  };

  const toggleSaveQuote = () => {
    const currentQuote = quotes[currentQuoteIndex];
    if (savedQuotes.some(q => q.text === currentQuote.text)) {
      setSavedQuotes(savedQuotes.filter(q => q.text !== currentQuote.text));
    } else {
      setSavedQuotes([...savedQuotes, currentQuote]);
    }
  };

  const isCurrentQuoteSaved = savedQuotes.some(
    q => q.text === quotes[currentQuoteIndex].text
  );

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
            {quotes[currentQuoteIndex].category}
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={toggleSaveQuote}
              className={`p-2 rounded-full ${isCurrentQuoteSaved ? 'text-yellow-300' : 'text-white/70 hover:text-white'}`}
            >
              <FiBookmark className={`${isCurrentQuoteSaved ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-full text-white/70 hover:text-white">
              <FiShare2 />
            </button>
          </div>
        </div>
        
        <blockquote className="text-lg italic mb-4">
          "{quotes[currentQuoteIndex].text}"
        </blockquote>
        <p className="text-right text-white/90">
          — {quotes[currentQuoteIndex].author}
        </p>
        
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={getRandomQuote}
            className="flex items-center text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            New Quote
          </button>
          
          {savedQuotes.length > 0 && (
            <div className="text-sm">
              <span className="mr-1">Saved:</span>
              <span className="font-medium">{savedQuotes.length}</span>
            </div>
          )}
        </div>
      </div>
      
      {savedQuotes.length > 0 && (
        <div className="bg-white/10 p-4">
          <h4 className="text-xs uppercase tracking-wider text-white/70 mb-2">Your Saved Quotes</h4>
          <div className="space-y-2">
            {savedQuotes.map((quote, index) => (
              <div 
                key={index}
                className="bg-white/10 p-3 rounded-lg border border-white/10"
              >
                <p className="text-sm italic">"{quote.text}"</p>
                <p className="text-xs text-right text-white/70 mt-1">— {quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteComponent;