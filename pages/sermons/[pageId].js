import { useRouter } from "next/router";
import Head from "next/head";
import Sermons from "../../components/sermons";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 
  "https://faith-hub-backend.onrender.com";

export async function getStaticPaths() {
  // 1) hit the real backend pages endpoint
  const res = await fetch(`${API_BASE}/api/pages`);
  const text = await res.text();
  if (!res.ok) {
    console.error("getStaticPaths: expected JSON but got:", text);
    return { paths: [], fallback: "blocking" };
  }
  const pages = JSON.parse(text);
  const paths = pages.map((p) => ({ params: { pageId: p.id } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { pageId } = params;

  // --- fetch page config ---
  const cfgRes = await fetch(`${API_BASE}/api/pages/${pageId}`);
  const cfgText = await cfgRes.text();
  if (!cfgRes.ok) {
    console.error(
      `Config fetch for "${pageId}" failed:`,
      cfgRes.status,
      cfgText
    );
    return { notFound: true };
  }

  let pageConfig;
  try {
    pageConfig = JSON.parse(cfgText);
  } catch (err) {
    console.error("Invalid JSON in pageConfig:", cfgText);
    return { notFound: true };
  }

  // --- fetch initial sermons ---
  const cat = encodeURIComponent(
    pageConfig.subcategories?.[0] || pageConfig.searchQuery || ""
  );
  const vidsRes = await fetch(
    `${API_BASE}/api/videos/${cat}?page=1&limit=8&sort=${
      pageConfig.defaultSort
    }`
  );
  const vidsText = await vidsRes.text();
  let sermons = [];
  if (!vidsRes.ok) {
    console.error(`Videos fetch failed for "${cat}":`, vidsRes.status, vidsText);
  } else {
    try {
      sermons = JSON.parse(vidsText);
    } catch (err) {
      console.error("Invalid JSON in sermons list:", vidsText);
    }
  }

  return {
    props: { pageConfig, sermons },
    revalidate: 60,
  };
}

export default function SermonsPage({ pageConfig, sermons }) {
  const { isFallback, query } = useRouter();
  if (isFallback) return <div>Loading…</div>;

  return (
    <>
      <Head>
        <title>{pageConfig.title} | The Spirit Hub</title>
        <meta name="description" content={pageConfig.description} />
      </Head>
      {/* this key ensures remount on slug change */}
      <Sermons
        key={query.pageId}
        initialConfig={pageConfig}
        initialSermons={sermons}
      />
    </>
  );
}