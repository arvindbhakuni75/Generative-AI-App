"use client";
import React, { ReactNode, useContext, useState, Dispatch, SetStateAction } from "react";
import { createContext } from "react";

interface ChatContextType {
    chat: any[];
    setChat: Dispatch<SetStateAction<any[]>>;
    currentIndex: number;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
    conversations: any[];
    setConversations: Dispatch<SetStateAction<any[]>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode}) => {

    const [chat, setChat] = useState<any[]>([]);    
    const [currentIndex, setCurrentIndex] = useState<number>(chat?.length);
      const [conversations, setConversations] = useState<any>(chat[currentIndex] || []);

    return <ChatContext.Provider value={{chat, setChat, currentIndex, setCurrentIndex, conversations, setConversations}}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
    return useContext(ChatContext);
}

