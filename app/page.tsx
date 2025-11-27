import { TypingGame } from "@/components/TypingGame";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text">
      <TypingGame />
    </main>
  );
}
