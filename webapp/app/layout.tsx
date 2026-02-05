import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { CartSheetProvider } from "@/contexts/CartSheetContext";
import { OrdersSheetProvider } from "@/contexts/OrdersSheetContext";
import { SupportSheetProvider } from "@/contexts/SupportSheetContext";
import { AboutSheetProvider } from "@/contexts/AboutSheetContext";
import ChatSheet from "@/components/ChatSheet";
import CartSheet from "@/components/CartSheet";
import OrdersSheet from "@/components/OrdersSheet";
import SupportSheet from "@/components/SupportSheet";
import AboutSheet from "@/components/AboutSheet";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "Hessa WebApp",
  description: "Premium Vitamin Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${manrope.className} ${unbounded.variable} font-sans antialiased`}>
        <Script id="twa-init" strategy="afterInteractive">
          {`
            if (window.Telegram && window.Telegram.WebApp) {
              const twa = window.Telegram.WebApp;
              twa.ready();
              twa.expand();
              
              // Enable header color adjustment
              twa.setHeaderColor('secondary_bg_color');
              
              // Disable vertical swipe to prevent accidental closing
              if (twa.isVersionAtLeast('7.7')) {
                twa.disableVerticalSwipe();
              }
              
              // Handle BackButton visibility
              const handlePathChange = () => {
                const isHome = window.location.pathname === '/';
                if (isHome) {
                  twa.BackButton.hide();
                } else {
                  twa.BackButton.show();
                }
              };
              
              twa.BackButton.onClick(() => window.history.back());
              
              // Initial check
              handlePathChange();
              
              // Observer for path changes (since it's a SPA)
              let lastPath = window.location.pathname;
              setInterval(() => {
                if (window.location.pathname !== lastPath) {
                  lastPath = window.location.pathname;
                  handlePathChange();
                }
              }, 500);
              
              console.log('TWA Initialized:', twa.version);
            }
          `}
        </Script>
        <ChatProvider>
          <OrdersSheetProvider>
            <SupportSheetProvider>
              <AboutSheetProvider>
                <CartSheetProvider>
                  <CartProvider>
                    {children}
                    <ChatSheet />
                    <OrdersSheet />
                    <SupportSheet />
                    <AboutSheet />
                    <CartSheet />
                  </CartProvider>
                </CartSheetProvider>
              </AboutSheetProvider>
            </SupportSheetProvider>
          </OrdersSheetProvider>
        </ChatProvider>
      </body>
    </html>
  );
}
