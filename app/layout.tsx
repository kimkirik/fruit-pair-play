import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={icons:{icon:[{url:'/game-icon-32.png',sizes:'32x32',type:'image/png'},{url:'/game-icon-192.png',sizes:'192x192',type:'image/png'}],apple:[{url:'/game-icon-180.png',sizes:'180x180'}]},manifest:'/manifest.webmanifest',title:'과일 짝꿍 맞추기',description:'달콤한 기억력 한 판. 8장부터 44장까지 10스테이지의 3D 과일 카드 짝을 찾아보세요.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
