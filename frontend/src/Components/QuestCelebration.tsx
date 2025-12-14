import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Trophy, Sparkles } from "lucide-react";

interface QuestCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  questName: string;
  xpAwarded: number;
}

const QuestCelebration: React.FC<QuestCelebrationProps> = ({
  isOpen,
  onClose,
  questName,
  xpAwarded,
}) => {
  const { width, height } = useWindowSize();
  const DURATION = 3000;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll and hide overflow when popup is open
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        onClose();
      }, DURATION);

      return () => {
        clearTimeout(timer);
        // Restore body scroll when popup closes
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-hidden"
          />

          {/* Celebration Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] sm:w-auto max-w-[500px] px-4"
          >
            <div className="bg-linear-to-br from-yellow-50 via-orange-50 to-red-50 border-4 border-yellow-400 rounded-3xl shadow-2xl p-6 sm:p-10 w-full sm:min-w-[400px] relative overflow-hidden">
              {/* Animated sparkles */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-yellow-400"
              >
                <Sparkles size={24} className="sm:w-8 sm:h-8" />
              </motion.div>

              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-orange-400"
              >
                <Sparkles size={24} className="sm:w-8 sm:h-8" />
              </motion.div>

              {/* Content */}
              <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                {/* Trophy animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    delay: 0.2,
                    duration: 0.8,
                  }}
                >
                  <div className="bg-linear-to-br from-yellow-400 to-orange-500 p-4 sm:p-6 rounded-full shadow-lg">
                    <Trophy size={48} className="sm:w-16 sm:h-16 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 sm:space-y-3"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-orange-600">
                    Quest Completed! 🎉
                  </h2>
                  <p className="text-lg sm:text-xl font-semibold text-gray-700 break-words px-2">
                    {questName}
                  </p>
                </motion.div>

                {/* XP Award */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 sm:px-8 sm:py-4 border-2 border-yellow-300 shadow-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-yellow-600">
                      +{xpAwarded}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold text-gray-700">
                      XP
                    </span>
                  </div>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  className="w-full h-2 bg-yellow-200 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    className="h-full bg-linear-to-r from-yellow-400 to-orange-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: DURATION / 1000, ease: "linear" }}
                  />
                </motion.div>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-base sm:text-lg text-gray-600 font-medium px-2"
                >
                  ✨ Keep up the amazing work! ✨
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuestCelebration;
