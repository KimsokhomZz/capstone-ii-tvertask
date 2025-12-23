import React, { useEffect, useState, useRef } from "react";

export type FaceState = "IDLE" | "HAPPY" | "SHOCK" | "EAT" | "ANGRY" | "SLEEP";
export const FaceState = {
  IDLE: "IDLE" as FaceState,
  HAPPY: "HAPPY" as FaceState,
  SHOCK: "SHOCK" as FaceState,
  EAT: "EAT" as FaceState,
  ANGRY: "ANGRY" as FaceState,
  SLEEP: "SLEEP" as FaceState,
};

const BUTTONS = [
  { type: "action", id: "copter", label: "Copter", icon: "fa-fan", spin: true },
  { type: "action", id: "fly", label: "Fly", icon: "fa-wind" },
  { type: "action", id: "cape", label: "Cape", icon: "fa-user-secret" },
  { type: "sep" },
  {
    type: "mood",
    id: FaceState.HAPPY,
    label: "Happy",
    icon: "😆",
    cls: "bg-pink-300",
  },
  {
    type: "mood",
    id: FaceState.ANGRY,
    label: "Angry",
    icon: "💢",
    cls: "bg-red-500 text-white",
  },
  {
    type: "mood",
    id: FaceState.SHOCK,
    label: "Mouse!",
    icon: "🐭",
    cls: "bg-purple-400",
  },
  {
    type: "mood",
    id: FaceState.SLEEP,
    label: "Sleep",
    icon: "😴",
    cls: "bg-blue-300",
  },
  {
    type: "mood",
    id: FaceState.EAT,
    label: "Eat",
    icon: "🍪",
    cls: "bg-orange-400",
  },
];

