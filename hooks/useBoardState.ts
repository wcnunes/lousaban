import { useState, useEffect, useRef } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { BoardState, Id, Task } from '../types';
import { db } from '../firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const initialBoardState: BoardState = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Bem-vindo ao LousaBan! 🚀' },
    'task-2': { id: 'task-2', content: 'Seu quadro é salvo automaticamente no navegador.' },
    'task-3': { id: 'task-3', content: 'Edite uma tarefa clicando duas vezes nela.' },
    'task-4': { id: 'task-4', content: 'Mova esta tarefa para "Concluído"' },
    'task-5': { id: 'task-5', content: 'Explore os limites de WIP nas colunas.' },
    'task-6': { id: 'task-6', content: 'Clique em "Resetar Quadro" para começar do zero.' },
  },
  columns: {
    'col-1': { id: 'col-1', title: 'A Fazer', wip: 0, taskIds: ['task-1', 'task-2', 'task-3'] },
    'col-2': { id: 'col-2', title: 'Em Andamento', wip: 3, taskIds: ['task-4'] },
    'col-3': { id: 'col-3', title: 'Concluído', wip: 0, taskIds: ['task-5', 'task-6'] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};

export const useBoardState = (boardId = 'default') => {
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const isRemoteUpdate = useRef(false);
  const isFirstLoad = useRef(true);
  
  // Carregar do Firestore ao montar
  useEffect(() => {
    if (!boardId) return;
    const load = async () => {
      const docSnap = await getDoc(doc(db, 'boards', boardId));
      if (docSnap.exists()) {
        isRemoteUpdate.current = true;
        setBoardState(docSnap.data() as BoardState);
      } else {
        await setDoc(doc(db, 'boards', boardId), initialBoardState);
        isRemoteUpdate.current = true;
        setBoardState(initialBoardState);
      }
      isFirstLoad.current = false;
    };
    load();
  }, [boardId]);

  // Sincronização em tempo real
  useEffect(() => {
    if (!boardId) return;
    const unsubscribe = onSnapshot(doc(db, 'boards', boardId), (docSnap) => {
      if (docSnap.exists()) {
        isRemoteUpdate.current = true;
        setBoardState(docSnap.data() as BoardState);
      }
    });
    return () => unsubscribe();
  }, [boardId]);

  // Salvar no Firestore sempre que boardState mudar (mas não se veio do snapshot ou do primeiro carregamento)
  useEffect(() => {
    if (!boardId) return;
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    if (isFirstLoad.current) {
      return;
    }
    setDoc(doc(db, 'boards', boardId), boardState);
  }, [boardState, boardId]);

  const addTask = (columnId: Id, content: string) => {
    const newTaskId: Id = `task-${Date.now()}`;
    const newTask: Task = { id: newTaskId, content };
    setBoardState(prevState => {
      const column = prevState.columns[columnId];
      if (!column) return prevState;
      const newTaskIds = [...column.taskIds, newTaskId];
      return {
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prevState.columns,
          [columnId]: {
            ...column,
            taskIds: newTaskIds,
          }
        }
      };
    });
  };
  
  const deleteTask = (taskId: Id) => {
    setBoardState(prevState => {
      const newState = { ...prevState, tasks: { ...prevState.tasks }, columns: { ...prevState.columns }};
      const sourceColumnId = Object.keys(newState.columns).find(colId => newState.columns[colId].taskIds.includes(taskId));
      if (!sourceColumnId) return prevState;

      const sourceColumn = newState.columns[sourceColumnId];
      const newTaskIds = sourceColumn.taskIds.filter(id => id !== taskId);
      delete newState.tasks[taskId];
      
      newState.columns[sourceColumnId] = {
        ...sourceColumn,
        taskIds: newTaskIds
      };
      
      return newState;
    });
  };
  
  const updateTask = (taskId: Id, newContent: string) => {
    setBoardState(prevState => {
       const newState = {...prevState};
       newState.tasks[taskId] = { ...newState.tasks[taskId], content: newContent };
       return newState;
    });
  };
  
  const updateColumnWip = (columnId: Id, wip: number) => {
    if (wip < 0) return;
    setBoardState(prevState => {
        const newState = {...prevState};
        newState.columns[columnId] = {...newState.columns[columnId], wip: wip};
        return newState;
    });
  };

  const updateColumnTitle = (columnId: Id, title: string) => {
    if (!title.trim()) return;
    setBoardState(prevState => {
        const newState = {...prevState};
        newState.columns[columnId] = {...newState.columns[columnId], title: title};
        return newState;
    });
  };
  
  const resetBoard = () => {
    if (window.confirm("Tem certeza de que deseja resetar o quadro? Todo o progresso salvo localmente será perdido permanentemente.")) {
      setBoardState(initialBoardState);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as Id;
    const overId = over.id as Id;
    if (activeId === overId) return;
    
    setBoardState(prevState => {
        const sourceColumnId = Object.keys(prevState.columns).find(colId => prevState.columns[colId].taskIds.includes(activeId));
        const destColumnId = over.data.current?.type === 'COLUMN' ? overId : Object.keys(prevState.columns).find(colId => prevState.columns[colId].taskIds.includes(overId));
        if (!sourceColumnId || !destColumnId) return prevState;

        const newState = JSON.parse(JSON.stringify(prevState));

        if (sourceColumnId === destColumnId) {
            const sourceColumn = newState.columns[sourceColumnId];
            const oldIndex = sourceColumn.taskIds.indexOf(activeId);
            const newIndex = sourceColumn.taskIds.indexOf(overId);
            const newTaskIds = arrayMove(sourceColumn.taskIds, oldIndex, newIndex);
            newState.columns[sourceColumnId] = { ...sourceColumn, taskIds: newTaskIds };
        } else {
            const sourceColumn = newState.columns[sourceColumnId];
            const destColumn = newState.columns[destColumnId];
            const sourceTaskIds = [...sourceColumn.taskIds];
            const destTaskIds = [...destColumn.taskIds];
            
            const [movedTask] = sourceTaskIds.splice(sourceTaskIds.indexOf(activeId), 1);
            
            const destIndex = over.data.current?.type === 'COLUMN' 
              ? destTaskIds.length 
              : destTaskIds.indexOf(overId);
            
            const finalDestIndex = destIndex > -1 ? destIndex : destTaskIds.length;
            destTaskIds.splice(finalDestIndex, 0, movedTask);
            
            newState.columns[sourceColumnId] = { ...sourceColumn, taskIds: sourceTaskIds };
            newState.columns[destColumnId] = { ...destColumn, taskIds: destTaskIds };
        }
        return newState;
    });
  };

  return {
    boardState,
    addTask,
    deleteTask,
    updateTask,
    handleDragEnd,
    updateColumnWip,
    updateColumnTitle,
    resetBoard,
  };
};