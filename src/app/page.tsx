"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WelcomeScreen } from "../features/teacher/pages/WelcomeScreen";
import { useRole } from "./context/RoleContext";

export default function HomePage() {
  const { isAuthenticated, role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && role === "guru") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  // Show welcome screen while redirecting
  return <WelcomeScreen />;
}
