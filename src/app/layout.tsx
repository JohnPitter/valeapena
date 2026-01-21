import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vale a Pena? | Descubra o custo real de um carro usado',
  description: 'Pesquise carros usados e descubra o preço das peças de manutenção antes de comprar. Veja se vale a pena ter um carro "resto de rico".',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-900`}>
        {children}
      </body>
    </html>
  );
}
