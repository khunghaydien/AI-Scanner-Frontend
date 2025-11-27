import dynamic from 'next/dynamic';
const FileDetail = dynamic(() => import('@/features/document/file-detail'), {
    ssr: false,
});

export default function page() {
    return <FileDetail />;
}