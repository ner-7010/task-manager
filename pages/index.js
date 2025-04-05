// pages/index.js

import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../components/Home'), { ssr: false });

export default function IndexPage() {
  return <Home />;
}
