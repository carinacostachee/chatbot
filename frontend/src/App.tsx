import chatbotLogo from "./assets/chatbot-logo.png";

const App = () => {
  return (
    <div className="bg-pink-100 w-full h-screen flex flex-col justify-center items-center">
      <div className="box-border w-[300px] h-[570px] md:w-[450px] md:h-[700px] bg-white rounded-[30px] flex flex-col">
        <div className="flex flex-row justify-between items-center px-[20px] w-full h-[70px] md:h-[90px] bg-pink-300 rounded-t-[30px]">
          <div className="flex flex-row items-center gap-[10px] md:gap-[15px]">
            <div className="box-border w-[40px] h-[40px] rounded-[30px] md:w-[50px] md:h-[50px] md:rounded-[40px] bg-pink-400 flex flex-col items-center justify-center">
              <img
                src={chatbotLogo}
                alt="Chatbot Logo"
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
              />
            </div>
            <span className="font-playwrite text-[18px] md:text-[25px] font-bold text-pink-600">
              CarinaChat
            </span>
          </div>
          <button
            type="button"
            className="font-roboto-mono bg-white/20 box-border border border-white/20 border-[2px] hover:bg-white/50 hover:text-heading shadow-xs font-medium leading-5 rounded-[8px] md:rounded-[10px] text-xs md:text-sm px-1.5 py-1 md:px-4 md:py-2.5 text-white/80 focus:outline-none"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
