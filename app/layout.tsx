// app/layout.tsx

import { AuthProvider } from "@/features/auth/context/AuthContext";

import type { Metadata } from "next";

import { Alexandria } from "next/font/google";

import "./globals.css";

const alexandria = Alexandria({

  subsets: ["arabic"],

  weight: [
    "300",
    "400",
    "500",
    "700",
    "800",
  ],

});

export const metadata: Metadata = {

  title: "لفيف",

  description:
    "منصة الأندية الجامعية الذكية",

};

export default function RootLayout({

  children,

}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

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


        <AuthProvider>
        {children}
        </AuthProvider>

      </body>

    </html>

  );

}