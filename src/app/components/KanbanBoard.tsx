import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Plus, X, Tag } from 'lucide-react';
import { EditableText } from './EditableText';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

interface Task {
  id: string;
  title: string;
  description: string;
  labels: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const ItemType = 'TASK';

interface DragItem {
  id: string;
  columnId: string;
  index: number;
}

const LABEL_STYLES: Record<string, string> = {
  'Product Strategy': 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'Product Discovery': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  'Product Delivery': 'bg-purple-500/15 text-purple-300 border-purple-500/25',
};

const COLUMN_ACCENTS: Record<string, string> = {
  backlog: 'bg-slate-400',
  'in-progress': 'bg-blue-400',
  review: 'bg-amber-400',
  done: 'bg-emerald-400',
};

function KanbanTask({
  task, columnId, index, onUpdate, onDelete,
}: {
  task: Task;
  columnId: string;
  index: number;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
}) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { id: task.id, columnId, index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });

  const [showLabelInput, setShowLabelInput] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const availableLabels = ['Product Strategy', 'Product Discovery', 'Product Delivery'];

  const addLabel = (label: string) => {
    if (label && !task.labels.includes(label)) {
      onUpdate({ ...task, labels: [...task.labels, label] });
    }
    setNewLabel('');
    setShowLabelInput(false);
  };

  return (
    <div
      ref={preview}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-2.5 transition-all duration-200 ${
        isDragging ? 'opacity-40 scale-95' : 'hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-900/10'
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-start gap-2.5">
        <div ref={drag} className="cursor-grab mt-1 flex-shrink-0">
          <GripVertical className="w-3.5 h-3.5 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <EditableText
            value={task.title}
            onChange={title => onUpdate({ ...task, title })}
            className="text-sm font-medium text-slate-700 mb-1.5"
            placeholder="Task title..."
          />
          {task.description && (
            <EditableText
              value={task.description}
              onChange={description => onUpdate({ ...task, description })}
              multiline
              className="text-xs text-slate-500 mb-3 leading-relaxed"
              placeholder="Description..."
            />
          )}
          {!task.description && (
            <EditableText
              value={task.description}
              onChange={description => onUpdate({ ...task, description })}
              multiline
              className="text-xs text-slate-600 mb-3"
              placeholder="Add description..."
            />
          )}

          <div className="flex flex-wrap gap-1.5 items-center">
            {task.labels.map(label => (
              <div
                key={label}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                  LABEL_STYLES[label] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/25'
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {label}
                <button onClick={() => onUpdate({ ...task, labels: task.labels.filter(l => l !== label) })} className="ml-0.5 hover:opacity-60">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {showLabelInput ? (
              <div className="flex gap-1">
                <select
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="text-[10px] bg-white border border-slate-200 text-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500/50"
                  autoFocus
                >
                  <option value="">Select...</option>
                  {availableLabels.filter(l => !task.labels.includes(l)).map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <button onClick={() => addLabel(newLabel)} className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">Add</button>
                <button onClick={() => { setShowLabelInput(false); setNewLabel(''); }} className="text-[10px] px-2 py-0.5 border border-slate-200 text-slate-500 rounded hover:bg-slate-100 transition-colors">✕</button>
              </div>
            ) : (
              <button
                onClick={() => setShowLabelInput(true)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 hover:border-slate-400 rounded transition-colors"
              >
                <Tag className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
        <button onClick={onDelete} className="text-slate-700 hover:text-rose-400 transition-colors flex-shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({
  column, onMoveTask, onUpdateTask, onDeleteTask, onAddTask, onUpdateColumn,
}: {
  column: Column;
  onMoveTask: (taskId: string, from: string, to: string, index: number) => void;
  onUpdateTask: (colId: string, taskId: string, task: Task) => void;
  onDeleteTask: (colId: string, taskId: string) => void;
  onAddTask: (colId: string) => void;
  onUpdateColumn: (colId: string, title: string) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: DragItem, monitor) => {
      if (!monitor.didDrop()) {
        onMoveTask(item.id, item.columnId, column.id, column.tasks.length);
      }
    },
    collect: monitor => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  const accent = COLUMN_ACCENTS[column.id] ?? 'bg-slate-400';

  return (
    <div className="flex-shrink-0 w-72">
      <div
        className={`rounded-xl p-4 h-full flex flex-col transition-colors duration-200 border ${
          isOver ? 'border-blue-500/40 bg-blue-50' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${accent}`} />
          <EditableText
            value={column.title}
            onChange={title => onUpdateColumn(column.id, title)}
            className="text-sm font-semibold text-slate-700 flex-1"
            placeholder="Column title..."
          />
          <span
            className="text-[10px] text-slate-400 tabular-nums ml-auto"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {column.tasks.length}
          </span>
        </div>

        <div ref={drop} className="flex-1 min-h-[100px]">
          {column.tasks.map((task, index) => (
            <KanbanTask
              key={task.id}
              task={task}
              columnId={column.id}
              index={index}
              onUpdate={t => onUpdateTask(column.id, task.id, t)}
              onDelete={() => onDeleteTask(column.id, task.id)}
            />
          ))}
          {column.tasks.length === 0 && !isOver && (
            <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-slate-300 text-[11px] text-slate-400">
              Drop tasks here
            </div>
          )}
        </div>

        <button
          onClick={() => onAddTask(column.id)}
          className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-1 rounded hover:bg-slate-100"
        >
          <Plus className="w-3.5 h-3.5" />
          Add task
        </button>
      </div>
    </div>
  );
}

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      { id: '1', title: 'Define and validate target segments', description: '', labels: ['Product Strategy'] },
      { id: '2', title: 'Identify user personas', description: '', labels: ['Product Strategy'] },
      { id: '3', title: 'Define value proposition', description: '', labels: ['Product Strategy'] },
      { id: '4', title: 'Positioning and messaging', description: '', labels: ['Product Strategy'] },
      { id: '5', title: 'Jobs to be done', description: '', labels: ['Product Strategy'] },
      { id: '6', title: 'Business case', description: '', labels: ['Product Strategy'] },
      { id: '7', title: 'Pricing and packaging', description: '', labels: ['Product Strategy'] },
      { id: '8', title: 'Positioning framework', description: '', labels: ['Product Strategy'] },
      { id: '9', title: 'Define user outcomes', description: '', labels: ['Product Discovery'] },
      { id: '10', title: 'Identify pain points/opportunities', description: '', labels: ['Product Discovery'] },
      { id: '11', title: 'Build prototypes', description: '', labels: ['Product Discovery'] },
      { id: '12', title: 'User testing', description: '', labels: ['Product Discovery'] },
      { id: '13', title: 'Tech exploration', description: '', labels: ['Product Discovery'] },
      { id: '14', title: 'Opportunity sizing', description: '', labels: ['Product Discovery'] },
      { id: '15', title: 'User discovery', description: '', labels: ['Product Discovery'] },
      { id: '16', title: 'Requirements', description: '', labels: ['Product Discovery'] },
      { id: '17', title: 'Tech discovery', description: '', labels: ['Product Discovery'] },
      { id: '18', title: 'Roadmap updates', description: '', labels: ['Product Delivery'] },
      { id: '19', title: 'Requirements and backlog', description: '', labels: ['Product Delivery'] },
      { id: '20', title: 'Sprint planning', description: '', labels: ['Product Delivery'] },
      { id: '21', title: 'Design', description: '', labels: ['Product Delivery'] },
      { id: '22', title: 'Development', description: '', labels: ['Product Delivery'] },
      { id: '23', title: 'Testing', description: '', labels: ['Product Delivery'] },
      { id: '24', title: 'Launch readiness', description: '', labels: ['Product Delivery'] },
      { id: '25', title: 'Customer rollout', description: '', labels: ['Product Delivery'] },
    ],
  },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

export function KanbanBoard() {
  const [columns, setColumns] = useFirebaseSync<Column[]>("kanbanColumns", initialColumns);

  const handleMoveTask = (taskId: string, fromId: string, toId: string, toIndex: number) => {
    if (fromId === toId) return;
    setColumns(prev => {
      const next = [...prev];
      const from = next.find(c => c.id === fromId);
      const to = next.find(c => c.id === toId);
      if (!from || !to) return prev;
      const idx = from.tasks.findIndex(t => t.id === taskId);
      if (idx === -1) return prev;
      const [task] = from.tasks.splice(idx, 1);
      to.tasks.splice(toIndex, 0, task);
      return next;
    });
  };

  const handleUpdateTask = (colId: string, taskId: string, updated: Task) =>
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? updated : t) } : c));

  const handleDeleteTask = (colId: string, taskId: string) =>
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c));

  const handleAddTask = (colId: string) =>
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, tasks: [...c.tasks, { id: `task-${Date.now()}`, title: '', description: '', labels: [] }] } : c));

  const handleUpdateColumn = (colId: string, title: string) =>
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, title } : c));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {columns.map(col => (
        <KanbanColumn
          key={col.id}
          column={col}
          onMoveTask={handleMoveTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
          onUpdateColumn={handleUpdateColumn}
        />
      ))}
    </div>
  );
}
