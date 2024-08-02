import React, { useEffect, useState, useRef } from "react";
import UserBubble from "./UserBubble";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../config/firebase";
import {
  setDoc,
  doc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

const userId =  localStorage.getItem("username")



function MessagePanel({ chatId, setChatId }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const messageSubRef=useRef(null);

  useEffect(() => {

    if(messageSubRef.current){
      messageSubRef.current();
    }

    console.log("use effect triggered",chatId);
    
    if (chatId == null) {
      setMessages([]);
    } else {
      setMessages([]);
      const chatDocRef = doc(db, "tickets", chatId);
      const unsubscribe = onSnapshot(chatDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Document data:", data.messages);
          const messageList = [];
          const result = data.messages;
          result.map((msg, index) => {
              messageList.push({
                message: msg.message,
                sender: msg.sender,
                timestamp: msg.timestamp,
                agentName:data.agentname,
                userName:data.username
              });
          });

          setMessages(messageList);
        } else {
          console.log("No such document!");
        }
      });
      messageSubRef.current=unsubscribe

      return () => {
        if(messageSubRef.current){
          messageSubRef.current();
        };
      }
    }
  }, [chatId]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const userId =  localStorage.getItem("username")
    console.log(userInput, isFormSubmitted);
    if (isFormSubmitted) return;

    setIsFormSubmitted(true);
    if (!userInput) {
      toast.error("Please enter a message");
      return;
    }
    // Construct the message object
    const newMessage = {
      sender: userId,
      message: userInput,
      timestamp: Date.now(), // Using current time in milliseconds
    };
    let firebaseId =null


      console.log("chatId for second message:", chatId);
      const chatDocRef = doc(db, "tickets", chatId);

      try {
        await updateDoc(chatDocRef, {
          messages: arrayUnion(newMessage),
        });

        const conversationDocRef = doc(db, "issues", userId);
        await updateDoc(conversationDocRef, {
          [`${chatId}.lastMessageTimestamp`]: newMessage.timestamp,
          // [`${chatId}.message`]: newMessage.message,
        });

      } catch (error) {
        console.error("Error updating document: ", error);
        toast.error("Error sending message. Please try again.");
      }
    setUserInput("");

  };


  return (
    <div className="h-full w-full bg-gray-800 flex flex-col p-4 overflow-hidden">
      <div className="flex-1 flex-col overflow-y-auto p-3">
        {messages.map((message) => (
          <div key={message.timestamp}>
            {
              <UserBubble
              message={message.message}
              isUser={message.sender === userId}
              name={message.sender === userId ? "You" : message.sender===message.agentName?message.agentName:message.userName}
            />
            }
          </div>
        ))}
      </div>
      <div className=" w-full flex gap-2">
        <input
          type="text"
          name="message"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message"
          onKeyPress={handleKeyPress}
          className="w-full p-3 text-white bg-gray-600 rounded-lg focus:outline-none"
        />
        <button
          className=" p-3 bg-gray-600 rounded-lg text-white hover:bg-gray-400 "
          onClick={handleSendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MessagePanel;
