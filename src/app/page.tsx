"use client";

import { RoleProvider } from "./context/RoleContext";
import { ThemeProvider } from "./context/ThemeContext";
import { MainLayout } from "./layout/MainLayout";
import { WelcomeScreen } from "../features/teacher/pages/WelcomeScreen";
import { TeacherDashboard } from "../features/teacher/pages/Dashboard";
import { Attendance } from "../features/teacher/pages/Attendance";
import { Journal } from "../features/teacher/pages/Journal";
import { Grades } from "../features/teacher/pages/Grades";
import { useRole } from "./context/RoleContext";
import { useState, useEffect } from "react";

function AppContent() {
  const { isAuthenticated, role } = useRole();
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "/";
      setCurrentPath(hash);
    };

    // Set initial path
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  if (role === "guru") {
    const renderPage = () => {
      switch (currentPath) {
        case "/teacher/dashboard":
        case "/":
          return <TeacherDashboard />;
        case "/teacher/attendance":
          return <Attendance />;
        case "/teacher/journal":
          return <Journal />;
        case "/teacher/grades":
          return <Grades />;
        case "/teacher/schedule":
          return <TeacherDashboard />; // Will be implemented later
        case "/teacher/homeroom":
          return <TeacherDashboard />; // Will be implemented later
        case "/teacher/upload-documents":
          return <TeacherDashboard />; // Will be implemented later
        case "/teacher/announcements":
          return <TeacherDashboard />; // Will be implemented later
        case "/teacher/ereport":
          return <TeacherDashboard />; // Will be implemented later
        case "/teacher/profile":
          return <TeacherDashboard />; // Will be implemented later
        default:
          return <TeacherDashboard />;
      }
    };

    return <MainLayout currentPath={currentPath}>{renderPage()}</MainLayout>;
  }

  // For other roles, show welcome screen for now
  return <WelcomeScreen />;
}

export default function Home() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </ThemeProvider>
  );
}
