"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-medium">
          <svg aria-hidden className="h-5 w-5 text-[var(--color-primary)]"><use href="#icon-pump"/></svg>
          <span>Fuel Calculator</span>
        </a>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <a className="hover:underline" href="/">Home</a>
          <a className="hover:underline" href="/guides">Guides</a>
          <a className="hover:underline" href="/prices/delhi">Prices</a>
          <a className="hover:underline" href="/privacy">Privacy</a>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden p-2 rounded border border-black/10 dark:border-white/15"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, scaleY: 0.6 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden border-t border-black/10 dark:border-white/15 origin-top will-change-transform"
          >
            <nav className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-3 flex flex-col gap-2 text-sm">
              <a className="py-1" href="/" onClick={() => setOpen(false)}>Home</a>
              <a className="py-1" href="/guides" onClick={() => setOpen(false)}>Guides</a>
              <a className="py-1" href="/prices/delhi" onClick={() => setOpen(false)}>Prices</a>
              <a className="py-1" href="/privacy" onClick={() => setOpen(false)}>Privacy</a>
              <a className="py-1" href="/terms" onClick={() => setOpen(false)}>Terms</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


