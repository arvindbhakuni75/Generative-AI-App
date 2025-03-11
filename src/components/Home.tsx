import React, { useRef, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useChat } from "@/context/ChatContext";

const Home = () => {
  
  const { chat, setChat, currentIndex, setCurrentIndex, conversations, setConversations }: any = useChat();

  const [input, setInput] = useState("");
  // const [conversations, setConversations] = useState<any>(chat[currentIndex] || []);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  console.log("currentIndex", currentIndex);

  const generateText = async (prompt: string) => {
    try {
      const genAI = new GoogleGenerativeAI(
        "AI_KEY"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      // console.log(result.response.text());
      const newConversation = result.response.text();
      // setConversations([...conversations, {role: "AI", content: newConversation}])
      return newConversation;
    } catch (error: any) {
      console.log("Error", error.message);
      throw new Error(error.message);
    }
  };

  const animateBotResponse = (fullText: string, prevMessages: any[]) => {
    let index = 0;
    // const animationDelay = await fullText?.length < 200 ? 20 : 5;
    const interval = setInterval(
      () => {
        if (index < fullText.length) {
          setConversations([
            ...prevMessages,
            { role: "assistant", content: fullText.slice(0, index + 1) },
          ]);
          // setChats((prevChats: any) => [...prevChats, { role: "assistant", content: fullText.slice(0, index + 1)}]);
          index++;
        } else {
          clearInterval(interval);
          scrollToBottom(); // Final scroll when animation completes
        }
      },
      fullText?.length < 200 ? 20 : 5
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const newConversation = [
      ...conversations,
      { role: "user", content: input },
    ];
    setConversations(newConversation);
    scrollToBottom(); // Scroll immediately after user message
    const grokResponse = await generateText(input);
    setInput("");
    animateBotResponse(grokResponse, newConversation);
    setLoading(false);
    setChat((prevChats: any) => {
      const newChat = [...prevChats];
      newChat[currentIndex] = newConversation;
      return newChat;
    } );
  };

  // Scroll to bottom whenever conversations update
  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  // console.log("conversations", conversations);
  console.log("chats", chat); 

  return (
    <div className="w-full h-screen p-4 flex flex-col justify-center items-center bg-gray-700">
      <div className="w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg bg-gray-800">
        {/* Welcome message styled like Grok */}
        {!conversations.length && (
          <h1 className="text-2xl text-white text-center">
            How can I help you today?
          </h1>
        )}

        {/* Chat Messages */}
        {conversations.length > 0 && (
          <div
            ref={chatContainerRef}
            className="w-full h-[400px] overflow-y-auto p-2 space-y-3"
          >
            {loading && "Thinking..." }
            {conversations?.map((conversation: any, index: number) => (
              <div
                key={index}
                className={`flex ${
                  conversation.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 text-white max-w-[75%] inline-block rounded-xl ${
                    conversation.role === "user"
                      ? "bg-gray-900 text-right"
                      : "text-left"
                  }`}
                >
                  {conversation.content
                    .split("\n")
                    .map((line: string, ind: number) => {
                      const trimmedLine = line.trim();

                      // if (trimmedLine.startsWith("```")) {
                      //   return (
                      //     <pre key={ind} className="bg-black p-2 rounded-md overflow-auto">
                      //     <code>{line.replace(/```/g, "")}</code>
                      //   </pre>
                      //   )
                      // } else {
                      //   return (

                      //     <p  className="whitespace-pre-wrap">{line.trim()}</p>  
                      //   )

                      // }
                     

                      // Identify headings (e.g., "High-level:", "Versatile:", etc.)
                      if (/^[A-Za-z\s\-]+\:\s*$/.test(trimmedLine)) {
                        return (
                          <p key={ind} className="mt-3">
                            {trimmedLine.replace(":", "")}
                          </p>
                        );
                      }

                      // Convert **Bolded Headers** into just headers
                      if (/^\*\*(.+?)\*\*/.test(trimmedLine)) {
                        return (
                          <h2 key={ind} className="font-bold mt-3 text-lg">
                            {trimmedLine.replace(/\*\*(.+?)\*\*/, "$1")}
                          </h2>
                        );
                      }

                      // Convert bullet points (*, -, or •) into list items
                      if (/^\s*[-•*]\s+/.test(trimmedLine)) {
                        return (
                          <ul key={ind} className="list-disc pl-5">
                            <li>{trimmedLine.replace(/^\s*[-•*]\s+/, "")}</li>
                          </ul>
                        );
                      }

                      // Convert numbered lists (1., 2., etc.)
                      if (/^\s*\d+\.\s+/.test(trimmedLine)) {
                        return (
                          <ol key={ind} className="list-decimal pl-5">
                            <li>{trimmedLine.replace(/^\s*\d+\.\s+/, "")}</li>
                          </ol>
                        );
                      }

                      if (/\*\*/g.test(trimmedLine)) {
                        return (
                          <p key={ind} className="mt-3">
                            {trimmedLine.replace(/\*\*/g, "")}
                          </p>
                        );
                      }

                      // Default case: Normal paragraph
                      return (
                        <p key={ind} className="whitespace-pre-wrap">
                          {trimmedLine}
                        </p>
                      );
                    })}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} /> {/* Empty div for scroll target */}
          </div>
        )}

        {/* Input Field */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full p-2 bg-gray-950 rounded-lg mt-4"
        >
          <textarea
            disabled={loading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "40px"; // Reset height
              target.style.height = `${Math.min(target.scrollHeight, 300)}px`; // Adjust height dynamically
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any); // Prevent default behavior and submit
              }
            }}
            className="w-full p-2 text-white bg-transparent outline-none placeholder-gray-400 resize-none overflow-y-auto min-h-[40px] max-h-[300px]"
            placeholder="Ask anything... (Shift + Enter for new line)"
          />
          <div className="flex items-end">
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
