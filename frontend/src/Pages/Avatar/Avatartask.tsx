import React, { useState } from "react";

// Reusable SVG for lock icon
const LockIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white opacity-70"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clipRule="evenodd"
    />
  </svg>
);

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

// Reusable SVG for fire icon (streak) - Corrected path
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

const mainAvatarImageUrl =
  "https://i.pinimg.com/1200x/9d/7c/40/9d7c40e80f917dae1fa1e325e1e1fae4.jpg";

const newAvatarUrls = [
  "https://i.pinimg.com/736x/4a/cb/10/4acb1008048558922b51b136770cc5aa.jpg",
  "https://i.pinimg.com/736x/e7/c6/89/e7c689d41a93d8e89c840ddbc75f4904.jpg",
  "https://i.pinimg.com/736x/0f/4c/01/0f4c01e437c589ed1f1a60d0e1ca2b0c.jpg",
  "https://i.pinimg.com/736x/f1/7e/7d/f17e7d80e167f07a82461b0ed30f283f.jpg",
  "https://i.pinimg.com/1200x/8f/bd/e0/8fbde0bd4a18292d910262ef44259d9f.jpg",
  "https://i.pinimg.com/736x/c7/08/dd/c708dde07422fc32950faa7a822ec388.jpg",
  "https://i.pinimg.com/736x/9d/02/39/9d02399eb330e0976b46296fa598d087.jpg",
];

const avatars: AvatarItem[] = [
  { id: 1, image: mainAvatarImageUrl, locked: false }, // Selected: Sparky robot
  { id: 2, image: newAvatarUrls[0], locked: true },
  { id: 3, image: newAvatarUrls[1], locked: true },
  { id: 4, image: newAvatarUrls[2], locked: true },
  { id: 5, image: newAvatarUrls[3], locked: true },
  { id: 6, image: newAvatarUrls[4], locked: true },
  { id: 7, image: newAvatarUrls[5], locked: true },
  { id: 8, image: newAvatarUrls[6], locked: true },
  { id: 9, image: newAvatarUrls[0], locked: true }, // Cycling through the provided images
  { id: 10, image: newAvatarUrls[1], locked: true },
  { id: 11, image: newAvatarUrls[2], locked: true },
  { id: 12, image: newAvatarUrls[3], locked: true },
  { id: 13, image: newAvatarUrls[4], locked: true },
  { id: 14, image: newAvatarUrls[5], locked: true },
  { id: 15, image: newAvatarUrls[6], locked: true },
  { id: 16, image: newAvatarUrls[0], locked: true },
  { id: 17, image: newAvatarUrls[1], locked: true },
  { id: 18, image: newAvatarUrls[2], locked: true },
];

const Avatar: React.FC = () => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);

  const handleAvatarClick = (id: number, locked: boolean) => {
    if (!locked) {
      setSelectedAvatarId(id);
    }
  };

  const xpProgress = 230;
  const maxXP = 500;
  const energy = 78;

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 font-sans">
      {/* Top section: Main Avatar Display (Sparky) and Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Sparky Card (md:col-span-2) */}
        <div className="md:col-span-2 bg-gray-50 rounded-2xl relative overflow-hidden shadow-md">
          <img
            src={mainAvatarImageUrl}
            alt="Main Avatar Sparky"
            className="w-full h-auto object-cover rounded-2xl aspect-[16/9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 rounded-2xl"></div>
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold">Sparky</h1>
            <p className="text-lg sm:text-xl font-medium opacity-80">
              Level 4 Adventurer
            </p>
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
                className={`relative w-28 h-28 sm:w-32 sm:h-32 lg:w-32 lg:h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 ease-in-out
                  ${
                    selectedAvatarId === avatar.id
                      ? "border-4 border-green-500 shadow-lg"
                      : "border border-gray-200 hover:border-gray-300"
                  }
                  ${
                    avatar.locked
                      ? "cursor-not-allowed grayscale opacity-75"
                      : "cursor-pointer"
                  }`}
                onClick={() => handleAvatarClick(avatar.id, avatar.locked)}
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
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <LockIcon />
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
