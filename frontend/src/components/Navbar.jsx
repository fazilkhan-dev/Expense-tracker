import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [time, setTime] = useState(new Date());

  const subtitles = [
    "Track Every Expense",
    "Manage Your Income",
    "Analyze Your Spending",
    "Save Smarter Every Month",
  ];

  const quotes = [
    "A budget tells your money where to go.",
    "Small savings today, big freedom tomorrow.",
    "Know your numbers, own your future.",
    "Every rupee saved is a rupee earned.",
  ];

  const [index, setIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const clock = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const slider = setInterval(() => {
      setIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);

    const quoteSlider = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);

    return () => {
      clearInterval(clock);
      clearInterval(slider);
      clearInterval(quoteSlider);
    };
  }, []);

  return (
    <div className="hero">
      <h1>Expense Tracker</h1>

      <p>{subtitles[index]}</p>

      <div className="hero-date">
        {time.toLocaleDateString()} • {time.toLocaleTimeString()}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          className="hero-quote"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5 }}
        >
          {quotes[quoteIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Navbar;