import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat | Roo Code Boss Research',
  description: 'AI-powered research assistant with chat interface',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      {children}
    </main>
  );
}
