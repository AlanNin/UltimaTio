import "~/styles/globals.css";
import { ReduxProvider } from "./reduxProvider";
import TopNavbar from "./_components/layout/topNavbar";
import Footer from "./_components/layout/footer";
import { GeistSans } from "geist/font/sans";

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
          <TopNavbar isTopOfPage={true} />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
