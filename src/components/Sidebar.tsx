import { useChat } from '@/context/ChatContext'
import React from 'react'

const Sidebar = () => {

  const { chat, setChat, setCurrentIndex, conversations, setConversations }: any = useChat();

  const handleAddNewChat = () => {
    setChat((prev:any) => [...prev, []]);
    setCurrentIndex((prevIndex: number) => prevIndex + 1);
  }

  return (
    <div className='bg-gray-900 w-[250px] h-screen'>
      <div className="flex justify-between items-center p-2">
        <div>=</div>
        <div> || 
          <button type="button" onClick={handleAddNewChat}>+Add</button>
        </div>
      </div>
      <div className="mt-6 p-2">
        <p>Generated List</p>
        <div className='mt-2 overflow-auto'>
            {chat?.map((_:any, index:number) => (
                <div key={index} className='w-full px-2 py-2 hover:bg-black rounded-md truncate'>Generative AI</div>
            ))}
            
        </div>
      </div>
    </div>
  )
}

export default Sidebar



 