import { useLibrary } from "../contexts/LibraryContext";
import Button from "../storybook_components/Button";
import reading from "../assets/images/Book lover-bro.png";

export default function BookPage() {
  const { openBook, savedNotes, dispatch } = useLibrary();

  if (!openBook) {
    return (
      <div className="w-[95vw] sm:w-[500px] h-[95vh] sm:h-[600px] mb-[5vh] sm:mb-0 flex flex-col items-center justify-center rounded-md shadow-md bg-white">
        <img className="opacity-80" src={reading} alt="woman with laptop" />
        <p className="text-sm">
          <a href="https://www.freepik.com/free-vector/book-lover-concept-illustration_7117804.htm#page=2&query=illustration%20book%20reading&position=30&from_view=search&track=country_rows_v1">
            Image by storyset
          </a>{" "}
          on Freepik
        </p>
      </div>
    );
  }

  const description = openBook.propFour?.match(/(?<=Description: ).*$/);

  return (
    <div className="w-[500px] h-[600px] rounded-md shadow-md flex flex-col items-center justify-between gap-4">
      <div className="h-40 w-full flex items-center gap-4 bg-surface px-4 pb-4 pt-6">
        <img
          className={`h-32 ${openBook.img ? "" : "hidden"}`}
          src={openBook.img}
        />
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-left text-2xl pb-2 overflow-hidden brief-title">
            {openBook.title}
          </h3>
          <p className={`text-left ${openBook.propTwo ? "" : "hidden"}`}>
            {openBook.propTwo}
          </p>
          <p className={`text-left ${openBook.propThree ? "" : "hidden"}`}>
            {openBook.propThree}
          </p>
        </div>
      </div>
      <div
        className={`${
          description ? "" : "hidden"
        } max-h-[164px] overflow-hidden overflow-y-auto scrollbar text-sm w-full px-4`}
      >
        <p className="pr-2">{description}</p>
      </div>
      <div className="w-full px-4">
        <label htmlFor="notes">Your notes</label>
        <textarea
          className="w-full bg-surface resize-none focus:outline-none h-32 p-2"
          id="notes"
          name="notes"
          value={openBook.notes}
          onChange={(e) =>
            dispatch({ type: "book/addNotes", payload: e.target.value })
          }
        ></textarea>
      </div>
      <div className="w-full flex items-center justify-between px-4 pb-6">
        <Button
          label="Remove"
          onClick={() =>
            dispatch({ type: "library/remove", payload: openBook.id })
          }
        />
        <Button
          label={savedNotes ? "Saved!" : "Save notes"}
          rank="main"
          onClick={() =>
            dispatch({
              type: "list/addNotes",
              payload: { id: openBook.id, notes: openBook.notes },
            })
          }
        />
      </div>
    </div>
  );
}
