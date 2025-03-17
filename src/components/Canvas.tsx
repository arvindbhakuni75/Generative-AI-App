"use client";

import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export interface ConversationTypes {
  role: string;
  content: string;
}

interface CanvasProps {
  conversation: ConversationTypes;
};

const Canvas = ({conversation}: CanvasProps) => {

   const handleCopyCode = (code: string, buttonRef: any) => {
      navigator.clipboard.writeText(code).then(() => {
        if (buttonRef.current) {
          buttonRef.current.textContent = "Copied!";
          setTimeout(() => {
            if (buttonRef.current) {
              buttonRef.current.textContent = "Copy";
            }
          }, 1500); // Revert after 1.5 seconds
        }
      });
    };

  return (
    <div
      className={`flex ${
        conversation.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 text-white inline-block rounded-xl break-words whitespace-pre-wrap overflow-hidden ${
          conversation.role === "user"
            ? "bg-gray-900 max-w-[75%]"
            : "text-left max-w-[100%]"
        }`}
      >
        <ReactMarkdown
          children={conversation.content}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const codeString = String(children).replace(/\n$/, "");
              const buttonRef = useRef<HTMLButtonElement>(null);
              return !inline && match ? (
                <div className="relative">
                  <SyntaxHighlighter
                    children={codeString}
                    style={dracula}
                    language={language}
                    PreTag="div"
                    {...props}
                  />
                  <button
                    ref={buttonRef}
                    className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded-md text-sm hover:bg-gray-700"
                    onClick={() => handleCopyCode(codeString, buttonRef)}
                  >
                    Copy
                  </button>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default Canvas;
