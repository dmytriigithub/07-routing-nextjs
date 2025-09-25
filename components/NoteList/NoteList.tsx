// components/NoteList/NoteList.tsx

import { Note } from "@/types/note";
import Link from "next/link";
import css from "./NoteList.module.css";

type NoteListProps = {
  notes: Note[];
  handleDeleteNote: (id: string) => void;
};

const NoteList = ({ notes, handleDeleteNote }: NoteListProps) => {
  if (!notes.length) {
    return <p>No notes available.</p>;
  }
  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li className={css.listItem} key={id}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <Link className={css.link} href={`/notes/${id}`}>
              View details
            </Link>
            <button className={css.button} onClick={() => handleDeleteNote(id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
