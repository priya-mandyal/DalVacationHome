import React from 'react';

const DialogflowChatbot = ({ onClose }) => {
  return (
    <div className="fixed bottom-16 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>
      <iframe
        allow="microphone;"
        width="350"
        height="430"
        src="https://console.dialogflow.com/api-client/demo/embedded/a0e90ff8-09d0-4cda-a3e9-ad790f31f400"
        title="Dialogflow Chatbot"
      ></iframe>
    </div>
  );
};

export default DialogflowChatbot;
