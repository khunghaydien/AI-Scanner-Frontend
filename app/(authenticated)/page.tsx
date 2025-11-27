import dynamic from 'next/dynamic';
const Home = dynamic(() => import('@/features/home'), {
    ssr: false,
});

export default function HomePage() {
    return <Home />;
}