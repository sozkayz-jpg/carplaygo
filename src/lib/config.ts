export interface SiteConfig {
  logo: {
    text: string;
    fontSize: number;
  };
  heroImage: {
    src: string;
    alt: string;
    maxWidth: number;
  };
  productImages: {
    main: {
      src: string;
      alt: string;
      maxWidth: number;
    };
    thumb1: {
      src: string;
      alt: string;
      maxWidth: number;
    };
    thumb2: {
      src: string;
      alt: string;
      maxWidth: number;
    };
  };
}

const defaultConfig: SiteConfig = {
  logo: {
    text: "CarplayGO",
    fontSize: 18,
  },
  heroImage: {
    src: "/hero-image.jpg",
    alt: "CarplayGO - L'expérience Carplay Sans Fil",
    maxWidth: 1200,
  },
  productImages: {
    main: {
      src: "/product-main.jpg",
      alt: "Dongle CarplayGO - Vue 3D",
      maxWidth: 1200,
    },
    thumb1: {
      src: "/product-thumb-1.jpg",
      alt: "CarplayGO - Angle Vue 1",
      maxWidth: 600,
    },
    thumb2: {
      src: "/product-thumb-2.jpg",
      alt: "CarplayGO - Angle Vue 2",
      maxWidth: 600,
    },
  },
};

const STORAGE_KEY = "carplaygo-site-config";

export function getConfig(): SiteConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return defaultConfig;
}

export function saveConfig(config: SiteConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export { defaultConfig };