import type { Metadata } from 'next';
import './globals.css';
import {TooltipProvider} from '@/components/ui/tooltip';
export const metadata: Metadata = { title:'P.E.M · MONARCAS', description:'Um lugar para entender, praticar e encontrar seu caminho nos estudos.', icons:{icon:'/monarcas.webp'} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR" className="dark" data-scroll-behavior="smooth"><body><a href="#main" className="skip-link">Ir ao conteúdo</a><TooltipProvider>{children}</TooltipProvider></body></html>; }
