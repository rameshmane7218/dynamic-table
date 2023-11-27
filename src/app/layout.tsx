import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import RecoilProvider from "./RecoilProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dynamic Grid with State Management",
  description: "Dynamic Grid with State Management using Next.js, Recoil and Chakra-UI Library with cypress testing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider>
          <Providers>{children}</Providers>
        </RecoilProvider>
      </body>
    </html>
  );
}
