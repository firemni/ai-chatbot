import { redirect } from 'next/navigation';

export default function Home() {
  // For now, we'll redirect all root traffic to our research chat
  redirect('/chat');
}