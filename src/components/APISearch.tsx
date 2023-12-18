import Accordion from "../storybook_components/Accordion";
import InputArea from "../storybook_components/InputArea";
import SvgButton from "../storybook_components/SvgButton";
import { useState, useEffect } from "react";
import { ReactComponent as Search } from "../assets/svgs/magnifying-glass-svgrepo-com.svg";
import { ReactComponent as Previous } from "../assets/svgs/left-chevron-svgrepo-com.svg";
import { ReactComponent as Next } from "../assets/svgs/right-chevron-svgrepo-com.svg";
import { useLibrary } from "../contexts/LibraryContext";

interface APISearchProps {
  width?: string;
}

export default function APISearch({ width = "300px" }: APISearchProps) {
  const { getBooks, results, query, pageNumber, dispatch } = useLibrary();
  const [isOpen, setIsOpen] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpen(null);
    dispatch({ type: "page/first" });
    getBooks(query, 1);
  }

  function handleNext() {
    if (query) {
      dispatch({ type: "page/increment" });
      setIsOpen(null);
    }
  }

  function handlePrevious() {
    if (pageNumber > 1 && query) {
      dispatch({ type: "page/decrement" });
      setIsOpen(null);
    }
  }

  function toggleText(i: number) {
    isOpen === i ? setIsOpen(null) : setIsOpen(i);
  }

  useEffect(() => {
    if (pageNumber > 0) {
      getBooks(query, pageNumber);
    }
  }, [pageNumber, getBooks, query]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-white"
      style={{ width: `${width}` }}
    >
      <InputArea
        className={`bg-surface-container ${
          pageNumber === 0 ? "" : "border-b border-disabled"
        }`}
        label="Search"
        inputType="input"
        svg={Search}
        value={query}
        setValue={(e) =>
          dispatch({ type: "query/set", payload: e.target.value })
        }
        handleSubmit={handleSubmit}
        width="100%"
      />
      <Accordion
        className="max-h-[453px] overflow-hidden overflow-y-auto scrollbar"
        infos={results}
        upperState={isOpen}
        upperSetState={toggleText}
        width={width}
      />
      <div
        className={`flex items-center justify-center bg-surface border-t border-disabled w-full ${
          pageNumber === 0 ? "hidden" : ""
        }`}
      >
        <SvgButton
          label="Previous page"
          svg={Previous}
          onClick={handlePrevious}
        />
        {pageNumber}
        <SvgButton label="Next page" svg={Next} onClick={handleNext} />
      </div>
    </div>
  );
}
