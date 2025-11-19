
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
