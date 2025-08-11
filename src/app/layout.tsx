import "~/styles/globals.css";
import ReduxProvider from "../providers/redux/redux-provider";
import { GeistSans } from "geist/font/sans";
import ReactQueryProvider from "~/providers/react-query";
import Footer from "~/components/layout/footer";
import TopNavbar from "~/components/layout/top-navbar";
import WhoIsWatching from "~/components/profile/whos-watching";
import ProfileCheckerProvider from "~/providers/profile-checker";

export const metadata = {
  title: "UltimaTio",
  description: "#1 Streaming Platform",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${GeistSans.className} app`}>
        <ReactQueryProvider>
          <ReduxProvider>
            <ProfileCheckerProvider>
              <WhoIsWatching />
              <TopNavbar />
              {children}
              <Footer />
            </ProfileCheckerProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
