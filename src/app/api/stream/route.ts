import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
// import { anthropic } from "@ai-sdk/anthropic";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      // model: anthropic("claude-sonnet-4-20250514"),
      prompt: prompt,
    });
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streamin text", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}
