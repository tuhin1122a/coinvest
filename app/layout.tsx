import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoinVest — Smart Coin Investment & Gaming Platform',
  description:
    'Grow your coins with AI-powered investment plans, exciting games, and epic battles. Join 50,000+ investors on CoinVest.',
  keywords: ['coin investment', 'crypto gaming', 'spin wheel', 'investment plans', 'VIP tiers'].join(', '),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'CoinVest — Smart Coin Investment & Gaming Platform',
    description: 'Grow your coins with AI-powered investment plans and exciting games.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
