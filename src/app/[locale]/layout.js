import { AppProvider } from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Roboto } from 'next/font/google'
import './globals.css'
import { Toaster } from "react-hot-toast";
import { locales } from '@/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from 'next/navigation';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'Food Lover',
  description: 'For the love of food',
}

export default function RootLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <meta charSet="UTF-8"/>
      </head>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className={roboto.className}>
          <main className="max-w-4xl mx-auto p-4">
            <AppProvider>
              <Toaster />
              <Header />
              {children}
              <footer className="border-t p-8 text-center text-gray-500 mt-16">
                &copy; 2024 All rights reserved
              </footer>
            </AppProvider>
          </main>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
