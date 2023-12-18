import BookPage from "./components/BookPage";
import Header from "./components/Header";
import ToDoList from "./components/ToDoList";
import { LibraryProvider } from "./contexts/LibraryContext";

function App() {
  return (
    <>
      <Header />
      <div className="flex flex-col sm:flex-row mt-20 items-center justify-center gap-4 h-screen w-full">
        <LibraryProvider>
          <ToDoList />
          <BookPage />
        </LibraryProvider>
      </div>
    </>
  );
}

export default App;
