"use client";
import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { CgSearchLoading } from "react-icons/cg";
import { TbLayoutSidebarLeftCollapseFilled as SidebarCloseIcon } from "react-icons/tb";
import { useChat } from "@/context/ChatContext";

const Sidebar = () => {
  const {
    chat,
    currentIndex,
    setCurrentIndex,
    setConversations,
    isSidebarOpen,
    setIsSidebarOpen,
    handleAddNewChat,
  }: any = useChat();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectChat = (index: number) => {
    setCurrentIndex(index);
    setConversations(chat[index]);
  };

  return (
    <div className="relative flex">
      <div
        className={`bg-gray-900 h-screen transition-all duration-500 ease-in-out transform ${
          isSidebarOpen ? "w-[220px]" : "w-0 -translate-x-full"
        } overflow-hidden`}
      >
        <div className="flex justify-between items-center p-2 pt-4">
          <SidebarCloseIcon
            size="30px"
            onClick={toggleSidebar}
            className="cursor-pointer text-gray-500"
          />
          <div className="flex items-center gap-x-2">
            <CgSearchLoading className="text-gray-400" size="30px" />
            <button type="button" onClick={handleAddNewChat}>
              <IoIosAddCircle
                className="text-gray-400 cursor-pointer"
                size="30px"
              />
            </button>
          </div>
        </div>
        <div className="mt-6 p-2">
          <p>Generated List</p>
        </div>
        <div className={`mt-2 overflow-auto p-2 pr-0`}>
          {chat?.map((conversation: any, index: number) => (
            <div
              key={index}
              onClick={() => handleSelectChat(index)}
              className={`w-full px-2 py-2 ${
                index !== currentIndex ? "hover:bg-black" : ""
              }  ${
                index === currentIndex ? "bg-gray-700" : ""
              } rounded-l-md truncate transition duration-300 ease-in-out`}
            >
              {conversation
                .map((message: any) => message.content)[0]
                ?.slice(0, 25) + (conversation.length && "...") ||
                "Ask anything!"}
            </div>
          ))}
        </div>
      </div>
      {/* <button
        onClick={toggleSidebar}
        className="absolute top-5 left-[220px] bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-gray-700 transition duration-300 ease-in-out"
      >
        {isOpen ? <SidebarCloseIcon size="30px" /> : <SidebarOpenIcon size="30px" />}
      </button> */}
    </div>
  );
};

export default Sidebar;
