import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { CivicAuthProvider } from "@civic/auth/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "LearnLM - Turn Videos into Action",
  description: "Transform educational videos into actionable study plans with AI-generated task breakdowns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className} antialiased`}>
        <CivicAuthProvider clientId="9efd0ded-8be4-431c-8be4-cfcf03522a53">
          {children}
        </CivicAuthProvider>
      </body>
    </html>
  );
}
