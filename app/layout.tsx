import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elina AI - Générateur d\'applications web intelligent',
  description: 'Transformez vos idées en applications web complètes avec l\'IA. Générez du code HTML/CSS/JS en quelques secondes.',
  keywords: 'générateur de code, IA, applications web, HTML, CSS, JavaScript, développement web',
  authors: [{ name: 'Elina AI Team' }],
  openGraph: {
    type: 'website',
    url: 'https://elina-ai.vercel.app',
    title: 'Elina AI - Générateur d\'applications web',
    description: 'Transformez vos idées en applications web complètes avec l\'IA',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        {children}
        
        {/* Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
              heap.load("YOUR_HEAP_ID");
            `,
          }}
        />
      </body>
    </html>
  );
}
