import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

const AvatarUploadModal = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}: AvatarUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Helper function to get the correct avatar URL
  const getAvatarUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) return "/default-avatar.svg";
    if (avatarUrl.startsWith("http")) return avatarUrl;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${baseUrl}${avatarUrl}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage("Please select a valid image file (JPG, PNG, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile picture updated successfully!");
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          avatarUrl: data.data.avatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        onUpdate(); // Refresh parent state

        setTimeout(() => {
          handleClose();
          window.location.reload(); // Reload to ensure all components update
        }, 1000);
      } else {
        setMessage(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/avatar`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile picture removed successfully!");
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            avatarUrl: null,
          })
        );
        onUpdate();
        setTimeout(() => {
          handleClose();
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.message || "Failed to remove profile picture");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Update Profile Picture
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {!preview ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <img
                    src={getAvatarUrl(user.avatarUrl)}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.svg";
                    }}
                  />
                  {user.avatarUrl && (
                    <button
                      onClick={handleRemove}
                      disabled={isLoading}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload new picture
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP (Max 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-900">
                  {selectedFile?.name}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Uploading..." : "Save Change"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;
