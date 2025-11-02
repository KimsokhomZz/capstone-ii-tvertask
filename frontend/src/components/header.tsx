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
      className={`flex items-center gap-2 text-gray-800 mb-4 ${
        containerClassName ?? ""
      }`}
    >
      {icon && (
        <span className="p-2 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
          {icon}
        </span>
      )}

      <div className={` font-bold text-md ${titleClassName ?? ""}`}>
        <h1>{title}</h1>
      </div>
    </div>
  );
}
