import React from 'react';

export function JSONLD({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "CarplayGO Pro Max",
  "image": "https://your-domain.com/product-image.jpg",
  "description": "Adaptateur sans fil premium pour Carplay et Android Auto.",
  "brand": {
    "@type": "Brand",
    "name": "CarplayGO"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://your-domain.com/product",
    "priceCurrency": "EUR",
    "price": "89.99",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "EUR"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "cutoffTime": "2026-05-24T12:00",
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 3,
          "maxValue": 7,
          "unitCode": "DAY"
        }
      }
    }
  }
};
