import BookPage from "./components/BookPage";
import Header from "./components/Header";
import ToDoList from "./components/ToDoList";
import { LibraryProvider } from "./contexts/LibraryContext";

function App() {
  return (
    <>
      <Header />
      <div className="w-[95vw] mx-auto flex flex-col sm:flex-row mt-20 sm:mt-0 items-center justify-center gap-8 sm:gap-4 sm:h-screen">
        <LibraryProvider>
          <ToDoList />
          <BookPage />
        </LibraryProvider>
      </div>
    </>
  );
}

export default App;
