import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Id, Task } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: Id) => void;
  onUpdate: (taskId: Id, newContent: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const handleBlur = () => {
    if (content.trim()) {
        onUpdate(task.id, content);
    } else {
        setContent(task.content); // revert if empty
    }
    setIsEditing(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
    }
    if (e.key === 'Escape') {
        setContent(task.content);
        setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
        <div ref={setNodeRef} style={style} className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-400 shadow-md">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-transparent resize-none focus:outline-none text-gray-800"
            />
        </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow duration-200 group relative"
      onDoubleClick={() => setIsEditing(true)}
    >
      <p className="text-gray-800 break-words whitespace-pre-wrap">{task.content}</p>
      <button
        onClick={() => onDelete(task.id)}
        className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-200 hover:text-red-600 transition-opacity"
        aria-label="Deletar tarefa"
      >
        <TrashIcon />
      </button>
    </div>
  );
};
