import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estimate Web App',
  description: 'Web version of the Excel/VBA estimating program',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
