"use client";
import { useEffect, useRef } from "react";

const useScrollToBottom = (dependency: any) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [dependency]);

  return { chatContainerRef, chatEndRef };
};

export default useScrollToBottom;
