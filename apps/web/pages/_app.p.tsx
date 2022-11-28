import { BlogLayout } from 'components';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import vhCheck from 'vh-check';
import darkMode from './darkMode';

import 'focus-visible/dist/focus-visible.min.js';
import 'styles/globals.css';
import 'styles/nprogress.css';

interface LayoutProps {
  children?: React.ReactNode;
}
function Layout({ children }: LayoutProps) {
  const router = useRouter();
  if (router.asPath === '/') {
    return <BlogLayout isHome>{children}</BlogLayout>;
  }
  if (router.route.indexOf('/user') === 0) {
    return <>{children}</>;
  }
  return <BlogLayout>{children}</BlogLayout>;
}
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    vhCheck();

    router.events.on('routeChangeStart', () => {
      NProgress.start();
    });
    router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });
    router.events.on('routeChangeError', () => {
      NProgress.done();
    });

    return () => {
      // router.events.off('routeChangeComplete', handleRouteChange)
    };
  }, []);
  return (
    <Layout>
      <Head>
        <title>{process.env.title}</title>
      </Head>
      <Script id="darkMode" dangerouslySetInnerHTML={{ __html: darkMode }} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
