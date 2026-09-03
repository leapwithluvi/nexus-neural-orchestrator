"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "@/data/navigation";
import { AuthDialog } from "./auth/AuthDialog";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled || isOpen
          ? "bg-background border-border py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="mono-container flex items-center justify-between">
        <Link href="/overview">
          <Logo size={28} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                link.name === "Docs Core" 
                ? "text-emerald-500 hover:text-emerald-400" 
                : "hover:opacity-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {!user && (
            <AuthDialog>
              <button
                className="hidden md:block px-5 py-2 border border-border text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
              >
                Authorized Login
              </button>
            </AuthDialog>
          )}

          <Link
            href={user ? "/" : "/login"}
            className="hidden md:block px-5 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none"
          >
            {user ? "Execute Terminal" : "Start For Free"}
          </Link>
          <ModeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border p-8 animate-slideDown xl:hidden shadow-2xl">
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black uppercase tracking-widest transition-all ${
                  link.name === "Docs Core" ? "text-emerald-500" : "hover:italic"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-8 border-t border-border space-y-4">
              {!user && (
                <AuthDialog>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-xs font-black uppercase tracking-[0.4em] border border-border p-4 block text-center"
                  >
                    Authorized Login
                  </button>
                </AuthDialog>
              )}
              <Link
                href={user ? "/" : "/login"}
                onClick={() => setIsOpen(false)}
                className="text-xs font-black uppercase tracking-[0.4em] bg-foreground text-background p-4 block text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
              >
                {user ? "Execute Systems Terminal" : "Start For Free"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
