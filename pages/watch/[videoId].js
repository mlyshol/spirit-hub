import { useRouter } from "next/router";
import Head from "next/head";
import Watch from "../../components/watch";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://faith-hub-backend.onrender.com";

export async function getStaticPaths() {
  // Fetch a list of published videos to pre-build some paths.
  // Adjust the endpoint and query parameters as needed.
  const res = await fetch(`${API_BASE}/api/videos?status=Published&page=1&limit=20`);
  const text = await res.text();
  if (!res.ok) {
    console.error("getStaticPaths for videos: expected JSON but got:", text);
    return { paths: [], fallback: "blocking" };
  }
  
  let videos = [];
  try {
    videos = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON in videos list:", text);
  }
  
  const paths = videos.map((video) => ({
    params: { videoId: video._id.toString() }, // Ensure video._id is in string format
  }));
  
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { videoId } = params;

  // Fetch details for a single video from your API.
  const res = await fetch(`${API_BASE}/api/video/${videoId}`);
  const text = await res.text();
  if (!res.ok) {
    console.error(`Video fetch failed for "${videoId}":`, res.status, text);
    return { notFound: true };
  }
  
  let video;
  try {
    video = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON in video:", text);
    return { notFound: true };
  }
  
  return {
    props: { video },
    revalidate: 60,
  };
}

export default function VideoPage({ video }) {
  const { isFallback, query } = useRouter();
  if (isFallback) return <div>Loading…</div>;
  
  return (
    <>
      <Head>
        <title>{video.title} | The Spirit Hub</title>
        <meta name="description" content={video.description} />
      </Head>
      {/* The key prop ensures a remount on the route change */}
      <Watch video={video} key={query.videoId} />
    </>
  );
}