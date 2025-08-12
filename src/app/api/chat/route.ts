import { UIMessage, streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: [
        // {
        //   role: "system",
        //   content:
        //     // example 1 of system prompt
        //     // "You are a friendly teacher who explains using simple analogies. Always relate technical concepts to everyday experiences.",
        //     // example 2 of system prompt
        //     // content:
        //     //   "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.",
        // },

        // example of few-shot learning
        // These messages are model messages and are diffrent from UI messsages.
        {
          role: "system",
          content: "Convert user question about React into code examples.",
        },
        {
          role: "user",
          content: "How to toggle a boolean?",
        },
        {
          role: "assistant",
          content:
            "const [isOpen, setIsOpen] = useState(false); \n const toggle() = () => setIsOpen(!isOpen);",
        },
        ...convertToModelMessages(messages),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error streamin chat completion", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
