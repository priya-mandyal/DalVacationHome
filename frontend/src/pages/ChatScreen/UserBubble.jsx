import React,{useRef,useEffect} from "react";



function UserBubble({message, isUser, name}) {

    const ref = useRef();
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
      <div
      className={`w-full flex gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div>
        { (
          <p className="text-xs text-gray-400">{name}</p>
        )}
        <p
          className={`w-fit p-3 my-1 text-white bg-gray-600 rounded-lg ${
            isUser ? "rounded-tl-none" : "rounded-tr-none"
          }`}
        >
          {message}
        </p>
      </div>
      <div ref={ref}></div>
    </div>
    );
}

export default UserBubble