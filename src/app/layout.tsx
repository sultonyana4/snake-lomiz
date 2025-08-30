import type { Metadata } from "next";
import "./globals.css";
import Providers from "../providers/PrivyProvider.js";
import ErrorBoundary from "../components/ErrorBoundary.js";

export const metadata: Metadata = {
  title: "Snake Lomiz - Classic Snake Game",
  description: "Play the classic Snake game with power-ups! Collect food, avoid bombs, and grab clocks for extra time.",
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
