import { useContext } from "react";
import { ThemeContext } from "./theme-provider";

export function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);
    const isLight = theme === "light";

    return (
        <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className="p-2 rounded-md bg-muted dark:bg-muted-dark text-foreground dark:text-foreground-dark"
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            title={isLight ? "Dark mode" : "Light mode"}
        >
            {isLight ? (
                // Moon icon
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
            ) : (
                // Sun icon
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 7a5 5 0 100 10 5 5 0 000-10z" />
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M4.64 4.64l1.41 1.41M18.36 18.36l1.41 1.41M18.36 5.64l-1.41 1.41M5.64 19.36l-1.41-1.41" />
                </svg>
            )}
        </button>
    );
}
