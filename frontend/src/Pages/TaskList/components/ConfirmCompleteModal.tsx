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
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h3 className="text-lg font-semibold mb-4">Complete Task?</h3>
            <p className="mb-6 text-gray-700">
              Are you sure? Completing this task will award XP and cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-400 text-white font-semibold hover:bg-yellow-500"
                onClick={onConfirm}
              >
                Complete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
