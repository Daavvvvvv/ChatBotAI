// src/app/page.tsx
import ChatComponent from "@/components/ChatComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8 text-center lg:text-center">
          RevAIsor <span className="text-primary">AI Assistant</span>
        </h1>
      </div>

      <ChatComponent />

      <div className="mb-32 mt-8 flex text-center lg:text-left">
        <p className="text-sm text-muted-foreground">
          RevAIsor AI Integration - Technical Test
        </p>
      </div>
    </main>
  );
}
