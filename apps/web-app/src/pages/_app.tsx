import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import { Noto_Sans_Bengali } from 'next/font/google';

import '@/styles/globals.css';

const notoSansBengali = Noto_Sans_Bengali({
  weight: ['400', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-noto-sans-bengali'
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GeistProvider>
      <CssBaseline />
      <div className={notoSansBengali.variable}>
        <Head>
          <title>likhonsheikh — বাংলা-প্রথম ব্লগিং প্ল্যাটফর্ম</title>
          <meta
            name="description"
            content="likhonsheikh.com হল বাংলা ভাষার লেখকদের জন্য টেকসই ব্লগিং প্ল্যাটফর্ম যেখানে ইমেইল প্রকাশ ও সাবস্ক্রিপশন সুবিধা রয়েছে।"
          />
        </Head>
        <Component {...pageProps} />
      </div>
    </GeistProvider>
  );
}
