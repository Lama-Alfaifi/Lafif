// app/layout.tsx

import { AuthProvider } from "@/features/auth/context/AuthContext";
import { LanguageProvider } from "@/features/i18n/context/LanguageContext";

import type { Metadata } from "next";

import { Alexandria } from "next/font/google";

import "./globals.css";

const alexandria = Alexandria({

  subsets: ["arabic", "latin"],

  weight: [
    "300",
    "400",
    "500",
    "700",
    "800",
  ],

});

export const metadata: Metadata = {

  title: "Lafif",

  description:
    "University Clubs Platform",

};

export default function RootLayout({

  children,

}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    // lang/dir are set dynamically by LanguageProvider via useEffect
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
    >

      <body
        className={`
          ${alexandria.className}
          bg-[#F8F6F2]
          text-[#0F172A]
          antialiased
          overflow-x-hidden
        `}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>

    </html>

  );

}