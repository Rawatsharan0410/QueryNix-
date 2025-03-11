
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src="/lovable-uploads/575e00fa-6288-44cd-bef2-59eabd368ae4.png" 
              alt="QueryNix Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="ml-2 font-display text-2xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-querynix-500 to-querynix-700 bg-clip-text text-transparent">Query</span>
              <span className="text-foreground">Nix</span>
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden space-x-6 font-medium md:flex">
            <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
            <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#chat" className="text-muted-foreground transition-colors hover:text-foreground">
              Try It
            </a>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;