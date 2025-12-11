import type { Metadata } from "next";
import { Lexend } from "next/font/google"; // Import Lexend from Google Fonts
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend", // Use a consistent variable name
});

export const metadata: Metadata = {
  title: "AI Personal Trainer", // More descriptive title
  description: "Your personalized AI-powered fitness coach", // More descriptive description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${lexend.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
