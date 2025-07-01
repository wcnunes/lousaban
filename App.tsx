import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Board } from './components/Board';
import { useBoardState } from './hooks/useBoardState';
import type { BoardState } from './types';
import { ResetIcon } from './components/icons/ResetIcon';
import { v4 as uuidv4 } from 'uuid';

function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const {
    boardState,
    addTask,
    deleteTask,
    updateTask,
    handleDragEnd,
    updateColumnWip,
    updateColumnTitle,
    resetBoard,
  } = useBoardState(boardId);

  const generateExportHtml = (state: BoardState): string => {
    const date = new Date().toLocaleString('pt-BR');
    const totalTasks = Object.keys(state.tasks).length;

    const columnsHtml = state.columnOrder.map(columnId => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map(taskId => state.tasks[taskId]);
        const wipLimit = column.wip > 0 ? `/ ${column.wip}` : '';
        
        const tasksHtml = tasks.length > 0
            ? `<ul class="task-list">
                ${tasks.map(task => `<li class="task-item">${task.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`).join('')}
               </ul>`
            : `<p class="no-tasks">Nenhuma tarefa nesta coluna.</p>`;

        return `
            <section class="column">
                <h2>${column.title} <span>(${tasks.length}${wipLimit})</span></h2>
                ${tasksHtml}
            </section>
        `;
    }).join('');
    
    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Relatório do Processo - LousaBan</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; background-color: #f4f7f6; }
            .container { max-width: 840px; margin: 2rem auto; padding: 2rem; background-color: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; }
            header { text-align: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 1rem; margin-bottom: 2rem; }
            h1 { color: #2c3e50; margin: 0; }
            h2 { color: #34495e; border-bottom: 1px solid #eaeaea; padding-bottom: 0.5rem; margin-top: 2rem; }
            h2 span { font-size: 0.9em; color: #7f8c8d; font-weight: 500; }
            .column { margin-bottom: 2.5rem; page-break-inside: avoid; }
            .task-list { list-style: none; padding: 0; }
            .task-item { background: #fdfdfd; border: 1px solid #e8e8e8; padding: 0.75rem 1rem; margin-bottom: 0.5rem; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); white-space: pre-wrap; word-wrap: break-word; }
            .summary, .print-controls { background: #ecf0f1; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
            .summary p { margin: 0.5rem 0; }
            .no-tasks { color: #95a5a6; font-style: italic; }
            .print-button { display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; border: none; font-size: 16px; cursor: pointer; transition: background-color 0.3s; }
            .print-button:hover { background-color: #4338ca; }
            .footer { text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e0e0e0; font-size: 0.9em; color: #7f8c8d; }
            @media print {
                body { background-color: #fff; }
                .container { box-shadow: none; border: 1px solid #ddd; margin: 0; padding: 1rem; max-width: 100%; border-radius: 0; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>Relatório de Processo LousaBan</h1>
            </header>
            
            <div class="print-controls no-print">
                 <p>Documento gerado para apresentação ou impressão.</p>
                 <button class="print-button" onclick="window.print()">Imprimir ou Salvar como PDF</button>
            </div>

            <section class="summary">
                <h2>Resumo do Quadro</h2>
                <p><strong>Data de Exportação:</strong> ${date}</p>
                <p><strong>Total de Colunas:</strong> ${state.columnOrder.length}</p>
                <p><strong>Total de Tarefas:</strong> ${totalTasks}</p>
            </section>

            <main>
                ${columnsHtml}
            </main>
            
            <footer class="footer">
                <p>Relatório gerado por LousaBan</p>
            </footer>
        </div>
    </body>
    </html>
    `;
  };
  
  const handleExport = () => {
    const htmlContent = generateExportHtml(boardState);
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } else {
        alert('Por favor, habilite pop-ups para exportar o quadro.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <header className="p-4 sm:p-6 shadow-md bg-white/60 backdrop-blur-sm sticky top-0 z-20 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Lousa<span className="text-indigo-600">Ban</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quadro: <span className="font-mono">{boardId}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={resetBoard}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
            aria-label="Resetar o quadro"
          >
            <ResetIcon />
            Resetar Quadro
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
            aria-label="Exportar quadro para impressão"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Exportar para Impressão
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
            aria-label="Copiar link do quadro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 015.656 5.656l-3.535 3.535a4 4 0 01-5.657-5.657m1.415-1.414a4 4 0 00-5.657 5.657l3.535 3.535a4 4 0 005.657-5.657" />
            </svg>
            Compartilhar Link
          </button>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <Board
          boardState={boardState}
          onDragEnd={handleDragEnd}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
          onUpdateColumnWip={updateColumnWip}
          onUpdateColumnTitle={updateColumnTitle}
        />
      </main>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const handleNewBoard = () => {
    const newId = uuidv4();
    navigate(`/board/${newId}`);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Lousa<span className="text-indigo-600">Ban</span></h1>
      <p className="mb-8 text-lg text-gray-600">Crie e compartilhe quadros Kanban facilmente!</p>
      <button
        onClick={handleNewBoard}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
      >
        Criar novo quadro
      </button>
      <p className="mt-8 text-gray-500">Ou acesse um quadro existente pelo link compartilhado.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
    </Routes>
  );
}

export default App;