import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Project Map",
    template: "%s · The Project Map",
  },
  description:
    "Map-first public filings tracker for large energy and water-touching projects. Default geography: Darlington County, South Carolina.",
  applicationName: "The Project Map",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
