import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { APP_URL } from "@/lib/public-config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "TANAL",
    "arab tili",
    "sertifikat",
    "imtihon",
    "O'zbekiston",
    "test markazi",
  ],
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    locale: "uz_UZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${display.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
