import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import AosAnimationProvider from "@/components/AosAnimationProvider";
import SiteChrome from "@/components/SiteChrome";
import { getSettings } from "@/lib/settings";

export const viewport = {
  themeColor: "#00a297",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en" data-theme-color="skin-8">
      <head>
        <meta name="google-site-verification" content="Mx9E19SfaQT8AW5qNRSCBoir3zFjO4okXtxTcR7hKgw" />
        <link rel="preload" as="image" href="/Assets/img/banner1.webp" type="image/webp" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" type="text/css" href="/Assets/vendor/animate/animate.css" />
        <link rel="stylesheet" type="text/css" href="/Assets/icons/feather/css/iconfont.css" />
        <link rel="stylesheet" type="text/css" href="/Assets/icons/fontawesome/css/all.min.css" />
        <link rel="stylesheet" type="text/css" href="/Assets/icons/flaticon/flaticon.css" />
        <link rel="stylesheet" type="text/css" href="/Assets/vendor/swiper/swiper-bundle.min.css" />
        <link rel="stylesheet" type="text/css" href="/Assets/css/style.css?v=20261021" />
      </head>
      <body id="bg" data-typography="typography_1">
        <AosAnimationProvider />
        <div className="page-wraper">
          <SiteChrome>
            <Header settings={settings} />
          </SiteChrome>
          <main className="page-content">{children}</main>
          <SiteChrome>
            <Footer settings={settings} />
            <FloatingWidgets settings={settings} />
          </SiteChrome>
        </div>
      </body>
    </html>
  );
}