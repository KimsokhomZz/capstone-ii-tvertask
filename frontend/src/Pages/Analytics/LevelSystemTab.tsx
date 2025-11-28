
export default function LevelSystemTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Level System</h2>
      <p className="text-sm text-gray-600 max-w-xl">
        See your current growth stage, benefits, and upcoming levels in your
        productivity journey.
      </p>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="h-12 w-12 rounded-full bg-[#FFF5D6] flex items-center justify-center text-xl">
            🌱
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">Sprout</p>
            <p className="text-xs text-gray-600">Growing Gardener</p>
            <p className="text-xs text-gray-500">
              Keeps developing good habits and consistency in your daily routine.
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-gray-700">Progress to Level 3</p>
              <div className="w-full max-w-md h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[17%] bg-[#4ADE80] rounded-full" />
              </div>
              <p className="text-[11px] text-gray-500">35 / 210 XP (more needed)</p>
            </div>
          </div>
        </div>
        <div className="text-right self-stretch flex flex-col items-end justify-between">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">level 2</p>
          <p className="text-sm font-semibold text-gray-900">193 XP</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Your Current Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Level Perks</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Streak tracking</li>
              <li>Basic mood tracking</li>
              <li>Avatar growth unlock</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Bonuses</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>+5% extra XP on completed tasks</li>
              <li>+1 daily streak protection</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Level Progression Path</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-[#FFF5D6] flex items-center justify-center text-lg">
                  🌱
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Level {level}: Seedling
                  </p>
                  <p className="text-xs text-gray-600">New Gardener</p>
                  <p className="mt-1 text-xs text-gray-500 max-w-md">
                    Welcome to Focus Garden! You're just starting your productivity journey.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-gray-600">
                    <span>XP: 30</span>
                    <span>Tasks: 10</span>
                    <button className="text-emerald-500 font-semibold">View Benefits</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
