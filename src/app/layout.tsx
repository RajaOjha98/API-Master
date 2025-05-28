import type { Metadata } from "next";
import "@fontsource/inter";
import "./globals.css";
import { ValidationProvider } from "@/context/ValidationContext";
import { AnalyticsProvider } from "@/context/AnalyticsContext";

export const metadata: Metadata = {
  title: "API-Master | Dashboard",
  description: "API key management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ValidationProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ValidationProvider>
      </body>
    </html>
  );
}
