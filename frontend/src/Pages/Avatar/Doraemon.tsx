import React, { useEffect, useState, useRef } from "react";

export enum FaceState {
  IDLE = "IDLE",
  HAPPY = "HAPPY",
  SHOCK = "SHOCK",
  EAT = "EAT",
  ANGRY = "ANGRY",
  SLEEP = "SLEEP",
}

interface DoraemonProps {
  showControls?: boolean;
}

const Doraemon: React.FC<DoraemonProps> = ({ showControls = true }) => {
  const [faceState, setFaceState] = useState<FaceState>(FaceState.IDLE);
  const [hasCopter, setHasCopter] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);

  // Dragging State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Automatically reset face state to idle after reaction animations
  useEffect(() => {
    if (faceState !== FaceState.IDLE && faceState !== FaceState.SLEEP) {
      const timer = setTimeout(() => setFaceState(FaceState.IDLE), 2500);
      return () => clearTimeout(timer);
    }
  }, [faceState]);

  // Reset position when flying stops
  useEffect(() => {
    if (!isFlying) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isFlying]);

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isFlying) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const toggleCopter = () => {
    const newState = !hasCopter;
    setHasCopter(newState);
    if (!newState) setIsFlying(false); // Can't fly without copter
  };

  const toggleFly = () => {
    if (!hasCopter) return;
    setIsFlying(!isFlying);
  };

  const toggleInvisible = () => {
    setIsInvisible(!isInvisible);
  };

  const triggerFace = (state: FaceState) => {
    setFaceState(state);
  };

  const isEating = faceState === FaceState.EAT;
  const isShocked = faceState === FaceState.SHOCK;
  const isHappy = faceState === FaceState.HAPPY;
  const isAngry = faceState === FaceState.ANGRY;
  const isSleeping = faceState === FaceState.SLEEP;

  // Message Logic
  let message = null;
  if (isAngry) message = "KDM Ah Thai";
  else if (isSleeping) message = "Dek hx all nop";
  else if (isEating) message = "C ey kor ch'nganh dal";
  else if (isFlying) message = "Dak nhom jos lern";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Animation Stage */}
      {/* Wrapper for Drag Translation */}
      <div
        onPointerDown={handlePointerDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isFlying ? (isDragging ? "grabbing" : "grab") : "default",
          touchAction: "none",
          // Smooth transition only when NOT dragging to avoid lag
          transition: isDragging
            ? "none"
            : "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className={`relative z-20 ${showControls ? "mb-8" : ""}`}
      >
        {/* Inner Wrapper for Float Animation and Opacity */}
        <div
          className={`relative w-72 h-72 md:w-80 md:h-80 mx-auto transition-all duration-1000 ease-in-out ${
            isFlying ? "animate-float" : ""
          } ${isInvisible ? "opacity-20 blur-[1px]" : "opacity-100"}`}
        >
          <style>{`
            @keyframes float-fly {
                0%, 100% { transform: translateY(0px) rotate(5deg); }
                50% { transform: translateY(-30px) rotate(-5deg); }
            }
            @keyframes blade-spin {
                0% { transform: scaleX(1); }
                50% { transform: scaleX(0.1); }
                100% { transform: scaleX(1); }
            }
            @keyframes blink {
                0%, 96%, 100% { transform: scaleY(1); }
                98% { transform: scaleY(0.1); }
            }
            @keyframes chew {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.8); }
            }
            @keyframes bell-ring {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(15deg); }
                75% { transform: rotate(-15deg); }
            }
            @keyframes snot-bubble {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(1); opacity: 0.6; }
            }
            @keyframes steam-rise {
                0% { transform: translateY(0) scale(1); opacity: 0.8; }
                100% { transform: translateY(-30px) scale(2); opacity: 0; }
            }
            .animate-float { animation: float-fly 2s infinite ease-in-out; }
            .animate-blade { animation: blade-spin 0.08s infinite linear; transform-box: fill-box; transform-origin: center; }
            .animate-blink { animation: blink 4s infinite; transform-box: fill-box; transform-origin: center; }
            .animate-chew { animation: chew 0.4s infinite; transform-box: fill-box; transform-origin: center; }
            .animate-bell { animation: bell-ring 1s infinite; transform-origin: 150px 255px; }
            .animate-snot { animation: snot-bubble 2s infinite ease-in-out; transform-origin: 150px 155px; }
            .animate-steam { animation: steam-rise 1s infinite linear; }
            `}</style>

          {/* Speech Bubble */}
          {message && (
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce whitespace-nowrap pointer-events-none">
              <div className="bg-white border-4 border-black px-5 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <span
                  className={`text-lg font-black tracking-wide ${
                    isAngry ? "text-red-600" : "text-black"
                  }`}
                >
                  {message}
                </span>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-black rotate-45"></div>
              </div>
            </div>
          )}

          {isAngry && (
            <div className="absolute top-0 right-10 z-20">
              <div className="text-4xl animate-steam absolute">💢</div>
              <div
                className="text-4xl animate-steam absolute"
                style={{ animationDelay: "0.3s", left: "20px" }}
              >
                💢
              </div>
            </div>
          )}

          <svg
            viewBox="0 0 300 320"
            className="w-full h-full drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* --- BAMBOO COPTER (Take-copter) --- */}
            <g
              className={`transition-all duration-500 ${
                hasCopter
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-10"
              }`}
              style={{ transformOrigin: "bottom center" }}
            >
              {/* Shaft */}
              <rect
                x="146"
                y="15"
                width="8"
                height="35"
                fill="#F5DEB3"
                stroke="#000"
                strokeWidth="2"
              />
              <path
                d="M 135,45 L 165,45 L 160,55 L 140,55 Z"
                fill="#F5DEB3"
                stroke="#000"
                strokeWidth="2"
              />

              {/* Blades */}
              <ellipse
                cx="150"
                cy="15"
                rx="80"
                ry="6"
                fill="#FFD700"
                stroke="#000"
                strokeWidth="2"
                className={hasCopter ? "animate-blade" : ""}
              />
            </g>

            {/* --- HEAD BASE --- */}
            {/* Blue Head */}
            <circle
              cx="150"
              cy="160"
              r="100"
              fill="#0095D9"
              stroke="#000"
              strokeWidth="3"
            />

            {/* White Face Area */}
            <circle
              cx="150"
              cy="175"
              r="85"
              fill="#FFF"
              stroke="#000"
              strokeWidth="3"
            />

            {/* --- EYES --- */}
            <g
              className={
                isShocked || isSleeping || isAngry ? "" : "animate-blink"
              }
            >
              {/* Left Eye */}
              <ellipse
                cx="120"
                cy="115"
                rx="25"
                ry="30"
                fill="#FFF"
                stroke="#000"
                strokeWidth="3"
              />
              {/* Right Eye */}
              <ellipse
                cx="180"
                cy="115"
                rx="25"
                ry="30"
                fill="#FFF"
                stroke="#000"
                strokeWidth="3"
              />

              {isShocked ? (
                // Shocked Pupils (Small dots)
                <>
                  <circle cx="120" cy="115" r="3" fill="#000" />
                  <circle cx="180" cy="115" r="3" fill="#000" />
                  {/* Sweat drops */}
                  <path
                    d="M 230,130 Q 240,130 235,145 Q 230,130 230,130"
                    fill="#00F"
                    opacity="0.6"
                  />
                </>
              ) : isHappy ? (
                // Happy Arches
                <>
                  <path
                    d="M 105,115 Q 120,105 135,115"
                    fill="none"
                    stroke="#000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 165,115 Q 180,105 195,115"
                    fill="none"
                    stroke="#000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </>
              ) : isEating ? (
                // Closed content eyes
                <>
                  <path
                    d="M 110,120 L 130,120"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 170,120 L 190,120"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              ) : isSleeping ? (
                // Sleeping Eyes (U shape inverted or simple lines)
                <>
                  <path
                    d="M 110,120 Q 120,130 130,120"
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 170,120 Q 180,130 190,120"
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              ) : isAngry ? (
                // Angry Eyes (Slanted lines)
                <>
                  <line
                    x1="105"
                    y1="105"
                    x2="135"
                    y2="120"
                    stroke="#000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="195"
                    y1="105"
                    x2="165"
                    y2="120"
                    stroke="#000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="120" cy="125" r="4" fill="#000" />
                  <circle cx="180" cy="125" r="4" fill="#000" />
                </>
              ) : (
                // Normal Pupils
                <>
                  <circle cx="128" cy="120" r="6" fill="#000" />
                  <circle cx="172" cy="120" r="6" fill="#000" />
                </>
              )}
            </g>

            {/* --- NOSE --- */}
            <circle
              cx="150"
              cy="155"
              r="12"
              fill="#D90000"
              stroke="#000"
              strokeWidth="3"
            />
            <circle cx="146" cy="151" r="4" fill="#FFF" opacity="0.6" />

            {/* Sleeping Snot Bubble */}
            {isSleeping && (
              <circle
                cx="160"
                cy="160"
                r="15"
                fill="rgba(173, 216, 230, 0.5)"
                stroke="#50E0FF"
                strokeWidth="1"
                className="animate-snot"
              />
            )}

            {/* Philtrum */}
            <line
              x1="150"
              y1="167"
              x2="150"
              y2="215"
              stroke="#000"
              strokeWidth="3"
            />

            {/* --- WHISKERS --- */}
            <g stroke="#000" strokeWidth="2">
              {/* Left */}
              <line x1="80" y1="160" x2="130" y2="170" />
              <line x1="75" y1="180" x2="130" y2="180" />
              <line x1="80" y1="200" x2="130" y2="190" />
              {/* Right */}
              <line x1="220" y1="160" x2="170" y2="170" />
              <line x1="225" y1="180" x2="170" y2="180" />
              <line x1="220" y1="200" x2="170" y2="190" />
            </g>

            {/* --- MOUTH --- */}
            <g className="transition-all duration-300">
              {isShocked ? (
                <ellipse
                  cx="150"
                  cy="220"
                  rx="20"
                  ry="25"
                  fill="#A00"
                  stroke="#000"
                  strokeWidth="3"
                />
              ) : isEating ? (
                <g className="animate-chew">
                  <path
                    d="M 120,215 Q 150,245 180,215"
                    fill="#A00"
                    stroke="#000"
                    strokeWidth="3"
                  />
                  {/* Dorayaki */}
                  <path
                    d="M 130,225 Q 150,210 170,225 Q 170,245 150,245 Q 130,245 130,225"
                    fill="#CD853F"
                    stroke="#8B4513"
                    strokeWidth="2"
                  />
                </g>
              ) : isHappy ? (
                <path
                  d="M 90,195 Q 150,260 210,195"
                  fill="#A00"
                  stroke="#000"
                  strokeWidth="3"
                />
              ) : isAngry ? (
                <path
                  d="M 110,225 Q 150,205 190,225"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                />
              ) : isSleeping ? (
                <circle
                  cx="150"
                  cy="220"
                  r="5"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                />
              ) : (
                // Normal Smile
                <path
                  d="M 100,215 Q 150,250 200,215"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* --- COLLAR & BELL --- */}
            <rect
              x="90"
              y="245"
              width="120"
              height="15"
              rx="8"
              fill="#D90000"
              stroke="#000"
              strokeWidth="3"
            />
            <g className={isFlying ? "animate-bell" : ""}>
              <circle
                cx="150"
                cy="260"
                r="15"
                fill="#F8E71C"
                stroke="#000"
                strokeWidth="3"
              />
              <line
                x1="140"
                y1="256"
                x2="160"
                y2="256"
                stroke="#000"
                strokeWidth="2"
              />
              <line
                x1="140"
                y1="259"
                x2="160"
                y2="259"
                stroke="#000"
                strokeWidth="2"
              />
              <circle cx="150" cy="268" r="4" fill="#000" />
              <line
                x1="150"
                y1="272"
                x2="150"
                y2="275"
                stroke="#000"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Single Row Controls */}
      {showControls && (
        <div className="flex flex-row flex-nowrap gap-3 w-full max-w-full overflow-x-auto p-4 z-50 items-center justify-start md:justify-center no-scrollbar">
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* GADGETS */}
          <button
            onClick={toggleCopter}
            className={`flex-shrink-0 p-3 border-2 border-black transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]
              ${hasCopter ? "bg-yellow-400" : "bg-white hover:bg-yellow-50"}`}
          >
            <i
              className={`fa-solid fa-fan text-3xl ${
                hasCopter ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "2s" }}
            ></i>
            <span className="text-xs font-bold mt-1">Copter</span>
          </button>

          <button
            onClick={toggleFly}
            disabled={!hasCopter}
            className={`flex-shrink-0 p-3 border-2 border-black transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]
              ${
                isFlying
                  ? "bg-sky-400"
                  : hasCopter
                  ? "bg-white hover:bg-sky-50"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <i className="fa-solid fa-wind text-3xl"></i>
            <span className="text-xs font-bold mt-1">
              {isFlying ? "Land" : "Fly"}
            </span>
          </button>

          <button
            onClick={toggleInvisible}
            className={`flex-shrink-0 p-3 border-2 border-black transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]
              ${
                isInvisible
                  ? "bg-indigo-400 text-white"
                  : "bg-white hover:bg-indigo-50"
              }`}
          >
            <i className={`fa-solid fa-user-secret text-3xl`}></i>
            <span className="text-xs font-bold mt-1">Cape</span>
          </button>

          <div className="w-px h-12 bg-gray-300 mx-1"></div>

          {/* MOODS / ACTIONS */}
          <button
            onClick={() => triggerFace(FaceState.HAPPY)}
            className="flex-shrink-0 p-3 bg-pink-300 border-2 border-black hover:bg-pink-200 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😆</span>
            <span className="text-xs font-bold mt-1">Happy</span>
          </button>

          <button
            onClick={() => triggerFace(FaceState.ANGRY)}
            className="flex-shrink-0 p-3 bg-red-500 border-2 border-black hover:bg-red-400 text-white transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">💢</span>
            <span className="text-xs font-bold mt-1">Angry</span>
          </button>

          <button
            onClick={() => triggerFace(FaceState.SHOCK)}
            className="flex-shrink-0 p-3 bg-purple-400 border-2 border-black hover:bg-purple-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">🐭</span>
            <span className="text-xs font-bold mt-1">Mouse!</span>
          </button>

          <button
            onClick={() => triggerFace(FaceState.SLEEP)}
            className="flex-shrink-0 p-3 bg-blue-300 border-2 border-black hover:bg-blue-200 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😴</span>
            <span className="text-xs font-bold mt-1">Sleep</span>
          </button>

          <button
            onClick={() => triggerFace(FaceState.EAT)}
            className="flex-shrink-0 p-3 bg-orange-400 border-2 border-black hover:bg-orange-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">
              <i className="fa-solid fa-cookie-bite"></i>
            </span>
            <span className="text-xs font-bold mt-1">Eat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Doraemon;