const Doraemon: React.FC<{
  showControls?: boolean;
  persistKey?: string;
}> = ({ showControls = true, persistKey }) => {
  const [face, setFace] = useState<FaceState>(FaceState.IDLE);
  const [opts, setOpts] = useState({
    copter: false,
    flying: false,
    invis: false,
  });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const ref = useRef({ x: 0, y: 0 });

  // load persisted full state (face + opts + pos) if persistKey provided
  useEffect(() => {
    if (!persistKey) return;
    const raw = localStorage.getItem(persistKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.face) setFace(parsed.face as FaceState);
        if (parsed.opts) setOpts(parsed.opts);
        if (parsed.pos) setPos(parsed.pos);
      }
    } catch {
      // legacy string-only face
      setFace(raw as FaceState);
    }
  }, [persistKey]);

  // do not auto-reset face when persisted (behave like ShinChan)
  useEffect(() => {
    if (face !== FaceState.IDLE && face !== FaceState.SLEEP && !persistKey) {
      const t = setTimeout(() => setFace(FaceState.IDLE), 2500);
      return () => clearTimeout(t);
    }
  }, [face, persistKey]);

  // persist full Doraemon state whenever it changes
  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, JSON.stringify({ face, opts, pos }));
    } catch {}
  }, [face, opts, pos, persistKey]);

  useEffect(() => {
    if (!opts.flying) setPos({ x: 0, y: 0 });
  }, [opts.flying]);

  const handlePD = (e: React.PointerEvent) => {
    if (!opts.flying) return;
    e.preventDefault();
    setDrag(true);
    ref.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX - ref.current.x, y: e.clientY - ref.current.y });
    };
    const up = () => setDrag(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag]);

  const toggle = (k: keyof typeof opts) => {
    setOpts((p) => {
      if (k === "flying" && !p.copter) return p;
      if (k === "copter" && p.copter)
        return { ...p, copter: false, flying: false };
      return { ...p, [k]: !p[k] } as typeof p;
    });
    // saved via effect
  };

  const persistSetFace = (f: FaceState) => {
    setFace(f);
    // saved via effect
  };

  const msg =
    face === FaceState.ANGRY
      ? "KDM Ah Thai"
      : face === FaceState.SLEEP
      ? "Dek hx all nop"
      : face === FaceState.EAT
      ? "C ey kor ch'nganh dal"
      : opts.flying
      ? "Dak nhom jos lern"
      : null;
  const is = (s: FaceState) => face === s;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        onPointerDown={handlePD}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          cursor: opts.flying ? (drag ? "grabbing" : "grab") : "default",
          touchAction: "none",
          transition: drag
            ? "none"
            : "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className={`relative z-20 ${showControls ? "mb-8" : ""}`}
      >
        <div
          className={`relative w-72 h-72 md:w-80 md:h-80 mx-auto transition-all duration-1000 ${
            opts.flying ? "animate-float" : ""
          } ${opts.invis ? "opacity-20 blur-[1px]" : "opacity-100"}`}
        >
          <style>{`
            @keyframes float-fly { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-30px) rotate(-5deg);} }
            @keyframes blade-spin { 0%{transform:scaleX(1);} 50%{transform:scaleX(0.1);} 100%{transform:scaleX(1);} }
            @keyframes blink { 0%,96%,100%{transform:scaleY(1);} 98%{transform:scaleY(0.1);} }
            @keyframes chew { 0%,100%{transform:scaleY(1);} 50%{transform:scaleY(0.8);} }
            @keyframes bell-ring { 0%,100%{transform:rotate(0);} 25%{transform:rotate(15deg);} 75%{transform:rotate(-15deg);} }
            @keyframes snot-bubble { 0%{transform:scale(0);opacity:0;} 50%{transform:scale(1.2);opacity:0.8;} 100%{transform:scale(1);opacity:0.6;} }
            @keyframes steam-rise { 0%{transform:translateY(0) scale(1);opacity:0.8;} 100%{transform:translateY(-30px) scale(2);opacity:0;} }
            .animate-float { animation: float-fly 2s infinite ease-in-out; }
            .animate-blade { animation: blade-spin 0.08s infinite linear; transform-box: fill-box; transform-origin: center; }
            .animate-blink { animation: blink 4s infinite; transform-box: fill-box; transform-origin: center; }
            .animate-chew { animation: chew 0.4s infinite; transform-box: fill-box; transform-origin: center; }
            .animate-bell { animation: bell-ring 1s infinite; transform-origin: 150px 255px; }
            .animate-snot { animation: snot-bubble 2s infinite ease-in-out; transform-origin: 150px 155px; }
            .animate-steam { animation: steam-rise 1s infinite linear; }
          `}</style>

          {msg && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce whitespace-nowrap pointer-events-none">
              <div className="bg-white border-4 border-black px-5 py-3 rounded-2xl shadow-lg relative">
                <span
                  className={`text-lg font-black ${
                    is(FaceState.ANGRY) ? "text-red-600" : "text-black"
                  }`}
                >
                  {msg}
                </span>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-black rotate-45"></div>
              </div>
            </div>
          )}
          {is(FaceState.ANGRY) && (
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
          >
            <g
              className={`transition-all duration-500 ${
                opts.copter
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-10"
              }`}
              style={{ transformOrigin: "bottom center" }}
            >
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
              <ellipse
                cx="150"
                cy="15"
                rx="80"
                ry="6"
                fill="#FFD700"
                stroke="#000"
                strokeWidth="2"
                className={opts.copter ? "animate-blade" : ""}
              />
            </g>
            <circle
              cx="150"
              cy="160"
              r="100"
              fill="#0095D9"
              stroke="#000"
              strokeWidth="3"
            />
            <circle
              cx="150"
              cy="175"
              r="85"
              fill="#FFF"
              stroke="#000"
              strokeWidth="3"
            />
            <g
              className={
                is(FaceState.SHOCK) ||
                is(FaceState.SLEEP) ||
                is(FaceState.ANGRY)
                  ? ""
                  : "animate-blink"
              }
            >
              <ellipse
                cx="120"
                cy="115"
                rx="25"
                ry="30"
                fill="#FFF"
                stroke="#000"
                strokeWidth="3"
              />
              <ellipse
                cx="180"
                cy="115"
                rx="25"
                ry="30"
                fill="#FFF"
                stroke="#000"
                strokeWidth="3"
              />
              {is(FaceState.SHOCK) ? (
                <>
                  <circle cx="120" cy="115" r="3" fill="#000" />
                  <circle cx="180" cy="115" r="3" fill="#000" />
                  <path
                    d="M 230,130 Q 240,130 235,145 Q 230,130 230,130"
                    fill="#00F"
                    opacity="0.6"
                  />
                </>
              ) : is(FaceState.HAPPY) ? (
                <>
                  <path
                    d="M 105,115 Q 120,105 135,115 M 165,115 Q 180,105 195,115"
                    stroke="#000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </>
              ) : is(FaceState.EAT) ? (
                <>
                  <path
                    d="M 110,120 L 130,120 M 170,120 L 190,120"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              ) : is(FaceState.SLEEP) ? (
                <>
                  <path
                    d="M 110,120 Q 120,130 130,120 M 170,120 Q 180,130 190,120"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              ) : is(FaceState.ANGRY) ? (
                <>
                  <line
                    x1="105"
                    y1="105"
                    x2="135"
                    y2="120"
                    stroke="#000"
                    strokeWidth="4"
                  />
                  <line
                    x1="195"
                    y1="105"
                    x2="165"
                    y2="120"
                    stroke="#000"
                    strokeWidth="4"
                  />
                  <circle cx="120" cy="125" r="4" fill="#000" />
                  <circle cx="180" cy="125" r="4" fill="#000" />
                </>
              ) : (
                <>
                  <circle cx="128" cy="120" r="6" fill="#000" />
                  <circle cx="172" cy="120" r="6" fill="#000" />
                </>
              )}
            </g>
            <circle
              cx="150"
              cy="155"
              r="12"
              fill="#D90000"
              stroke="#000"
              strokeWidth="3"
            />
            <circle cx="146" cy="151" r="4" fill="#FFF" opacity="0.6" />
            {is(FaceState.SLEEP) && (
              <circle
                cx="160"
                cy="160"
                r="15"
                fill="rgba(173,216,230,0.5)"
                stroke="#50E0FF"
                className="animate-snot"
              />
            )}
            <line
              x1="150"
              y1="167"
              x2="150"
              y2="215"
              stroke="#000"
              strokeWidth="3"
            />
            <g stroke="#000" strokeWidth="2">
              <line x1="80" y1="160" x2="130" y2="170" />
              <line x1="75" y1="180" x2="130" y2="180" />
              <line x1="80" y1="200" x2="130" y2="190" />
              <line x1="220" y1="160" x2="170" y2="170" />
              <line x1="225" y1="180" x2="170" y2="180" />
              <line x1="220" y1="200" x2="170" y2="190" />
            </g>
            <g className="transition-all duration-300">
              {is(FaceState.SHOCK) ? (
                <ellipse
                  cx="150"
                  cy="220"
                  rx="20"
                  ry="25"
                  fill="#A00"
                  stroke="#000"
                  strokeWidth="3"
                />
              ) : is(FaceState.EAT) ? (
                <g className="animate-chew">
                  <path
                    d="M 120,215 Q 150,245 180,215"
                    fill="#A00"
                    stroke="#000"
                    strokeWidth="3"
                  />
                  <path
                    d="M 130,225 Q 150,210 170,225 Q 170,245 150,245 Q 130,245 130,225"
                    fill="#CD853F"
                    stroke="#8B4513"
                    strokeWidth="2"
                  />
                </g>
              ) : is(FaceState.HAPPY) ? (
                <path
                  d="M 90,195 Q 150,260 210,195"
                  fill="#A00"
                  stroke="#000"
                  strokeWidth="3"
                />
              ) : is(FaceState.ANGRY) ? (
                <path
                  d="M 110,225 Q 150,205 190,225"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                />
              ) : is(FaceState.SLEEP) ? (
                <circle
                  cx="150"
                  cy="220"
                  r="5"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                />
              ) : (
                <path
                  d="M 100,215 Q 150,250 200,215"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
            </g>
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
            <g className={opts.flying ? "animate-bell" : ""}>
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
      {showControls && (
        <div className="flex gap-3 w-full overflow-x-auto p-4 z-50 justify-start md:justify-center no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
          {BUTTONS.map((b, i) => {
            if (b.type === "sep")
              return <div key={i} className="w-px h-12 bg-gray-300 mx-1"></div>;
            if (b.type === "action") {
              const active =
                b.id === "copter"
                  ? opts.copter
                  : b.id === "fly"
                  ? opts.flying
                  : b.id === "cape"
                  ? opts.invis
                  : false;
              const cls = active
                ? b.id === "cape"
                  ? "bg-indigo-400 text-white"
                  : b.id === "fly"
                  ? "bg-sky-400"
                  : "bg-yellow-400"
                : b.id === "fly" && !opts.copter
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white";
              return (
                <button
                  key={i}
                  onClick={() =>
                    toggle(
                      b.id === "cape"
                        ? "invis"
                        : b.id === "fly"
                        ? "flying"
                        : "copter"
                    )
                  }
                  disabled={b.id === "fly" && !opts.copter}
                  className={`flex-shrink-0 p-3 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px] ${cls}`}
                >
                  <i
                    className={`fa-solid ${b.icon} text-3xl ${
                      b.spin && active ? "animate-spin" : ""
                    }`}
                  ></i>
                  <span className="text-xs font-bold mt-1">{b.label}</span>
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => persistSetFace(b.id as FaceState)}
                className={`flex-shrink-0 p-3 ${b.cls} border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]`}
              >
                <span className="text-3xl">{b.icon}</span>
                <span className="text-xs font-bold mt-1">{b.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Doraemon;
