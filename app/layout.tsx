import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { NotificationProvider } from "@/providers/notification-provider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import NavBarSessionWrapper from "@/components/NavBarSessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoe service",
  description: "Приложение для ремонта обуви",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <Providers session={session}>
      <html lang="ru">
        <body className={inter.className}>
          <NotificationProvider>
            <div className="m-auto w-full">
              <NavBarSessionWrapper />
              {children}
            </div>
            <Toaster />
          </NotificationProvider>
          <Footer />
        </body>
      </html>
    </Providers>
  );
}
