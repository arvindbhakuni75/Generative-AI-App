"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useChat } from "@/context/ChatContext";
import Navbar from "./Navbar";
import Canvas, { ConversationTypes } from "./Canvas";
import QueryField from "./QueryField";

const Home = () => {
  const {
    chat,
    setChat,
    input,
    setInput,
    currentIndex,
    conversations,
    setConversations,
  }: any = useChat();

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

  const generateText = async (prompt: string) => {
    try {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_AI_API_KEY as string
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const newConversation = result.response.text();
      return newConversation;
    } catch (error: any) {
      console.error("Error generating text:", error.message);
      return `Error: ${error.message}`;
    }
  };

  const animateAiResponse = (fullText: string, prevMessages: string[]) => {
    let index = 0;
    const textLength = fullText.length;
    let chunkSize = 3;
    if (textLength > 6000) chunkSize = 500;
    else if (textLength > 5000) chunkSize = 15;
    else if (textLength > 500) chunkSize = 8;
    else if (textLength > 200) chunkSize = 5;

    const interval = setInterval(() => {
      if (index < textLength) {
        setConversations(() => {
          const updatedConversations = [
            ...prevMessages,
            {
              role: "assistant",
              content: fullText.slice(0, index + chunkSize),
            },
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
        scrollToBottom();
      }
    }, 10);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim()) return;
      setLoading(true);
      const newConversation = [
        ...conversations,
        { role: "user", content: input },
      ];
      setConversations(newConversation);
      scrollToBottom();
      setInput("");
      setConversations((prev: any) => [
        ...prev,
        { role: "assistant", content: "Thinking..." },
      ]);
      try {
        const aiResponse = await generateText(input);
        animateAiResponse(aiResponse, newConversation);
      } catch (error) {
        setConversations((prev: any) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `Error: ${error}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input]
  );

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  return (
    <div
      className={`w-full h-screen max-h-screen items-center bg-gray-700 ${
        !conversations.length && "justify-center"
      }`}
    >
      <Navbar />
      <div
        className={`w-full h-[calc(100vh-60px)] flex flex-col items-center ${
          !conversations.length && "justify-center"
        }`}
      >
        <div
          className={`w-full flex justify-center ${
            conversations.length && "h-[75vh]"
          } mx-auto`}
        >
          {!conversations.length && (
            <h1 className="text-2xl text-white text-center mb-4">
              How can I help you today?
            </h1>
          )}
          {conversations.length > 0 && (
            <div
              ref={chatContainerRef}
              className="w-full max-w-3xl h-[75vh] overflow-y-auto p-2 space-y-3"
            >
              {conversations?.map(
                (conversation: ConversationTypes, index: number) => (
                  <Canvas key={index} conversation={conversation} />
                )
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
        <QueryField
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          loading={loading}
          conversations={conversations}
        />
      </div>
    </div>
  );
};

export default Home;
