
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <motion.button
      aria-label="Toggle theme"
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-secondary-foreground backdrop-blur-sm transition-colors hover:bg-secondary/90"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "light" ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative h-5 w-5"
      >
        <motion.div
          initial={false}
          animate={{ 
            opacity: theme === "light" ? 1 : 0,
            y: theme === "light" ? 0 : -10,
            scale: theme === "light" ? 1 : 0.8 
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="h-5 w-5 text-yellow-500" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ 
            opacity: theme === "dark" ? 1 : 0,
            y: theme === "dark" ? 0 : 10,
            scale: theme === "dark" ? 1 : 0.8 
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="h-5 w-5 text-blue-400" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}