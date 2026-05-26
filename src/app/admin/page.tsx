"use client";

import { useState, useEffect } from "react";
import { SiteConfig, getConfig, saveConfig, defaultConfig } from "@/lib/config";

export default function AdminPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    saveConfig(defaultConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">CarplayGO Admin</h1>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Retour au site
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {saved && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl text-sm font-medium">
            Configuration sauvegardée avec succès !
          </div>
        )}

        {/* Logo */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Logo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Texte du logo</label>
              <input
                type="text"
                value={config.logo.text}
                onChange={(e) => setConfig({ ...config, logo: { ...config.logo, text: e.target.value } })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#36c98f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Taille du logo (px) — <span className="text-[#36c98f]">{config.logo.fontSize}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={config.logo.fontSize}
                onChange={(e) => setConfig({ ...config, logo: { ...config.logo, fontSize: Number(e.target.value) } })}
                className="w-full accent-[#36c98f]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>12px</span>
                <span>48px</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Aperçu :</p>
              <span className="font-semibold tracking-tight" style={{ fontSize: `${config.logo.fontSize}px` }}>
                {config.logo.text}
              </span>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Image Hero (Page d&apos;accueil)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">URL de l&apos;image</label>
              <input
                type="text"
                value={config.heroImage.src}
                onChange={(e) => setConfig({ ...config, heroImage: { ...config.heroImage, src: e.target.value } })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#36c98f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Texte alternatif</label>
              <input
                type="text"
                value={config.heroImage.alt}
                onChange={(e) => setConfig({ ...config, heroImage: { ...config.heroImage, alt: e.target.value } })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#36c98f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Largeur max (px) — <span className="text-[#36c98f]">{config.heroImage.maxWidth}px</span>
              </label>
              <input
                type="range"
                min="300"
                max="1920"
                step="10"
                value={config.heroImage.maxWidth}
                onChange={(e) => setConfig({ ...config, heroImage: { ...config.heroImage, maxWidth: Number(e.target.value) } })}
                className="w-full accent-[#36c98f]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>300px</span>
                <span>1920px</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Taille recommandée : carré 1200 x 1200 px</p>
            </div>
          </div>
        </section>

        {/* Product Images */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Images Produit</h2>
          <div className="space-y-8">
            {(["main", "thumb1", "thumb2"] as const).map((key) => {
              const label = key === "main" ? "Image principale" : key === "thumb1" ? "Vignette 1" : "Vignette 2";
              const rec = key === "main" ? "1200 x 1200 px" : "600 x 600 px";
              return (
                <div key={key} className="space-y-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <h3 className="font-medium text-sm">{label}</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">URL de l&apos;image</label>
                    <input
                      type="text"
                      value={config.productImages[key].src}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          productImages: { ...config.productImages, [key]: { ...config.productImages[key], src: e.target.value } },
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#36c98f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Texte alternatif</label>
                    <input
                      type="text"
                      value={config.productImages[key].alt}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          productImages: { ...config.productImages, [key]: { ...config.productImages[key], alt: e.target.value } },
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#36c98f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Largeur max (px) — <span className="text-[#36c98f]">{config.productImages[key].maxWidth}px</span>
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="1600"
                      step="10"
                      value={config.productImages[key].maxWidth}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          productImages: { ...config.productImages, [key]: { ...config.productImages[key], maxWidth: Number(e.target.value) } },
                        })
                      }
                      className="w-full accent-[#36c98f]"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>200px</span>
                      <span>1600px</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Taille recommandée : {rec}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-[#36c98f] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Sauvegarder
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}