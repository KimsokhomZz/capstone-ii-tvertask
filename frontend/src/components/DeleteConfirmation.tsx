import ConfirmDialog from "@/Components/ConfirmDialog";

type DeleteConfirmationProps = {
  isOpen: boolean;
  taskName: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteConfirmation({ isOpen, taskName, onConfirm, onClose }: DeleteConfirmationProps) {
  return (
    <ConfirmDialog isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete <span className="font-medium">"{taskName}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-yellow-50 text-gray-800 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-100 text-black cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </ConfirmDialog>
  );
}