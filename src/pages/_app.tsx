import type { AppProps } from "next/app";
import { Header } from "../components/header";
import { AuthProvider } from "@/providers/auth";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
