import React, { type ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}


export default function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}