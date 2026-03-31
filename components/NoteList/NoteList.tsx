import Link from 'next/link';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const QueryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess() {
      QueryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError(error) {
      console.error('Failed to delete note:', error);
    },
  });

  const noteGrid = notes.map((note: Note) => {
    return (
      <li key={note.id} className={css.listItem}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <Link href={`/notes/${note.id}`} className={css.link}>
            View details
          </Link>
          <button className={`${css.button} ${css.delete}`} onClick={() => mutate(note.id)}>
            Delete
          </button>
        </div>
      </li>
    );
  });

  return <ul className={css.list}>{noteGrid}</ul>;
}
