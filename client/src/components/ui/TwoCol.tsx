import { type ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}


export default function TwoCol({ children }: WrapperProps){
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

