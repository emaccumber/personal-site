import '@/styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'
import type { AppProps } from 'next/app'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      {/* Vega-Lite dependencies for Altair charts */}
      <Script src="https://cdn.jsdelivr.net/npm/vega@5" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vega-lite@5" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vega-embed@6" strategy="beforeInteractive" />
      
      <Script
        id="dark-mode-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const savedMode = localStorage.getItem('darkMode');
              if (savedMode === 'true') {
                document.body.classList.add('dark-mode');
              } else if (savedMode === null) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  document.body.classList.add('dark-mode');
                }
              }
            })();
          `,
        }}
      />
      
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  )
}