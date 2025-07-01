import React, { useState } from 'react';
import type { Id } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface AddCardFormProps {
  columnId: Id;
  onAddCard: (columnId: Id, content: string) => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ columnId, onAddCard }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddCard(columnId, content.trim());
      setContent('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center justify-center w-full p-2 text-gray-500 hover:bg-gray-300 hover:text-gray-700 rounded-lg transition-colors"
      >
        <PlusIcon />
        <span className="ml-2">Adicionar tarefa</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-1">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite o conteúdo da tarefa..."
        autoFocus
        onBlur={() => {
            if(!content.trim()) setIsAdding(false)
        }}
        className="w-full p-2 mb-2 bg-white rounded-lg shadow-inner border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="px-4 py-2 text-gray-600 hover:bg-gray-300 rounded-lg transition-colors text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
