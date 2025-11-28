import React, { useState } from "react";

// Reusable SVG for checkmark icon
const CheckmarkIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-white"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Reusable SVG for fire icon (streak)
const FireIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-white"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12 1.58c-2.43 0-4.4 1.97-4.4 4.4 0 1.63.88 3.06 2.19 3.84L12 22.5l4.21-12.68c1.31-.78 2.19-2.21 2.19-3.84 0-2.43-1.97-4.4-4.4-4.4zm0 2.2c1.21 0 2.2 1.11 2.2 2.47S13.21 8.72 12 8.72 9.8 7.61 9.8 6.24 10.79 3.78 12 3.78z"
      clipRule="evenodd"
    />
  </svg>
);

interface AvatarItem {
  id: number;
  image: string;
  locked: boolean;
}

// User-provided new image URLs
const userProvidedImages = [
  "https://i.pinimg.com/736x/52/33/97/5233974dd3669971eb3c2e177ec6d209.jpg",
  "https://i.pinimg.com/736x/de/4b/62/de4b62bca6855837a0341da6af7f4cb5.jpg",
  "https://i.pinimg.com/1200x/01/1f/08/011f0877c32df9f4402146f9205e4ba5.jpg",
  "https://i.pinimg.com/736x/20/b9/2d/20b92d0cf87f5f88418d075f8fd4c506.jpg",
];

// Initial set of avatars, using the new images and unlocking the first 5
const initialAvatars: AvatarItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  image: userProvidedImages[i % userProvidedImages.length], // Cycle through the 4 provided images
  locked: i >= 5, // Unlock avatars with ID 1 to 5 (0-indexed 0-4)
}));

const Avatar: React.FC = () => {
  const [avatars] = useState<AvatarItem[]>(initialAvatars);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);
  const [mainDisplayAvatar, setMainDisplayAvatar] = useState<string>(
    avatars[0].image
  ); // Initialize with the first avatar's image

  const handleAvatarClick = (
    id: number,
    clickedImage: string,
    locked: boolean
  ) => {
    if (!locked) {
      setSelectedAvatarId(id);
      setMainDisplayAvatar(clickedImage);
    }
  };

  const xpProgress = 230;
  const maxXP = 500;
  const energy = 78;

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 font-sans">
      {/* Top section: Main Avatar Display and Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Main Display Avatar Card (md:col-span-2) */}
        <div className="md:col-span-2 bg-gray-50 rounded-2xl relative overflow-hidden shadow-md">
          <img
            src={mainDisplayAvatar} // Use the dynamic mainDisplayAvatar state
            alt="Main Avatar"
            className="w-full h-auto object-cover rounded-2xl aspect-[16/9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 rounded-2xl"></div>
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold">Sparky</h1>{" "}
            {/* Kept static as requested */}
            <p className="text-lg sm:text-xl font-medium opacity-80">
              Level 4 Adventurer
            </p>{" "}
            {/* Kept static as requested */}
          </div>
          <div className="absolute bottom-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
            <FireIcon />
            <span>5 Day Streak</span>
          </div>
        </div>

        {/* Recent Activities (md:col-span-1) */}
        <div className="md:col-span-1 bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Recent Activities
          </h2>
          <ul className="space-y-4">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-gray-700 text-base"
              >
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full flex-shrink-0 mt-2"></span>
                <div>
                  <p>You completed 3 tasks today !</p>
                  <p className="text-sm text-gray-500">just now</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom section: Avatar Grid and Progress Bars (Full width) */}
      <div className="space-y-8 md:space-y-10">
        {/* Avatar Grid */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Avatar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 lg:w-32 lg:h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 ease-in-out ${
                  selectedAvatarId === avatar.id
                    ? "border-4 border-green-500 shadow-lg"
                    : "border border-gray-200 hover:border-gray-300"
                } ${
                  avatar.locked
                    ? "cursor-not-allowed grayscale opacity-75"
                    : "cursor-pointer"
                }`}
                onClick={() =>
                  handleAvatarClick(avatar.id, avatar.image, avatar.locked)
                }
                role="button"
                aria-pressed={selectedAvatarId === avatar.id}
                aria-label={`Select avatar ${avatar.id}`}
              >
                <img
                  src={avatar.image}
                  alt={`Avatar ${avatar.id}`}
                  className="w-full h-full object-cover"
                />
                {avatar.locked && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-xl">
                    {" "}
                    {/* Changed opacity to 30% */}
                    <i className="fa-solid fa-lock text-white text-3xl opacity-90"></i>{" "}
                    {/* Font Awesome lock icon */}
                  </div>
                )}
                {selectedAvatarId === avatar.id && !avatar.locked && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-md">
                    <CheckmarkIcon />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="xp-progress"
                className="text-base font-medium text-gray-700"
              >
                XP Progress
              </label>
              <span className="text-sm font-medium text-gray-600">
                {xpProgress} / {maxXP}
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2.5"
              role="progressbar"
              aria-valuenow={xpProgress}
              aria-valuemin={0}
              aria-valuemax={maxXP}
              aria-label="XP Progress"
            >
              <div
                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(xpProgress / maxXP) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="energy-progress"
                className="text-base font-medium text-gray-700"
              >
                Energy
              </label>
              <span className="text-sm font-medium text-gray-600">
                {energy}%
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2.5"
              role="progressbar"
              aria-valuenow={energy}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Energy level"
            >
              <div
                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${energy}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
