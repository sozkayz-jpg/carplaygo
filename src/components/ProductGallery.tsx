"use client";

import { useEffect, useState } from "react";
import { getConfig, SiteConfig, defaultConfig } from "@/lib/config";

export default function ProductGallery() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  const { main, thumb1, thumb2 } = config.productImages;

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-apple-gray rounded-3xl overflow-hidden">
        <img
          src={main.src}
          alt={main.alt}
          style={{ maxWidth: `${main.maxWidth}px` }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-square bg-apple-gray rounded-2xl overflow-hidden">
          <img
            src={thumb1.src}
            alt={thumb1.alt}
            style={{ maxWidth: `${thumb1.maxWidth}px` }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square bg-apple-gray rounded-2xl overflow-hidden">
          <img
            src={thumb2.src}
            alt={thumb2.alt}
            style={{ maxWidth: `${thumb2.maxWidth}px` }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}