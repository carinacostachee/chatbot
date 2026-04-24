import ConvoWindow from "./components/ConvoWindow";
import Header from "./components/Header";
import { useState } from "react";
import type { Message } from "./types";

const INITIAL_MESSAGES: Message[] = [
  {
    role: "bot",
    content:
      "Hey there! I'm CarinaChat, your personal AI assistant. What's on your mind?",
  },
];

const App = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleClear = () => setMessages(INITIAL_MESSAGES);
  return (
    <div className="bg-pink-100 w-full h-screen flex flex-col justify-center items-center">
      <div className="box-border w-[300px] h-[570px] md:w-[450px] md:h-[700px] max-h-[90vh] bg-white rounded-[30px] flex flex-col relative overflow-hidden">
        <Header onClear={handleClear} />
        <ConvoWindow messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default App;
