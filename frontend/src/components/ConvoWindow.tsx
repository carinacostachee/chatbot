import { useState, useRef, useEffect } from "react";
import type { Message } from "../types";

const BACKEND_URL = "http://localhost:5000/query";

const ConvoWindow = ({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const [userInput, setUserInput] = useState("");

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const postMessageToBackend = async (question: string) => {
    const url = BACKEND_URL;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) {
        throw new Error(`Response.status:${response.status}`);
      }
      const result = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: result.response },
      ]);
    } catch (error) {
      console.error("Failed to send the question", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Please type a message before sending!" },
      ]);
      return;
    }

    const question = userInput;
    try {
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setLoading(true);
      setUserInput("");
      await postMessageToBackend(question);
    } catch (error) {
      console.log("Failed to submit the message", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-[20px] flex flex-col gap-[30px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "bot"
                ? "text-left flex flex-row items-end gap-[10px] justify-start"
                : "text-left flex flex-row items-end gap-[10px] justify-end"
            }
          >
            {message.role === "bot" ? (
              <>
                <div className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] rounded-full bg-pink-300 flex flex-col items-center justify-center font-roboto-mono text-pink-600 font-bold">
                  CC
                </div>
                <div className="px-2 py-1 max-w-[150px] md:px-4 md:py-2 md:max-w-[250px] rounded-t-[15px] rounded-br-[15px] bg-neutral-50 font-roboto-mono text-neutral-950 border-2 border-neutral-200 break-words">
                  {message.content}
                </div>
              </>
            ) : (
              <>
                <div className="px-2 py-1 max-w-[150px] md:px-4 md:py-2 md:max-w-[250px] rounded-t-[15px] rounded-bl-[15px] bg-neutral-50 font-roboto-mono text-neutral-950 border-2 border-neutral-200 break-words">
                  {message.content}
                </div>
                <div className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] rounded-full bg-pink-600 flex flex-col items-center justify-center font-roboto-mono text-pink-300 font-bold">
                  U
                </div>
              </>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-left flex flex-row items-end gap-[10px] justify-start">
            <div className="w-[25px] h-[25px] md:w-[32px] md:h-[32px] rounded-full bg-pink-300 flex flex-col items-center justify-center font-roboto-mono text-pink-600 font-bold">
              CC
            </div>
            <div className="px-4 py-2 rounded-t-[15px] rounded-br-[15px] bg-neutral-50 font-roboto-mono text-neutral-400 border-2 border-neutral-200">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex flex-row justify-between items-center px-[20px] w-full h-[70px] md:h-[90px] bg-pink-300 rounded-b-[30px]">
        <textarea
          value={userInput}
          placeholder="Ask anything..."
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSubmit();
          }}
          className="border-2 border-white/80 bg-neutral-50 rounded-[5px] w-[200px] h-[40px] md:w-[300px] md:h-[60px] resize-none overflow-y-auto font-roboto-mono placeholder:text-neutral-400 px-3 py-2"
        />
        <button
          type="button"
          className="font-roboto-mono bg-white/20 box-border border border-white/20 border-[2px] hover:bg-white/50 hover:text-heading shadow-xs font-medium leading-5 rounded-[8px] md:rounded-[10px] text-xs md:text-sm px-1.5 py-1 md:px-4 md:py-2.5 text-white/80 focus:outline-none"
          onClick={handleSubmit}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ConvoWindow;
