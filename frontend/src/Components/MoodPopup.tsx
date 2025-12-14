import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MoodPopupProps {
  isOpen: boolean;
  onClose: () => void;
  emoji: string;
  label: string;
}

const MoodPopup: React.FC<MoodPopupProps> = ({
  isOpen,
  onClose,
  emoji,
  label,
}) => {
  const DURATION = 1500;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, DURATION);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Popup Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-3xl shadow-2xl p-8 min-w-[320px] relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-purple-200/50 transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-purple-600" />
              </button>

              {/* Content */}
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Animated Emoji */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    delay: 0.2,
                    duration: 0.6,
                  }}
                  className="text-7xl"
                >
                  {emoji}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h3 className="text-2xl font-bold text-purple-700">
                    Mood Updated!
                  </h3>
                  <p className="text-gray-600">
                    You're feeling{" "}
                    <span className="font-bold text-purple-600">{label}</span>{" "}
                    today
                  </p>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  className="w-full h-1 bg-purple-200 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: DURATION / 1000, ease: "linear" }}
                  />
                </motion.div>

                {/* Sparkles effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-purple-400"
                >
                  ✨ Keep up the great vibes! ✨
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoodPopup;
