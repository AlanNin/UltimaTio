import "~/styles/globals.css";
import { ReduxProvider } from "../redux/reduxProvider";
import TopNavbar from "./_components/layout/topNavbar";
import Footer from "./_components/layout/footer";
import { GeistSans } from "geist/font/sans";
import WhoIsWatching from "./_components/profile/whoIsWatching";

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
      <body className="app">
        <ReduxProvider>
          <WhoIsWatching />
          <TopNavbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
