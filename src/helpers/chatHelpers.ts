import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateText = async (prompt: string) => {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_AI_API_KEY as string
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("AI Error:", error.message);
    return `Error: ${error.message}`;
  }
};

export const animateAiResponse = (
  fullText: string,
  prevMessages: any[],
  setConversations: any,
  setChat: any,
  currentIndex: number
) => {
  let index = 0;
  const textLength = fullText.length;
  const chunkSize =
    textLength > 6000
      ? 500
      : textLength > 5000
      ? 15
      : textLength > 500
      ? 8
      : textLength > 200
      ? 5
      : 3;

  const interval = setInterval(() => {
    if (index < textLength) {
      setConversations(() => {
        const updatedConversations = [
          ...prevMessages,
          { role: "assistant", content: fullText.slice(0, index + chunkSize) },
        ];
        setChat((prevChat: any) => {
          const newChat = [...prevChat];
          newChat[currentIndex] = updatedConversations;
          return newChat;
        });
        return updatedConversations;
      });
      index += chunkSize;
    } else {
      clearInterval(interval);
    }
  }, 10);
};
