import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmCompleteModal({
  show,
  onCancel,
  onConfirm,
}: {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Decorative gradient header */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400" />

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">
                Complete Task?
              </h3>

              {/* Description */}
              <p className="text-center text-gray-600 mb-8 leading-relaxed">
                Completing this task will award you XP and mark it as done. This
                action cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 active:scale-95 transition-all duration-150"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold hover:from-yellow-500 hover:to-amber-600 active:scale-95 transition-all duration-150 shadow-lg shadow-yellow-500/30"
                  onClick={onConfirm}
                >
                  Complete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
