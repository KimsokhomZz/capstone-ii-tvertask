import ConfirmDialog from "@/components/ConfirmDialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type DeleteConfirmationProps = {
  isOpen: boolean;
  taskName: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteConfirmation({
  isOpen,
  taskName,
  onConfirm,
  onClose,
}: DeleteConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ConfirmDialog
          isOpen={isOpen}
          onClose={onClose}
          title="Confirm Deletion"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-gray-800 font-medium mb-1">
                  Delete "{taskName}"?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. The task will be permanently
                  removed.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex justify-end gap-3"
            >
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
            </motion.div>
          </motion.div>
        </ConfirmDialog>
      )}
    </AnimatePresence>
  );
}
