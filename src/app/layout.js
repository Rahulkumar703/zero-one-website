import Footer from "@/components/footer/Footer";
import Header from "@/components/header";
import SocialsBar from "@/components/socialsbar/SocialsBar";
import "@/styles/globals.css";
import Providers from "./Providers";
import connect from "@/utils/dbConnect";
import NextTopLoader from "nextjs-toploader";
import "./polyfills";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const gilroy = localFont({
  src: [
    {
      path: "./fonts/Gilroy-UltraLight.ttf",
      weight: "100",
      style: "normal",
      variable: "--font-gilroy-ultralight",
    },
    {
      path: "./fonts/Gilroy-Light.ttf",
      weight: "200",
      style: "normal",
      variable: "--font-gilroy-light",
    },
    {
      path: "./fonts/Gilroy-Thin.ttf",
      weight: "300",
      style: "normal",
      variable: "--font-gilroy-thin",
    },
    {
      path: "./fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
      variable: "--font-gilroy-regular",
    },
    {
      path: "./fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
      variable: "--font-gilroy-medium",
    },
    {
      path: "./fonts/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal",
      variable: "--font-gilroy-semibold",
    },
    {
      path: "./fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
      variable: "--font-gilroy-bold",
    },
    {
      path: "./fonts/Gilroy-Heavy.ttf",
      weight: "800",
      style: "normal",
      variable: "--font-gilroy-heavy",
    },
    {
      path: "./fonts/Gilroy-ExtraBold.ttf",
      weight: "900",
      style: "normal",
      variable: "--font-gilroy-extrabold",
    },
  ],
  display: "swap",
  variable: "--font-gilroy",
});

export const metadata = {
  title: {
    default: "ZERO ONE Coding Club",
    template: "%s | ZERO ONE Coding Club",
  },
  description:
    "ZERO ONE Coding Club Club of Motihari College of Engineering, Motihari",
};

export default async function RootLayout({ children }) {
  await connect();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${gilroy.variable}`}>
        <NextTopLoader
          color="#f33"
          zIndex={100}
          height={5}
          showSpinner={false}
        />
        <Providers>
          <Header />
          <SocialsBar />
          {children}
          <Footer />
        </Providers>
        <Toaster theme="dark" richColors={true} position="top-right" />
      </body>
    </html>
  );
}
