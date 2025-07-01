import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ColumnComponent } from './Column';
import type { BoardState, Id } from '../types';

interface BoardProps {
  boardState: BoardState;
  onDragEnd: (event: DragEndEvent) => void;
  onAddTask: (columnId: Id, content: string) => void;
  onDeleteTask: (taskId: Id) => void;
  onUpdateTask: (taskId: Id, newContent: string) => void;
  onUpdateColumnWip: (columnId: Id, wip: number) => void;
  onUpdateColumnTitle: (columnId: Id, title: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  boardState,
  onDragEnd,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateColumnWip,
  onUpdateColumnTitle
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require pointer to move 8px to start a drag
      },
    })
  );

  const taskIds = Object.keys(boardState.tasks);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={taskIds}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {boardState.columnOrder.map(columnId => {
            const column = boardState.columns[columnId];
            const tasks = column.taskIds.map(taskId => boardState.tasks[taskId]);

            return (
              <ColumnComponent
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
                onUpdateTask={onUpdateTask}
                onUpdateColumnWip={onUpdateColumnWip}
                onUpdateColumnTitle={onUpdateColumnTitle}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
