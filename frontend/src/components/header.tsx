// components/Header.tsx
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  icon?: ReactNode; // optional prop
  titleClassName?: string;
  containerClassName?: string;
}

export default function Header({
  title,
  icon,
  titleClassName,
  containerClassName,
}: HeaderProps) {
  return (
    <div
      className={`flex items-center gap-3 text-foreground ${
        containerClassName ?? ""
      }`}
    >
      {icon && (
        <span className="flex items-center justify-center">{icon}</span>
        // save style : w-14 h-14 bg-yellow-100 rounded-2xl
      )}

      <div
        className={`font-bold text-md ${titleClassName ?? "text-foreground"}`}
      >
        <h1>{title}</h1>
      </div>
    </div>
  );
}
