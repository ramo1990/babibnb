import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import LoginModal from "@/components/modals/LoginModal";
import Providers from "@/components/providers/Providers";
import RentModal from "@/components/modals/RentModal";


const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb location appartement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={font.className}>
      {/* <body className={`${font.className} pt-20`}> */}
          <Providers>
            <RentModal />
            <RegisterModal />
            <LoginModal />
            <Navbar />
            {children}
          </Providers>
      </body>
    </html>
  );
}
