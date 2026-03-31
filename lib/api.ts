import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api/notes';

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(query: string = '', page: number = 1, perPage: number = 12) {
  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    ...axiosConfig,
    params: { search: query, page, perPage },
  });
  return response.data;
}

export async function deleteNote(id: string) {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, axiosConfig);
  return response.data;
}

export async function createNote(noteData: NoteData) {
  const response = await axios.post<Note>(BASE_URL, noteData, axiosConfig);
  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, axiosConfig);
  return response.data;
}
