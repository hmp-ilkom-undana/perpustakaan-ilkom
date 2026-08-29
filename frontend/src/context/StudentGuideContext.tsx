import React, { createContext, useContext } from "react";
import { useStudentGuide } from "@/hooks/useStudentGuide";

type StudentGuideContextType = ReturnType<typeof useStudentGuide>;

const StudentGuideContext = createContext<StudentGuideContextType | null>(null);

export function StudentGuideProvider({ children }: { children: React.ReactNode }) {
  const guide = useStudentGuide();
  return (
    <StudentGuideContext.Provider value={guide}>
      {children}
    </StudentGuideContext.Provider>
  );
}

export function useStudentGuideContext() {
  const context = useContext(StudentGuideContext);
  if (!context) {
    throw new Error("useStudentGuideContext must be used within a StudentGuideProvider");
  }
  return context;
}
