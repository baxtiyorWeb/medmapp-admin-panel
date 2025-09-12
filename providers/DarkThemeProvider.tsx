"use client"; // client component
import React, { useEffect, useState } from "react";

interface DarkModeProviderProps {
  children: React.ReactNode;
}

const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(true); // default dark

  useEffect(() => {
    // localStorage'dan o'qish
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // default dark bo'lsa
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return <div>{children}</div>;
};

export default DarkModeProvider;
