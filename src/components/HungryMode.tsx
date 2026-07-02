"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/** "Hungry Mode" — warms the entire UI, saturates food imagery. */
export default function HungryMode() {
  const [on, setOn] = useState(false);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle("hungry", next);
  };

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-pressed={on}
      className={`fixed bottom-6 left-6 z-[110] flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl transition-colors duration-500 ${
        on
          ? "bg-gradient-to-r from-[#e06a2b] to-[#c4392f] text-cream"
          : "glass-strong text-gold-light"
      }`}
    >
      <span aria-hidden>{on ? "🔥" : "🍕"}</span>
      {on ? "Hungry Mode: AN" : "Hungry Mode"}
    </motion.button>
  );
}
