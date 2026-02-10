
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from './components/FloatingHearts';
import { AppState } from './types';
import { generateLoveNote } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.PROPOSING);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [aiNote, setAiNote] = useState<string>("");
  const [loadingNote, setLoadingNote] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Track attempts to click NO
  const [noCount, setNoCount] = useState(0);

  const handleYes = async () => {
    setState(AppState.ACCEPTED);
    setLoadingNote(true);
    const note = await generateLoveNote("Why they are my favorite person");
    setAiNote(note);
    setLoadingNote(false);
  };

  const moveNoButton = useCallback(() => {
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 300;
    setNoButtonPos({ x, y });
    setNoCount(prev => prev + 1);
    
    // Increase YES size, decrease NO size
    setYesScale(prev => Math.min(prev + 0.15, 3));
    setNoScale(prev => Math.max(prev - 0.1, 0.3));
  }, []);

  const getNoButtonText = () => {
    const texts = [
      "No 💔",
      "Are you sure? 🥺",
      "Think again! 🧐",
      "Last chance! 😭",
      "You're clicking the wrong one! 👉",
      "Wait, what?! 😱",
      "Really? 😿",
      "Give it another thought! ✨",
      "Maybe yes? 🌹",
      "I'll be sad... 😞"
    ];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFF5F7] flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-pink-200">
      <FloatingHearts />
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-pink-50/50 to-transparent pointer-events-none" />
      
      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {state === AppState.PROPOSING ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-8"
            >
              {/* Cute Character Placeholder */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-4 drop-shadow-xl"
              >
                🧸
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-[#FF4D6D] drop-shadow-sm">
                Will you be my <br />
                <span className="text-pink-500 italic">Valentine?</span>
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 min-h-[200px]">
                {/* YES BUTTON */}
                <motion.button
                  onClick={handleYes}
                  style={{ scale: yesScale }}
                  whileHover={{ scale: yesScale + 0.1 }}
                  whileTap={{ scale: yesScale - 0.1 }}
                  className="px-10 py-4 bg-[#FF4D6D] text-white rounded-full text-2xl font-bold shadow-[0_8px_0_rgb(200,60,90)] hover:shadow-[0_4px_0_rgb(200,60,90)] hover:translate-y-[4px] transition-all duration-75 active:shadow-none active:translate-y-[8px] z-20"
                >
                  YES! ❤️
                </motion.button>

                {/* NO BUTTON */}
                <motion.button
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  animate={{ 
                    x: noButtonPos.x, 
                    y: noButtonPos.y,
                    scale: noScale
                  }}
                  className="px-8 py-4 bg-white text-gray-500 border-2 border-gray-100 rounded-full text-xl font-semibold shadow-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {getNoButtonText()}
                </motion.button>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-pink-400 font-medium mt-4"
              >
                I've been waiting for this moment... ✨
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-2xl border-4 border-pink-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="text-9xl mb-4"
              >
                🎉💖
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#FF4D6D]">
                YAY! You said YES!
              </h2>
              
              <p className="text-xl text-pink-600 font-medium max-w-md mx-auto">
                You just made my heart the happiest in the whole world! 🌍❤️
              </p>

              <div className="mt-8 p-6 bg-pink-50 rounded-2xl border-2 border-dashed border-pink-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-pink-200" />
                <h3 className="text-sm uppercase tracking-widest text-pink-400 font-bold mb-3">A Note For You</h3>
                
                {loadingNote ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                    <span className="text-pink-400 text-sm italic">Writing something special...</span>
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg md:text-xl text-pink-800 italic font-medium leading-relaxed"
                  >
                    "{aiNote}"
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="mt-6 text-pink-400 text-sm hover:underline font-bold"
              >
                Ask again? (Just for the vibes) 🔄
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Extra Interactions */}
      <footer className="fixed bottom-6 left-0 w-full flex justify-center gap-4 z-20">
        <motion.div
          className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg flex items-center gap-2 border border-pink-100"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
        >
          <button 
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"
          >
            {isMusicPlaying ? '🔊' : '🔇'}
          </button>
          <span className="text-xs font-bold text-pink-500 pr-4">LO-FI ROMANCE RADIO</span>
        </motion.div>
      </footer>

      {/* Confetti-like Hearts on Success */}
      {state === AppState.ACCEPTED && (
        <div className="fixed inset-0 pointer-events-none z-50">
           {Array.from({ length: 40 }).map((_, i) => (
             <motion.div
               key={i}
               initial={{ 
                 top: '50%', 
                 left: '50%', 
                 opacity: 1, 
                 scale: 0 
               }}
               animate={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`, 
                 opacity: 0,
                 scale: Math.random() * 1.5 + 0.5,
                 rotate: Math.random() * 360
               }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="absolute text-3xl"
             >
               {['❤️', '💖', '💝', '💕', '✨'][Math.floor(Math.random() * 5)]}
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
};

export default App;
