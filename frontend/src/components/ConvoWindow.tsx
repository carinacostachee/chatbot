import { useState } from "react";

interface Message {
  role: "bot" | "user";
  content: string;
}

const ConvoWindow = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const postMessageToBackend = async () => {
    const url = "http://localhost:5000/query";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userInput }),
      });
      if (!response.ok) {
        throw new Error(`Response.status:${response.status}`);
      }
      const result = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: result.response },
      ]);
      console.log(result);
    } catch (error) {
      console.log("Failed to send the question", error);
    }
  };

  const handleSubmit = async () => {
    // this if statement is to prevent the user from sending empty messages
    if (!userInput) return;
    // in the case the user's input is not empty then we can try to make the POST request to the backend
    try {
      // we add the message to the message list
      setMessages((prev) => [...prev, { role: "user", content: userInput }]);
      //then we can set the user's input back to empty
      setUserInput("");
      //we can set the loading state to true as the user is waiting for the response
      setLoading(true);
      // now it is time to make the call to the backend
      await postMessageToBackend();
      //now the loading state is false again
    } catch (error) {
      console.log("Failed to submit the message", error);
    } finally {
      setLoading(false);
    }
  };
};

export default ConvoWindow;
