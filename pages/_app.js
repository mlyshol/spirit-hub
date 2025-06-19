// pages/_app.js
import React from "react";
import Layout from "../components/layout";
import "../styles/globals.css";
import "../styles/sermons.module.css"; 

export default function MyApp({ Component, pageProps }) {
  // Only _app.js wraps in Layout — pages themselves should NOT import Layout
  return (
    <Layout
      pageTitle={pageProps.pageConfig?.title}
      pageDescription={pageProps.pageConfig?.description}
    >
      <Component {...pageProps} />
    </Layout>
  );
}