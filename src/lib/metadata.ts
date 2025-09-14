import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default: "電商行銷網站",
    template: "%s | 電商行銷網站",
  },
  description: "專業的電商行銷平台，提供產品廣告編輯與 SEO 優化服務",
  keywords: ["電商", "行銷", "產品廣告", "SEO", "電子商務"],
  authors: [{ name: "電商行銷團隊" }],
  creator: "電商行銷團隊",
  publisher: "電商行銷平台",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://your-domain.com",
    title: "電商行銷網站",
    description: "專業的電商行銷平台，提供產品廣告編輯與 SEO 優化服務",
    siteName: "電商行銷網站",
  },
  twitter: {
    card: "summary_large_image",
    title: "電商行銷網站",
    description: "專業的電商行銷平台，提供產品廣告編輯與 SEO 優化服務",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
