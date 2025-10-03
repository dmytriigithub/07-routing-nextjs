"use client";

import css from "./page.module.css";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes, NotesHTTPResponse } from "@/lib/api";
import { useEffect, useState } from "react";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

interface NoteClientProps {
  filter: string | undefined;
}

const NoteClient = ({ filter }: NoteClientProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, error, isSuccess } = useQuery<NotesHTTPResponse>({
    queryKey: ["notes", searchQuery, filter, page],
    queryFn: () => fetchNotes(searchQuery, page, filter),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isSuccess && data && data.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, data]);

  const totalPages = data?.totalPages ?? 0;

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setSearchQuery(e.target.value);
    },
    300
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Some error..</p>;
  if (!data?.notes.length) return <p>No notes found</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox updateSearchQuery={updateSearchQuery} />
        {isSuccess && data?.totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </div>
      <Toaster />

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default NoteClient;
