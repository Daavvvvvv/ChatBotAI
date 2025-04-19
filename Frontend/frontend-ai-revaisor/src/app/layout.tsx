import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/NavigationMenu";
import { ThemeProvider } from "@/components/themes/theme-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RevAIsor - AI Assistant Integration",
  description:
    "A platform integrating multiple AI models for enhanced assistance",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <header className="border-b">
            <div className="container mx-auto py-4">
              <MainNav />
            </div>
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
