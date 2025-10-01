import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span>🍌</span>
          <span>BANANA Promptz</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            แกลเลอรี
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            สำรวจ
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            คอลเล็กชัน
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            พรอมต์ของฉัน
          </Link>
        </nav>

        <Link to="/submit">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
            แชร์พรอมต์
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
