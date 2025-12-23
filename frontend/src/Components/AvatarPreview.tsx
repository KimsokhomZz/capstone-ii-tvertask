import React, { useEffect, useRef, useState } from "react";
import FaceComponent from "@/Pages/Avatar/FaceComponent";
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
      // keep mood sync too (existing behavior)
      if (e.key === "selectedMood") {
        try {
          const s = localStorage.getItem("selectedMood");
          if (s) setMood(s);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
        {/* pass persisted customization (if any) so preview reflects cosplay changes */}
        <FaceComponent mood={(mood as any) || "HAPPY"} custom={custom} />
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

      {/* overlay to capture pointer/wheel/doubleclick */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          zIndex: 60,
          cursor: dragging ? "grabbing" : "grab",
          pointerEvents: "auto",
          background: "transparent",
          touchAction: "none",
        }}
        onPointerDown={(e) => {
          // Only start drag if pointer down is within the central handle radius
          const rect = previewRef.current?.getBoundingClientRect();
          if (!rect) return;
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const dx = offsetX - centerX;
          const dy = offsetY - centerY;
          const dist = Math.hypot(dx, dy);

          if (dist <= CENTER_HANDLE_RADIUS) {
            e.preventDefault();
            e.stopPropagation();
            dragRef.current = { x: offsetX, y: offsetY };
            pointerIdRef.current = e.pointerId;
            setDragging(true);
            (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          }
          // if outside handle area -> ignore (no drag start)
        }}
        onPointerUp={(e) => {
          if (pointerIdRef.current !== e.pointerId) {
            // If we never captured this pointer (didn't start drag), ignore
            return;
          }
          pointerIdRef.current = null;
          setDragging(false);
          dragRef.current = null;
          setPreviewPos({ ...lastPos.current });
          try {
            localStorage.setItem(
              "avatarPreviewPos",
              JSON.stringify(lastPos.current)
            );
          } catch {}
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        }}
        onPointerCancel={(e) => {
          if (pointerIdRef.current !== e.pointerId) return;
          pointerIdRef.current = null;
          setDragging(false);
          dragRef.current = null;
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        }}
        onWheel={(e) => {
          e.preventDefault();
          const delta = -e.deltaY;
          const factor = 1 + Math.sign(delta) * 0.08;
          let ns = Math.min(Math.max(previewScale * factor, 0.4), 1.2);
          setPreviewScale(ns);
          if (previewRef.current) {
            previewRef.current.style.transform = `translate3d(${lastPos.current.x}px, ${lastPos.current.y}px, 0) scale(${ns})`;
          }
        }}
        onDoubleClick={() => {
          const reset = {
            x:
              window.innerWidth - (previewRef.current?.offsetWidth ?? 160) - 16,
            y: 24,
          };
          lastPos.current = { ...reset };
          setPreviewPos(reset);
          if (previewRef.current) {
            previewRef.current.style.transform = `translate3d(${reset.x}px, ${reset.y}px, 0) scale(${previewScale})`;
          }
          try {
            localStorage.setItem("avatarPreviewPos", JSON.stringify(reset));
          } catch {}
        }}
      />
    </div>
  );
}
