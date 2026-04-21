import Header from "./components/Header";

const App = () => {
  return (
    <div className="bg-pink-100 w-full h-screen flex flex-col justify-center items-center">
      <div className="box-border w-[300px] h-[570px] md:w-[450px] md:h-[700px] bg-white rounded-[30px] flex flex-col">
        <Header />
      </div>
    </div>
  );
};

export default App;
