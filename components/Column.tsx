import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { AddCardForm } from './AddCardForm';
import { EditIcon } from './icons/EditIcon';
import type { Column, Id, Task } from '../types';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: Id, content: string) => void;
  onDeleteTask: (taskId: Id) => void;
  onUpdateTask: (taskId: Id, newContent: string) => void;
  onUpdateColumnWip: (columnId: Id, wip: number) => void;
  onUpdateColumnTitle: (columnId: Id, title: string) => void;
}

export const ColumnComponent: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateColumnWip,
  onUpdateColumnTitle,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'COLUMN',
    },
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(column.title);
  
  const [isEditingWip, setIsEditingWip] = useState(false);
  const [editingWip, setEditingWip] = useState(column.wip.toString());

  const wipLimitReached = column.wip > 0 && tasks.length >= column.wip;

  const handleTitleBlur = () => {
    onUpdateColumnTitle(column.id, editingTitle);
    setIsEditingTitle(false);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleTitleBlur();
    if (e.key === 'Escape') {
      setEditingTitle(column.title);
      setIsEditingTitle(false);
    }
  };

  const handleWipBlur = () => {
    const newWip = parseInt(editingWip, 10);
    if (!isNaN(newWip)) {
      onUpdateColumnWip(column.id, newWip);
    }
    setIsEditingWip(false);
  };
  
  const handleWipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleWipBlur();
    if (e.key === 'Escape') {
      setEditingWip(column.wip.toString());
      setIsEditingWip(false);
    }
  };


  return (
    <div
      ref={setNodeRef}
      className="flex flex-col bg-gray-200/70 rounded-xl shadow-sm h-full max-h-[calc(100vh-12rem)]"
    >
      <div className={`p-4 rounded-t-xl border-b-4 ${wipLimitReached ? 'border-red-500 bg-red-100' : 'border-indigo-500 bg-indigo-100'}`}>
        <div className="flex justify-between items-center gap-2">
            {isEditingTitle ? (
                <input 
                    value={editingTitle} 
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    autoFocus
                    className="font-bold text-lg bg-transparent border-b-2 border-indigo-400 focus:outline-none w-full"
                />
            ) : (
                <h2 className="font-bold text-lg cursor-pointer flex-grow" onClick={() => setIsEditingTitle(true)}>{column.title}</h2>
            )}
          
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
             {isEditingWip ? (
                 <input 
                    type="number"
                    value={editingWip} 
                    onChange={(e) => setEditingWip(e.target.value)}
                    onBlur={handleWipBlur}
                    onKeyDown={handleWipKeyDown}
                    autoFocus
                    className="w-12 text-center bg-transparent border-b-2 border-indigo-400 focus:outline-none"
                />
             ) : (
                <span 
                    onClick={() => setIsEditingWip(true)} 
                    className={`px-2 py-1 rounded-full cursor-pointer ${wipLimitReached ? 'bg-red-200 text-red-800' : 'bg-indigo-200 text-indigo-800'}`}>
                    {tasks.length} {column.wip > 0 ? `/ ${column.wip}` : ''}
                </span>
             )}
          </div>
        </div>
      </div>
      <div className="flex-grow p-2 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onUpdate={onUpdateTask} />
          ))}
        </SortableContext>
      </div>
      <div className="p-2 mt-auto">
        <AddCardForm columnId={column.id} onAddCard={onAddTask} />
      </div>
    </div>
  );
};
