"use client";

import { useState, useRef, useEffect } from "react";

export default function GenerateSpeechPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await response.blob();
      audioUrlRef.current = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrlRef.current);
      setHasAudio(true);
      audioRef.current.play();

      //   audio.addEventListener("ended", () => {
      //     URL.revokeObjectURL(audioUrl);
      //   });
    } catch (error) {
      console.error("Error generating speech:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setHasAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && <div>Generating speech...</div>}

      {hasAudio && !isLoading && (
        <div className="flex gap-2">
          <button
            onClick={replayAudio}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Replay Audio
          </button>
        </div>
      )}

      <form
        action="submit"
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-800 shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter text to generate speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-zinc-800 p-2 border border-zinc-700 rounded shadow-xl text-zinc-100 placeholder-zinc-400"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate
        </button>
        <div className="flex gap-2">{/* Text input will apear here */}</div>
      </form>
    </div>
  );
}
