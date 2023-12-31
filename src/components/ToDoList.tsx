import Tabs from "../storybook_components/Tabs";
import AccordionCheckbox from "./AccordionCheckbox";
import { useLibrary } from "../contexts/LibraryContext";
import APISearch from "./APISearch";

export default function ToDoList() {
  const { todo, completed, isActive } = useLibrary();

  return (
    <div className="flex flex-col items-center w-[95vw] sm:w-[500px] sm:h-[600px] h-[calc(95vh-5rem)] rounded-md shadow-md pb-4 bg-white">
      <div className="border-b border-disabled w-full flex justify-center">
        <Tabs
          className="m-2"
          tabs={["Search Book", "To Read", "Finished"]}
          state={isActive}
        />
      </div>
      {isActive === 0 ? (
        <APISearch width="100%" />
      ) : isActive === 1 ? (
        <AccordionCheckbox
          className="h-[calc(90vh-10rem)] sm:max-h-[559px] overflow-hidden overflow-y-auto overflow-x-hidden scrollbar"
          infos={todo}
          checkbox={true}
          width="100%"
          checked={false}
          readonly={true}
        />
      ) : (
        <AccordionCheckbox
          className="h-[calc(90vh-10rem)] sm:max-h-[559px] overflow-hidden overflow-y-auto overflow-x-hidden scrollbar"
          infos={completed}
          checkbox={true}
          width="100%"
          checked={true}
          readonly={true}
        />
      )}
    </div>
  );
}
