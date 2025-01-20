import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { AuthProviderWrapper } from "./auth-providers";

export const metadata: Metadata = {
  title: "Home - SA Marketing",
  description: "SA Marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={clsx("font-sans antialiased", fontSans.className)}>
      <AuthProviderWrapper>
          <Providers>{children}</Providers>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
