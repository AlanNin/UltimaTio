import "~/styles/globals.css";
import ReduxProvider from "../providers/redux/redux-provider";
import { GeistSans } from "geist/font/sans";
import Footer from "~/components/layout/footer";
import TopNavbar from "~/components/layout/top-navbar";
import WhoIsWatching from "~/components/profile/whos-watching";
import ProfileCheckerProvider from "~/providers/profile-checker";
import ReactQueryProvider from "~/providers/react-query";
import { QueryClient } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata = {
  title: "UltimaTio",
  description: "#1 Streaming Platform",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 15,
      },
    },
  });

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
