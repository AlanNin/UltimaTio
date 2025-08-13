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
    { rel: "icon", type: "image/x-icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon.ico" },
  ],
  description: metaDataDescription,
  keywords: [
    "movie streaming platform",
    "TV series streaming site",
    "online movie player",
    "watch TV shows online",
    "stream movies and series",
    "binge-watch platform",
    "multimedia streaming service",
    "track viewing progress",
    "create watchlists online",
    "custom playlists movies",
    "resume watching across devices",
    "multi-device streaming",
    "adaptive bitrate streaming",
    "personalized movie recommendations",
    "UltimaTio",
    "Next.js streaming app",
    "Prisma PostgreSQL video platform",
    "Vercel video streaming",
    "Redux movie tracker",
    "JWT authentication video site",
    "best platform to track TV show progress",
    "how to stream movies across devices",
    "watch history tracking app for movies",
    "create custom playlists for streaming",
    "online streaming site with watchlist feature",
    "watch movies without losing progress",
  ],
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
      url: "https://ultimatio.alannin.dev/og.jpg",
      width: 1280,
      height: 720,
      alt: "UltimaTio",
    },
    url: "https://ultimatio.alannin.dev",
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
