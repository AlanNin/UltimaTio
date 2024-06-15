// DEPRECATED

/*
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactNode;
}

const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
}>({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const cookieValue = Cookies.get("isDarkMode");
    return cookieValue === "true" || cookieValue === undefined;
  });

  function toggleTheme() {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    Cookies.set("isDarkMode", newDarkMode ? "true" : "false", {
      expires: 365,
      path: "/",
    });

    document.documentElement.classList.toggle("dark", newDarkMode);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
*/
