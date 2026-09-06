import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'과일 짝꿍 맞추기',description:'달콤한 기억력 한 판. 8장부터 44장까지 10스테이지의 3D 과일 카드 짝을 찾아보세요.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
