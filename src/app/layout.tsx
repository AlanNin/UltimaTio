import "~/styles/globals.css";
import ReduxProvider from "../providers/redux/redux-provider";
import { GeistSans } from "geist/font/sans";
import Footer from "~/components/layout/footer";
import TopNavbar from "~/components/layout/top-navbar";
import WhoIsWatching from "~/components/profile/whos-watching";
import ProfileCheckerProvider from "~/providers/profile-checker";
import ReactQueryProvider from "~/providers/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Metadata } from "next";

const metaDataDescription =
  "Stream movies and series with UltimaTio. Track your progress, build watchlists, get popular and trending recommendations, enjoy seamless streaming on any device.";

export const metadata: Metadata = {
  title: "UltimaTio",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon.ico" },
  ],
  description: metaDataDescription,
  keywords: [],
  twitter: {
    card: "summary_large_image",
    site: "@ultimatio",
    creator: "@ultimatio",
    title: "UltimaTio",
    description:
      "Stream movies & series, track progress, build watchlists, and resume anywhere with UltimaTio.",
  },
  openGraph: {
    title: "UltimaTio",
    description: metaDataDescription,
    images: {
      url: "ultimatio.alannin.dev/og.jpg",
      width: 1280,
      height: 720,
      alt: "UltimaTio",
    },
    url: "ultimatio.alannin.dev",
    type: "website",
    locale: "en",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${GeistSans.className} app`}>
        <ReduxProvider>
          <ReactQueryProvider>
            <ProfileCheckerProvider>
              <NuqsAdapter>
                <WhoIsWatching />
                <TopNavbar />
                {children}
                <Footer />
              </NuqsAdapter>
            </ProfileCheckerProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
