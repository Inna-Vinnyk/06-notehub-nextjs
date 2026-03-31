'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';

import { fetchNotes } from '../../lib/api';

// Импортируем компоненты из папки components
import NoteList from '../../components/NoteList/NoteList';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SearchBox from '../../components/SearchBox/SearchBox';

import css from './Notes.module.css';

export default function NotesClient() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TanStack Query запрос
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
  });

  const updateQuery = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  }, 1000);

  const notes = data?.notes || [];
  const totalPages = data?.totalPages ?? 1;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={updateQuery} />
          {totalPages > 1 && (
            <Pagination totalPages={totalPages} page={page} onPageChange={setPage} />
          )}
          <button className={css.button} onClick={handleOpenModal}>
            Create note +
          </button>
        </header>

        <main>
          {isLoading && <Loader />}

          {(isError || (isSuccess && notes.length === 0)) && <ErrorMessage />}

          {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
        </main>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </>
  );
}
