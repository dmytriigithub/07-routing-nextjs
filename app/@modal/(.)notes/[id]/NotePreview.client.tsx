"use client";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const NotePreviewClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const closeModal = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error || !note) return <p>Some error..</p>;

  return (
    <Modal onClose={closeModal}>
      <button className={css.backBtn} onClick={closeModal}>
        ← Back
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
