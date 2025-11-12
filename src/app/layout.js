import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Find where on Earth",
  description: "Guess the location of the satellite image on the Earth",
};

/**
 * The root layout component for the app.
 *
 * This component renders the HTML and body tags for the app, and applies the
 * font class to the body element. The children prop is rendered inside the body
 * element.
 *
 * @param {{ children: React.ReactNode }} props The props object.
 * @param {React.ReactNode} props.children The children to render inside the body.
 * @returns {React.ReactElement} The root layout element.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
