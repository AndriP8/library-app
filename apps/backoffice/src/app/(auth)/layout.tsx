export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto h-auto min-h-screen w-full max-w-[625px] px-4 py-32">
      {children}
    </main>
  );
}
