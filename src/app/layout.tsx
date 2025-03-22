import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../styles/globals.css";
import "../styles/site/site-header.css";
import "../styles/site/site-footer.css";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dosq.fm",
  description: "A web music tracker complete with stats & analytics.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
        <style>{openSans.variable}</style>
      </head>
      <body>
        <div className="page-container">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
