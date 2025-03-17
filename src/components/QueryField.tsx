import React, { useEffect, useRef } from "react";

interface QueryFieldProps {
    conversations: string[];
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e: any) => void;
    loading: boolean;
};

const QueryField = ({
  conversations,
  input,
  setInput,
  handleSubmit,
  loading,
}: QueryFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // Reset height for recalculation
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300
      )}px`; // Expand up to 300px
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full p-2 bg-gray-950 rounded-lg  z-10 max-w-3xl ${
        conversations.length ? "fixed bottom-6" : ""
      }`}
    >
      <textarea
        ref={textareaRef}
        disabled={loading}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          adjustTextareaHeight();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
          }
        }}
        className="w-full p-2 text-white bg-transparent outline-none placeholder-gray-400 resize-none overflow-y-auto h-[40px] max-h-[300px]"
        placeholder="Generate anyText... (Shift + Enter for new line)"
      />

      <div className="flex items-end">
        <button
          type="submit"
          className="ml-2 px-4 h-[38px] py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default QueryField;
