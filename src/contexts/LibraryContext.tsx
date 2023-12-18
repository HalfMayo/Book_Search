import {
  useReducer,
  useEffect,
  createContext,
  useContext,
  useCallback,
  ReactNode,
  Dispatch,
} from "react";
import { BookProps } from "../interfaces/InfoProps";

interface LibraryProviderProps {
  children: ReactNode;
}

interface LibraryContextProps {
  todo: BookProps[];
  completed: BookProps[];
  isActive: number;
  dispatch: Dispatch<Actions>;
  results: BookProps[];
  getBooks: (topic: string, index: number) => Promise<void>;
  query: string;
  pageNumber: number;
  openBook: BookProps | null;
  savedNotes: boolean;
}

interface TabActive {
  type: "tab/active";
  payload: number;
}

interface Toggle {
  type: "toggle";
  payload: number;
}

interface ToRead {
  type: "library/toRead";
  payload: BookProps;
}

interface Read {
  type: "library/Read";
  payload: BookProps;
}

interface LoadResults {
  type: "results/loaded";
  payload: BookProps[];
}

interface RemoveToRead {
  type: "library/remove";
  payload: string;
}

interface PageFirst {
  type: "page/first";
}
interface PageIncrement {
  type: "page/increment";
}
interface PageDecrement {
  type: "page/decrement";
}

interface SetQuery {
  type: "query/set";
  payload: string;
}

interface BookOpen {
  type: "book/open";
  payload: string;
}

interface BookAddNotes {
  type: "book/addNotes";
  payload: string;
}

interface addNotes {
  id: string;
  notes: string;
}

interface ListAddNotes {
  type: "list/addNotes";
  payload: addNotes;
}

export type Actions =
  | TabActive
  | Toggle
  | ToRead
  | Read
  | LoadResults
  | RemoveToRead
  | PageFirst
  | PageIncrement
  | PageDecrement
  | SetQuery
  | BookOpen
  | ListAddNotes
  | BookAddNotes;

interface LibraryProps {
  todo: BookProps[];
  completed: BookProps[];
  isActive: number;
  results: BookProps[];
  query: string;
  pageNumber: number;
  openBook: BookProps | null;
  savedNotes: boolean;
}

const initialState: unknown[] = [];

function initializer(initialState: unknown[]) {
  const storedTodo = localStorage.getItem("booksToRead");
  const storedCompleted = localStorage.getItem("booksAlreadyRead");
  return {
    todo: storedTodo ? JSON.parse(storedTodo) : initialState,
    completed: storedCompleted ? JSON.parse(storedCompleted) : initialState,
    isActive: 0,
    results: [],
    query: "",
    pageNumber: 0,
    openBook: null,
    savedNotes: false,
  };
}

