import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        {/* Meta tags for SEO and performance */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Progressive Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Blues Festival Finder" />
        <meta name="application-name" content="Blues Festival Finder" />
        <meta name="theme-color" content="#d4a574" />

        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#d4a574" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Blues Festival Finder Team" />

        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
          img-src 'self' data: https: https://images.unsplash.com https://tqvvseagpkmdnsiuwabv.supabase.co;
          connect-src 'self' https://api.mapbox.com https://events.mapbox.com;
          frame-src 'self' https://challenges.cloudflare.com;
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
        " />

        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph extra tags */}
        <meta property="og:site_name" content="Blues Festival Finder" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter extra tags */}
        <meta name="twitter:site" content="@BluesFestival" />
        <meta name="twitter:creator" content="@BluesFestival" />

        {/* Additional verification tags (will be set via environment variables) */}
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION || ''} />
        <meta name="yandex-verification" content={process.env.YANDEX_SITE_VERIFICATION || ''} />

        {/* Preload critical fonts with optimized loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
          onLoad={(e: any) => { (e.target as HTMLLinkElement).onload = null; (e.target as HTMLLinkElement).rel = 'stylesheet'; }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* Critical CSS inlined to improve FCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical styles for above-the-fold content */
            :root {
              --color-navy: #1e3a5f;
              --color-gold: #d4a574;
              --color-cream: #f8f6f0;
              --color-bordeaux: #722f37;
            }

            body {
              font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: var(--color-cream);
              color: var(--color-navy);
            }

            .jazz-font { font-family: 'Playfair Display', serif; }
            .text-navy-900 { color: var(--color-navy); }
            .text-gold-600 { color: var(--color-gold); }
            .bg-cream-50 { background-color: var(--color-cream); }

            /* Loading spinner for better UX */
            .loading-spinner {
              border: 2px solid var(--color-cream);
              border-top: 2px solid var(--color-gold);
              border-radius: 50%;
              width: 20px;
              height: 20px;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />

        {/* Structured data for organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Blues Festival Finder",
            "description": "Discover blues dance festivals worldwide and follow your favorite teachers and musicians.",
            "url": "https://blues-festival-finder.vercel.app",
            "logo": "https://blues-festival-finder.vercel.app/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "hello@bluesfestivalfinder.com"
            },
            "sameAs": [
              "https://facebook.com/bluesfestivalfinder",
              "https://twitter.com/BluesFestival",
              "https://instagram.com/bluesfestivalfinder"
            ],
            "foundingDate": "2025",
            "numberOfEmployees": {
              "@type": "QuantitativeValue",
              "value": "5",
              "unitText": "employees"
            }
          })}
        </Script>

        {/* Structured data for website */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Blues Festival Finder",
            "description": "Discover blues dance festivals worldwide and follow your favorite teachers and musicians.",
            "url": "https://blues-festival-finder.vercel.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://blues-festival-finder.vercel.app/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Blues Festival Finder",
              "logo": {
                "@type": "ImageObject",
                "url": "https://blues-festival-finder.vercel.app/logo.png"
              }
            },
            "inLanguage": "en",
            "isPartOf": {
              "@type": "CreativeWork",
              "name": "Blues Festival Finder",
              "creator": {
                "@type": "Organization",
                "name": "Blues Festival Finder"
              }
            }
          })}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Google Analytics 4 */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                  // Enhanced ecommerce settings
                  custom_map: {
                    'custom_parameter_1': 'event_type'
                  },
                  // Privacy settings
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });

                // Track Web Vitals to Google Analytics
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  custom_map: {
                    'metric_id': 'dimension1',
                    'metric_value': 'dimension2',
                    'metric_delta': 'dimension3'
                  }
                });
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager (alternative/additional) */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}
      </body>
    </Html>
  )
}