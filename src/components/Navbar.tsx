"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConfig, SiteConfig, defaultConfig } from "@/lib/config";

export default function Navbar() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 apple-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight hover:opacity-70 transition-opacity"
          style={{ fontSize: `${config.logo.fontSize}px` }}
        >
          {config.logo.text}
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/product" className="hover:text-gray-600 transition-colors">Produits</Link>
          <Link href="/about" className="hover:text-gray-600 transition-colors">À propos</Link>
          <Link href="/support" className="hover:text-gray-600 transition-colors">Support</Link>
        </div>
        <Link href="/product" className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-all">
          Acheter
        </Link>
      </div>
    </nav>
  );
}