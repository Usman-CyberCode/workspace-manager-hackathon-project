import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Dev on - Workspace Platform",
  description: "Next-gen workspace and task management engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans transition-colors duration-300" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}