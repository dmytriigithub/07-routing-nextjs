import { Note } from "@/types/note";
import axios from "axios";

export interface NotesHTTPResponse {
  notes: Note[];
  totalPages: number;
}

interface NoteHTTPRequest {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes(
  search: string,

  page: number,
  tag?: string
): Promise<NotesHTTPResponse> {
  const response = await axios.get<NotesHTTPResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        search,
        tag,
        page,
        perPage: 9,
      },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function createNote(newNote: NoteHTTPRequest): Promise<Note> {
  const response = await axios.post<Note>(
    `https://notehub-public.goit.study/api/notes/`,
    newNote,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${noteId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}
