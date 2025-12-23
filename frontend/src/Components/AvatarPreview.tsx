import React, { useEffect, useRef, useState } from "react";
import FaceComponent from "@/Pages/Avatar/FaceComponent";
import ShinChan from "@/Pages/Avatar/ShinChan";
import Doraemon from "@/Pages/Avatar/Doraemon";
import Egg, { Emotion as EggEmotion } from "@/Pages/Avatar/Egg";
import { useTheme } from "@/context/ThemeContext";

const DEFAULT_PREVIEW_SCALE = 0.75;
const CENTER_HANDLE_RADIUS = 40; // px - radius of center area that starts drag

export default function AvatarPreview() {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const animRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const lastPos = useRef<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth - 120 : 24,
    y: 24,
  });

  const [previewPos, setPreviewPos] = useState<{ x: number; y: number }>(() => {
    try {
      const s = localStorage.getItem("avatarPreviewPos");
      if (s) return JSON.parse(s);
    } catch {}
    return {
      x: typeof window !== "undefined" ? window.innerWidth - 120 : 24,
      y: 24,
    };
  });
  const [previewScale, setPreviewScale] = useState(DEFAULT_PREVIEW_SCALE);
  const [dragging, setDragging] = useState(false);

  // show mood from localStorage (Avatar page persists selectedMood)
  const [mood, setMood] = useState<string>(() => {
    try {
      return localStorage.getItem("selectedMood") || "HAPPY";
    } catch {
      return "HAPPY";
    }
  });
  const [custom, setCustom] = useState<any | undefined>(undefined);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(
    () => {
      try {
        const s = localStorage.getItem("selectedAvatar");
        return s ? Number(s) : null;
      } catch {
        return null;
      }
    }
  );
  const [selectedAvatarType, setSelectedAvatarType] = useState<string | null>(
    () => {
      try {
        return localStorage.getItem("selectedAvatarType") || null;
      } catch {
        return null;
      }
    }
  );

  // load customization for current selectedAvatar
  useEffect(() => {
    const loadCustom = () => {
      try {
        const id = Number(localStorage.getItem("selectedAvatar"));
        if (!Number.isNaN(id)) {
          setSelectedAvatarId(id);
          const raw = localStorage.getItem(`avatar-custom-${id}`);
          if (raw) setCustom(JSON.parse(raw));
          else setCustom(undefined);
        } else {
          setSelectedAvatarId(null);
          setCustom(undefined);
        }
        // load avatar type too (so preview can switch component)
        try {
          const t = localStorage.getItem("selectedAvatarType");
          setSelectedAvatarType(t || null);
        } catch {
          setSelectedAvatarType(null);
        }
      } catch {
        setCustom(undefined);
      }
    };
    loadCustom();

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "selectedAvatar" ||
        (e.key && e.key.startsWith("avatar-custom-"))
      ) {
        loadCustom();
      }
      if (e.key === "selectedAvatarType") {
        try {
          setSelectedAvatarType(
            localStorage.getItem("selectedAvatarType") || null
          );
        } catch {
          setSelectedAvatarType(null);
        }
      }
      // keep mood sync too (existing behavior)
      if (e.key === "selectedMood") {
        try {
          const s = localStorage.getItem("selectedMood");
          if (s) setMood(s);
        } catch {}
      }
    };

    const onCustomUpdated = (ev: Event) => {
      try {
        const id = (ev as CustomEvent).detail?.id;
        if (!id) return;
        // if the updated id matches current selectedAvatar, reload its customization
        if (Number(id) === Number(selectedAvatarId)) {
          const raw = localStorage.getItem(`avatar-custom-${id}`);
          if (raw) setCustom(JSON.parse(raw));
          else setCustom(undefined);
        }
      } catch {}
    };

    const onAvatarSelected = (ev: Event) => {
      try {
        const detail = (ev as CustomEvent).detail;
        if (detail?.type !== undefined) setSelectedAvatarType(detail.type);
        if (detail?.id !== undefined) {
          const id = Number(detail.id);
          if (!Number.isNaN(id)) {
            setSelectedAvatarId(id);
            try {
              const raw = localStorage.getItem(`avatar-custom-${id}`);
              if (raw) setCustom(JSON.parse(raw));
              else setCustom(undefined);
            } catch {
              setCustom(undefined);
            }
          } else {
            setSelectedAvatarId(null);
            setCustom(undefined);
          }
        }
      } catch {}
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "avatar-selected",
      onAvatarSelected as EventListener
    );
    window.addEventListener(
      "avatar-custom-updated",
      onCustomUpdated as EventListener
    );

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "avatar-selected",
        onAvatarSelected as EventListener
      );
      window.removeEventListener(
        "avatar-custom-updated",
        onCustomUpdated as EventListener
      );
    };
  }, []);

  useEffect(() => {
    lastPos.current = { x: previewPos.x, y: previewPos.y };
    if (previewRef.current) {
      previewRef.current.style.transform = `translate3d(${previewPos.x}px, ${previewPos.y}px, 0) scale(${previewScale})`;
    }

    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const nx = e.clientX - dragRef.current.x;
      const ny = e.clientY - dragRef.current.y;
      const w = previewRef.current?.offsetWidth ?? 140;
      const h = previewRef.current?.offsetHeight ?? 120;
      const clampedX = Math.min(Math.max(nx, 8), window.innerWidth - w - 8);
      const clampedY = Math.min(Math.max(ny, 8), window.innerHeight - h - 8);
      lastPos.current = { x: clampedX, y: clampedY };

      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(() => {
        if (previewRef.current) {
          previewRef.current.style.transform = `translate3d(${lastPos.current.x}px, ${lastPos.current.y}px, 0) scale(${previewScale})`;
        }
      });
    };

    const onUp = () => {
      if (dragRef.current) {
        setDragging(false);
        dragRef.current = null;
        setPreviewPos({ ...lastPos.current });
        try {
          localStorage.setItem(
            "avatarPreviewPos",
            JSON.stringify(lastPos.current)
          );
        } catch {}
      }
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []); // eslint-disable-line

  const handleLayout = (() => {
    // map types -> overlay position/size offsets (tweak numbers if needed)
    const map: Record<string, { top: string; left: string; size: number }> = {
      // force true center for face & shinchan (Doraemon/Egg keep existing offsets)
      face: { left: "120%", top: "120%", size: CENTER_HANDLE_RADIUS * 2 },
      shinchan: {
        left: "140%",
        top: "50%",
        size: CENTER_HANDLE_RADIUS * 2 + 8,
      },
      doraemon: { left: "50%", top: "52%", size: CENTER_HANDLE_RADIUS * 2 + 6 },
      egg: { left: "50%", top: "52%", size: CENTER_HANDLE_RADIUS * 2 + 6 },
    };
    return map[(selectedAvatarType || "face").toLowerCase()] || map.face;
  })();

  return (
    <div
      ref={previewRef}
      className="fixed z-50 block rounded-xl p-1 w-24 h-24 sm:w-28 sm:h-28"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${previewPos.x}px, ${previewPos.y}px, 0) scale(${previewScale})`,
        touchAction: "none",
        willChange: "transform",
        WebkitBackfaceVisibility: "hidden",
        userSelect: "none",
        transition: dragging ? "none" : "transform 140ms ease-out",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{ width: "84%", height: "84%", transform: "scale(1)" }}
        className="m-auto pointer-events-none"
      >
        {/* render component matching selected avatar type */}
        {selectedAvatarType === "shinchan" ? (
          <ShinChan
            showControls={false}
            persistKey={`avatar-${selectedAvatarId}`}
          />
        ) : selectedAvatarType === "doraemon" ? (
          <Doraemon
            showControls={false}
            persistKey={`avatar-${selectedAvatarId}`}
          />
        ) : selectedAvatarType === "egg" ? (
          <Egg
            emotion={
              mood === "ANGRY"
                ? EggEmotion.ANGRY
                : mood === "SAD"
                ? EggEmotion.SAD
                : mood === "LOVE"
                ? EggEmotion.LOVE
                : EggEmotion.NEUTRAL
            }
            showControls={false}
            persistKey={`avatar-${selectedAvatarId}`}
          />
        ) : (
          <FaceComponent mood={(mood as any) || "HAPPY"} custom={custom} />
        )}
      </div>

      {/* visual center handle hint (non-intrusive) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: CENTER_HANDLE_RADIUS * 2,
          height: CENTER_HANDLE_RADIUS * 2,
          borderRadius: CENTER_HANDLE_RADIUS,
          pointerEvents: "none",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          opacity: 0.06,
        }}
      />

      {/* full-size transparent overlay so click-hold anywhere on avatar starts immediate drag */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          zIndex: 80,
          cursor: dragging ? "grabbing" : "grab",
          background: "transparent",
          touchAction: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPointerDown={(e) => {
          const rect = previewRef.current?.getBoundingClientRect();
          if (!rect) return;
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;

          e.preventDefault();
          e.stopPropagation();
          dragRef.current = { x: offsetX, y: offsetY };
          pointerIdRef.current = e.pointerId;
          setDragging(true);
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);

          const onMove = (ev: PointerEvent) => {
            if (pointerIdRef.current !== ev.pointerId) return;
            if (!dragRef.current) return;
            const x = ev.clientX - dragRef.current.x;
            const y = ev.clientY - dragRef.current.y;
            targetPos.current = { x, y };
          };

          const onUp = (ev: PointerEvent) => {
            if (pointerIdRef.current !== ev.pointerId) return;
            pointerIdRef.current = null;
            setDragging(false);
            dragRef.current = null;
            setPreviewPos({ ...targetPos.current });
            try {
              localStorage.setItem(
                "avatarPreviewPos",
                JSON.stringify(targetPos.current)
              );
            } catch {}
            (e.currentTarget as Element).releasePointerCapture?.(ev.pointerId);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
          };

          window.addEventListener("pointermove", onMove, { passive: false });
          window.addEventListener("pointerup", onUp, { passive: false });
        }}
        onPointerCancel={(e) => {
          if (pointerIdRef.current !== e.pointerId) return;
          pointerIdRef.current = null;
          setDragging(false);
          dragRef.current = null;
        }}
        onWheel={(e) => {
          e.preventDefault();
          const delta = -e.deltaY;
          const factor = 1 + Math.sign(delta) * 0.08;
          let ns = Math.min(Math.max(previewScale * factor, 0.4), 1.2);
          setPreviewScale(ns);
        }}
        onDoubleClick={() => {
          const reset = {
            x:
              window.innerWidth - (previewRef.current?.offsetWidth ?? 160) - 16,
            y: 24,
          };
          lastPos.current = { ...reset };
          targetPos.current = { ...reset };
          setPreviewPos(reset);
          try {
            localStorage.setItem("avatarPreviewPos", JSON.stringify(reset));
          } catch {}
        }}
      >
        {/* visual square handle centered */}
        <div
          aria-hidden
          style={{
            width: handleLayout.size * 1.6,
            height: handleLayout.size * 1.6,
            borderRadius: 12,
            border: `2px solid rgba(34,197,94,${dragging ? 0.95 : 0.6})`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
