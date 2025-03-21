"use client";
import React, {
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { createContext } from "react";

interface ChatContextType {
  chat: any[];
  setChat: Dispatch<SetStateAction<any[]>>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  conversations: any[];
  setConversations: Dispatch<SetStateAction<any[]>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  handleAddNewChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const storedChat = JSON.parse(localStorage.getItem('chat') || "[]");
  const [chat, setChat] = useState<any[]>( storedChat || []);
  const [input, setInput] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [conversations, setConversations] = useState<any>(
    storedChat.length ? storedChat[0] : []
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleAddNewChat = () => {
    if (!conversations.length) return;
    setChat((prev: any) => [[], ...prev]);
    setCurrentIndex(0);
    setConversations([]);
    setInput("");
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        setChat,
        input,
        setInput,
        currentIndex,
        setCurrentIndex,
        conversations,
        setConversations,
        isSidebarOpen,
        setIsSidebarOpen,
        handleAddNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
