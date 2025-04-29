import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "InstaEduPay",
  description: "A dashboard for managing school payments and transactions",
  generator: "Ayush Agrawal",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
