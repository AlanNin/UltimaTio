import "~/styles/globals.css";
import ReduxProvider from "../utils/redux/redux-provider";
// import ReactQueryProvider from "~/utils/react-query/react-query";
import { GeistSans } from "geist/font/sans";
import TopNavbar from "./_shared/layout/top-navbar";
import Footer from "./_shared/layout/footer";
import WhoIsWatching from "./_shared/profile/whos-watching";
import CheckerProvider from "~/utils/profile-user-checker/checker-provider";

export const metadata = {
  title: "UltimaTio",
  description: "#1 Streaming Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${GeistSans.className} app`}>
        <ReduxProvider>
          <CheckerProvider>
            <WhoIsWatching />
            <TopNavbar />
            {children}
            <Footer />
          </CheckerProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
