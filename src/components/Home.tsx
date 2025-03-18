"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import Navbar from "./Navbar";
import Canvas from "./Canvas";
import QueryField from "./QueryField";
import useScrollToBottom from "@/hooks/useScrollToBottom";
import { generateText, animateAiResponse } from "@/helpers/chatHelpers";

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
  const { chatContainerRef, chatEndRef } = useScrollToBottom(conversations);
  const [loading, setLoading] = useState(false);

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
      setInput("");
      setConversations((prev: any) => [
        ...prev,
        { role: "assistant", content: "Thinking..." },
      ]);

      try {
        const aiResponse = await generateText(input);
        animateAiResponse(
          aiResponse,
          newConversation,
          setConversations,
          setChat,
          currentIndex
        );
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
    if (chat.length > 0) {
      localStorage.setItem("chat", JSON.stringify(chat));
    }
  }, [chat]);

  return (
    <div
      className={`w-full h-screen max-h-screen bg-gray-700 ${
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
          {!conversations.length ? (
            <h1 className="text-2xl text-white text-center mb-4">
              How can I help you today?
            </h1>
          ) : (
            <div
              ref={chatContainerRef}
              className="w-full max-w-3xl h-[75vh] overflow-y-auto p-2 space-y-3"
            >
              {conversations.map((conversation: any, index: number) => (
                <Canvas key={index} conversation={conversation} />
              ))}
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
