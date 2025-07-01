export type Id = string;

export interface Task {
  id: Id;
  content: string;
}

export interface Column {
  id: Id;
  title: string;
  wip: number; // 0 for unlimited
  taskIds: Id[];
}

export interface BoardState {
  tasks: Record<Id, Task>;
  columns: Record<Id, Column>;
  columnOrder: Id[];
}
