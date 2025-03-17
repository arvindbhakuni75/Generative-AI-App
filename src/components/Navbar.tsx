import React from "react";
import Image from "next/image";
import { MdCloudUpload } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { TbLayoutSidebarLeftExpandFilled as SidebarOpenIcon } from "react-icons/tb";
import { useChat } from "@/context/ChatContext";

function Navbar() {
  const {
    conversations,
    handleAddNewChat,
    isSidebarOpen,
    setIsSidebarOpen,
  }: any = useChat();
  return (
    <div className="w-full h-[60px] flex justify-between items-center border-b border-gray-500 text-xl text-white px-5">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <>
            <SidebarOpenIcon
              size="30px"
              className="cursor-pointer text-gray-400"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <button type="button" onClick={handleAddNewChat}>
              <IoIosAddCircle
                className="text-gray-400 cursor-pointer"
                size="30px"
              />
            </button>
          </>
        )}
        AI_Engine
      </div>
      <div className="flex items-center gap-6">
        {conversations?.length > 0 && (
          <div className="flex items-center gap-2 border border-gray-500 rounded-4xl px-2 py-1 cursor-pointer hover:bg-gray-900">
            <MdCloudUpload size={25} className="text-gray-300" />
            <span className="text-gray-300 text-[16px]">Share</span>
          </div>
        )}

        <div className="h-[40px] w-[40px] rounded-full overflow-hidden relative">
          <Image
            src="https://png.pngtree.com/thumb_back/fh260/background/20230614/pngtree-woman-in-sunglasses-standing-in-front-of-a-dark-background-image_2891237.jpg"
            alt="Profile Picture"
            fill // Makes the image fill its parent div
            className="object-cover" // Ensures proper scaling and cropping
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
