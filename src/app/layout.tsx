import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    <body>
      <div className="page-container">
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </body>
  );
}
