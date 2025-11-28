import { useState } from "react";
// @ts-ignore
import { useAuth } from "../../context/AuthContext.jsx";

interface EditProfileProps {
  user: any;
  onUpdate: () => void;
}

const EditProfile = ({ user, onUpdate }: EditProfileProps) => {
  const { refreshUserData } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        onUpdate();

        // Refresh user data in AuthContext to keep state synced
        const refreshResult = await refreshUserData();
        if (!refreshResult.success) {
          console.warn(
            "Failed to refresh user data in AuthContext:",
            refreshResult.error
          );
          // Still update localStorage as fallback
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, ...formData })
          );
        }
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-md ${
            message.includes("successfully")
              ? "bg-green-50 text-green-800 border-2 border-green-300"
              : "bg-red-50 text-red-800 border-2 border-red-300"
          }`}
        >
          <p className="font-medium text-base">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="City, Country"
            />
          </div>

          <div></div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <p className="mt-2 text-sm text-gray-500 font-medium text-right">
            {formData.bio.length}/500 characters
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: user?.name || "",
                email: user?.email || "",
                bio: user?.bio || "",
                location: user?.location || "",
              });
              setMessage("");
            }}
            className="px-6 py-2.5 text-base font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-200 transition-all"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 text-base font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
