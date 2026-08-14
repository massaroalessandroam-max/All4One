import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "All4One",
  description: "Percorso condiviso tra cliente, PT e nutrizionista.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
