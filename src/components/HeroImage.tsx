"use client";

import { useEffect, useState } from "react";
import { getConfig, SiteConfig, defaultConfig } from "@/lib/config";

export default function HeroImage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  return (
    <div className="flex justify-center mb-10">
      <img
        src={config.heroImage.src}
        alt={config.heroImage.alt}
        style={{ maxWidth: `${config.heroImage.maxWidth}px` }}
        className="w-full rounded-3xl object-cover"
      />
    </div>
  );
}