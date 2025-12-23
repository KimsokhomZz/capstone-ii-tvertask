import { motion, AnimatePresence } from "framer-motion";
import TaskForm from "@/components/TaskForm";

export default function CreateTaskModal({
  show,
  onClose,
  onSubmit,
}: //   user,
//   showToast,
//   setTasks,
//   createTask,
any) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div
            className="relative bg-white dark:bg-[#1d2942] rounded-2xl shadow-2xl border border-gray-100 dark:border-transparent w-full max-w-lg p-6"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Task
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-600/10 rounded-md px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <TaskForm onSubmit={onSubmit} onCancel={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
