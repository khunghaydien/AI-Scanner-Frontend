'use client';

import ScannerFileUpload from '@/features/scanner/components/scanner-file-upload';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Scanner</h1>
        <ScannerFileUpload />
      </div>
    </div>
  );
}
