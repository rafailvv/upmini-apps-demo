
interface ThemeToggleProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border rounded-xl">
      <label htmlFor="themeSwitch" className="text-xs">Тёмная тема</label>
      <input
        id="themeSwitch"
        type="checkbox"
        checked={theme === "dark"}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        className="w-4 h-4"
      />
    </div>
  );
}
