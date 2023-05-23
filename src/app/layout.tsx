import type { Metadata } from 'next';
import Header from './components/Header';
 
// These styles apply to every route in the application
import './global.css'
 
export const metadata: Metadata = {
  title: 'Projeto MedFasee BT',
  description: 'Projeto MedFasee Baixa Tensão (UFSC)',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        {children}
        </body>
    </html>
  );
}