// components/Header.tsx
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  icon?: ReactNode; // optional prop
}

export default function Header({ title, icon }: HeaderProps) {
  return (
    <div className="flex items-center gap-2 text-gray-800 mb-4">
      {icon && (
        <span className="p-2 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
          {icon}
        </span>
      )}

      <div className=" font-bold text-md">
        <h1>{title}</h1>
      </div>
    </div>
  );
}
