import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Primary Meta Tags */}
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#EF4444" />
          <meta name="description" content="Janaseva Foundation - Healthcare services platform providing ambulance services, doctor consultations, and medical assistance." />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://janasevafoundation.org/" />
          <meta property="og:title" content="Janaseva Foundation - Healthcare Services" />
          <meta property="og:description" content="Access quality healthcare services including ambulance, doctor consultations, and medical assistance." />
          <meta property="og:image" content="https://janasevafoundation.org/og-image.jpg" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://janasevafoundation.org/" />
          <meta property="twitter:title" content="Janaseva Foundation - Healthcare Services" />
          <meta property="twitter:description" content="Access quality healthcare services including ambulance, doctor consultations, and medical assistance." />
          <meta property="twitter:image" content="https://janasevafoundation.org/twitter-image.jpg" />

          {/* Fonts */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          {/* PWA Tags */}
          <meta name="application-name" content="Janaseva Foundation" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Janaseva Foundation" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#EF4444" />
          <meta name="msapplication-tap-highlight" content="no" />

          {/* Additional Meta Tags */}
          <meta name="keywords" content="healthcare, ambulance, medical services, doctor consultation, medical assistance, emergency services" />
          <meta name="author" content="Janaseva Foundation" />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="modal-root" />
          <div id="toast-root" />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
