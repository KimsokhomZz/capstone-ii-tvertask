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
      className={`flex items-center gap-2 text-black mb-4 ${
        containerClassName ?? ""
      }`}
    >
      {icon && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}

      <div className={`font-bold text-md ${titleClassName ?? "text-black"}`}>
        <h1>{title}</h1>
      </div>
    </div>
  );
}
