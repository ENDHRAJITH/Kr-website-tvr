import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import EnquiryCartDrawer from "@/components/public/EnquiryCartDrawer";
import KRAIAssistantModal from "@/components/public/KRAIAssistantModal";
import { ThemeProvider } from "@/context/ThemeContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KR Digital Marketing & Studioz",
  description: "Photography, video, events and digital marketing under one creative team.",
  icons: {
    icon: [
      { url: '/kr-logo.png', type: 'image/png' },
    ],
    shortcut: '/kr-logo.png',
    apple: '/kr-logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} light`}>
      <body className={`${poppins.className} font-sans antialiased transition-colors duration-500 bg-white dark:bg-[#050505] text-slate-900 dark:text-white`}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <EnquiryCartDrawer />
          <KRAIAssistantModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