function reducer(state: LibraryProps, action: Actions) {
  switch (action.type) {
    case "tab/active":
      return { ...state, isActive: action.payload };
    case "toggle":
      if (state.isActive === 1) {
        const todosRemaining = [...state.todo];
        const todoDone = todosRemaining.splice(action.payload, 1);
        return {
          ...state,
          todo: todosRemaining,
          completed: [...state.completed, todoDone[0]],
        };
      } else if (state.isActive === 2) {
        const completedRemaining = [...state.completed];
        const completedUndone = completedRemaining.splice(action.payload, 1);
        return {
          ...state,
          completed: completedRemaining,
          todo: [...state.todo, completedUndone[0]],
        };
      } else return state;
    case "library/toRead":
      const newToRead = state.results.map((result) => {
        if (result.id === action.payload.id) {
          return { ...result, added: true };
        }
        return result;
      });
      return {
        ...state,
        todo: [...state.todo, action.payload],
        results: newToRead,
      };
    case "library/Read":
      const newRead = state.results.map((result) => {
        if (result.id === action.payload.id) {
          return { ...result, added: true };
        }
        return result;
      });
      return {
        ...state,
        completed: [...state.completed, action.payload],
        results: newRead,
      };
    case "library/remove":
      const remainingToRead = state.todo.filter(
        (td) => td.id !== action.payload
      );
      return { ...state, todo: remainingToRead, openBook: null };
    case "results/loaded":
      return { ...state, results: action.payload };
    case "page/first":
      return { ...state, pageNumber: 1 };
    case "page/increment":
      return { ...state, pageNumber: state.pageNumber + 1 };
    case "page/decrement":
      return { ...state, pageNumber: state.pageNumber - 1 };
    case "query/set":
      return { ...state, query: action.payload };
    case "book/open":
      if (state.todo.filter((td) => td.id === action.payload).length > 0) {
        const [openBook] = state.todo.filter((td) => td.id === action.payload);
        return {
          ...state,
          openBook: state.openBook?.id === action.payload ? null : openBook,
          savedNotes: false,
        };
      } else if (
        state.completed.filter((cp) => cp.id === action.payload).length > 0
      ) {
        const [openBook] = state.completed.filter(
          (cp) => cp.id === action.payload
        );
        return {
          ...state,
          openBook: state.openBook?.id === action.payload ? null : openBook,
          savedNotes: false,
        };
      }
      return { ...state };
    case "book/addNotes":
      return {
        ...state,
        openBook: state.openBook
          ? { ...state.openBook, notes: action.payload }
          : null,
      };
    case "list/addNotes":
      if (state.todo.filter((td) => td.id === action.payload.id).length > 0) {
        const todoNotes = state.todo.map((td) => {
          if (td.id === action.payload.id) {
            return { ...td, notes: action.payload.notes };
          }
          return td;
        });
        return { ...state, todo: todoNotes, savedNotes: true };
      } else if (
        state.completed.filter((cp) => cp.id === action.payload.id).length > 0
      ) {
        const completedNotes = state.completed.map((cp) => {
          if (cp.id === action.payload.id) {
            return { ...cp, notes: action.payload.notes };
          }
          return cp;
        });
        return { ...state, completed: completedNotes, savedNotes: true };
      }
      return { ...state };
    default:
      throw new Error("Wtf?!");
  }
}

const LibraryContext = createContext<LibraryContextProps | undefined>(
  undefined
);

function LibraryProvider({ children }: LibraryProviderProps) {
  const [
    {
      todo,
      completed,
      isActive,
      results,
      query,
      pageNumber,
      openBook,
      savedNotes,
    },
    dispatch,
  ] = useReducer(reducer, initialState, initializer);

  const getBooks = useCallback(
    async (topic: string, index: number) => {
      const apiUrl = `/.netlify/functions/getBooks?topic=${topic}&index=${index}`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { accept: "application/json" },
        });
        const { data } = await response.json();
        dispatch({
          type: "results/loaded",
          payload: data.map((book: any) => {
            return {
              id: book.id,
              img: book.volumeInfo.imageLinks?.thumbnail,
              title: book.volumeInfo.title,
              subtitle: book.volumeInfo.authors
                ? book.volumeInfo.authors.join(", ")
                : "-",
              propOne: `Title: ${book.volumeInfo.title}`,
              propTwo: `Author: ${
                book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "-"
              }`,
              propThree: `Year: ${book.volumeInfo.publishedDate
                ?.match(/[0-9]{4}/)
                .join("")}`,
              propFour: `Description: ${
                book.volumeInfo.description ? book.volumeInfo.description : "-"
              }`,
              added:
                todo.filter((td) => td.id === book.id).length > 0 ||
                completed.filter((cp) => cp.id === book.id).length > 0
                  ? true
                  : false,
              notes: "",
            };
          }),
        });
      } catch (err) {
        console.log(err);
      }
    },
    [todo, completed]
  );

  useEffect(() => {
    localStorage.setItem("booksToRead", JSON.stringify(todo));
  }, [todo]);

  useEffect(() => {
    localStorage.setItem("booksAlreadyRead", JSON.stringify(completed));
  }, [completed]);

  return (
    <LibraryContext.Provider
      value={{
        todo,
        completed,
        isActive,
        dispatch,
        results,
        query,
        pageNumber,
        getBooks,
        openBook,
        savedNotes,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined)
    throw new Error("Context was used outside of Provider");
  return context;
}

export { LibraryProvider, useLibrary };
