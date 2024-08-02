import React, { useState,useEffect } from "react";
import {  db } from "../../config/firebase";
import { v4 as uuid} from "uuid";

import {
  setDoc,
  doc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

function ChatList({chatId,setChatId}) {
  
  const [chats, setChats] = useState([]);
  const userId = localStorage.getItem("username")

  const handleNewChat = () => {
    setChatId(null);
  };
  useEffect(() =>  {

    let unsubscribe= () => {}; 
    const getChats = async () => {
      const conversationDocRef = doc(db, "issues", userId);

      const snapshot =await getDoc(conversationDocRef);

      if (!snapshot.exists()) {
        const newChatId = uuid();
          await setDoc(doc(db,"issues",userId), {
            [newChatId]: {
              email:userId,
              firstMessage: "New Conversation",
              lastMessageTimestamp: Date.now(),
            }
          })
      }

       unsubscribe = onSnapshot(conversationDocRef, async (doc) =>  {
      
        if (doc.exists()) {
          const data = doc.data();
          console.log("Document data:", data.messages);
          const messageList = [];
          console.log(data);
          Object.keys(data).forEach((key) => {
            if(data[key].email!=null){
              return;
            }
            messageList.push({
              message:  data[key].firstMessage,
              lastMessageTimestamp: data[key].lastMessageTimestamp,
              id: key,
            });
          })
          setChats(messageList);
        } 
      });
    }

      getChats();
      return () => unsubscribe();
  }, []);

  const handleChatClick = (id) => {

    setChatId(id);
  };

  return (
    <div className=" h-full w-full pt-4 px-2 text-white overflow-y-auto">
      <div className="flex justify-center p-4 ">
      </div>
      <div
          className=" p-4 border-b border-gray-500 hover:bg-gray-800 hover:cursor-pointer hover:rounded-lg"
        >
           <p className="truncate">Your Tickets</p>
        </div>
      {chats.length > 0 &&
        chats.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp).map((chat, key) => (
        <div
          key={key}
          onClick={() => handleChatClick(chat.id)}
          className={`p-4 border-b border-gray-500 ${chat.id === chatId && "bg-gray-800"} hover:bg-gray-800 hover:cursor-pointer hover:rounded-lg`}
        >
           <p className="truncate">Ticket Id: {chat.id}</p>
          <p className="truncate">{chat.message}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
