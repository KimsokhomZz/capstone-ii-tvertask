type Props = {
  open: boolean;
  xpAmount?: number;
  title?: string;
  description?: string;
  onClaim: () => Promise<void> | void;
  onClose: () => void;
};

export default function ClaimXpModal({
  open,
  xpAmount = 20,
  title = "Session complete",
  description = "Great work — claim your XP reward for completing this Pomodoro.",
  onClaim,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/40 animate-fadeIn"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-[90%] max-w-lg bg-white rounded-xl p-6 shadow-xl border border-gray-100 animate-bounce-in">
        <div className="flex items-start justify-between mb-3 animate-slide-down">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 animate-pulse-slow">
              🎉 {title} 🎉
            </h3>
            <p className="text-[16px] text-gray-600 my-8 animate-fade-in-delay">
              {description}
            </p>
          </div>
          <div className="text-yellow-500 text-3xl animate-wiggle">✨</div>
        </div>

        <div className="mt-4 flex gap-3 animate-slide-up">
          <button
            onClick={async () => {
              try {
                await onClaim();
              } catch (e) {
                console.warn("Claim handler threw:", e);
              }
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-white rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 hover:scale-110 hover:shadow-xl transform transition-all duration-300 font-bold animate-pulse-glow"
          >
            🏆 Claim {xpAmount} XP 🏆
          </button>

          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow-sm hover:bg-gray-200 hover:scale-105 hover:rotate-1 transform transition-all duration-300 font-medium"
          >
            ⏰ Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
