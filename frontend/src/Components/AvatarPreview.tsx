import React, { useEffect, useRef, useState } from "react";
import FaceComponent from "@/Pages/Avatar/FaceComponent";
import { useTheme } from "@/context/ThemeContext";

const DEFAULT_PREVIEW_SCALE = 0.75;

export default function AvatarPreview() {
  const { darkMode } = useTheme();
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

  // keep mood in sync if changed elsewhere
  useEffect(() => {
    const onStorage = () => {
      try {
        const s = localStorage.getItem("selectedMood");
        if (s) setMood(s);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
        <FaceComponent mood={(mood as any) || "HAPPY"} custom={undefined} />
      </div>

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
          e.preventDefault();
          e.stopPropagation();
          const rect = previewRef.current?.getBoundingClientRect();
          const offsetX = e.clientX - (rect?.left ?? 0);
          const offsetY = e.clientY - (rect?.top ?? 0);
          dragRef.current = { x: offsetX, y: offsetY };
          pointerIdRef.current = e.pointerId;
          setDragging(true);
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (pointerIdRef.current !== e.pointerId) return;
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
