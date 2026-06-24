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

const labelColors: { [key: string]: string } = {
  'Product Strategy': 'bg-blue-100 text-blue-700 border-blue-200',
  'Product Discovery': 'bg-green-100 text-green-700 border-green-200',
  'Product Delivery': 'bg-purple-100 text-purple-700 border-purple-200',
};

function KanbanTask({
  task,
  columnId,
  index,
  onUpdate,
  onDelete
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  const removeLabel = (label: string) => {
    onUpdate({ ...task, labels: task.labels.filter(l => l !== label) });
  };

  return (
    <div
      ref={preview}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div ref={drag} className="cursor-move mt-1">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <EditableText
            value={task.title}
            onChange={(title) => onUpdate({ ...task, title })}
            className="font-medium mb-2"
            placeholder="Task title..."
          />
          <EditableText
            value={task.description}
            onChange={(description) => onUpdate({ ...task, description })}
            multiline
            className="text-sm text-gray-600 mb-3"
            placeholder="Task description..."
          />

          <div className="flex flex-wrap gap-2 items-center">
            {task.labels.map((label) => (
              <div
                key={label}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
                  labelColors[label] || 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <Tag className="w-3 h-3" />
                {label}
                <button
                  onClick={() => removeLabel(label)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {showLabelInput ? (
              <div className="flex gap-1">
                <select
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                  autoFocus
                >
                  <option value="">Select label...</option>
                  {availableLabels.filter(l => !task.labels.includes(l)).map(label => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={() => addLabel(newLabel)}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowLabelInput(false);
                    setNewLabel('');
                  }}
                  className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLabelInput(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-md hover:border-gray-400"
              >
                <Plus className="w-3 h-3" />
                Add label
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onUpdateColumn
}: {
  column: Column;
  onMoveTask: (taskId: string, fromColumn: string, toColumn: string, toIndex: number) => void;
  onUpdateTask: (columnId: string, taskId: string, task: Task) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onAddTask: (columnId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: DragItem, monitor) => {
      if (!monitor.didDrop()) {
        onMoveTask(item.id, item.columnId, column.id, column.tasks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
        <EditableText
          value={column.title}
          onChange={(title) => onUpdateColumn(column.id, title)}
          className="font-semibold mb-4 text-gray-700"
          placeholder="Column title..."
        />
        <div
          ref={drop}
          className={`flex-1 min-h-[200px] ${isOver ? 'bg-blue-50' : ''} rounded-lg transition-colors`}
        >
          {column.tasks.map((task, index) => (
            <KanbanTask
              key={task.id}
              task={task}
              columnId={column.id}
              index={index}
              onUpdate={(updatedTask) => onUpdateTask(column.id, task.id, updatedTask)}
              onDelete={() => onDeleteTask(column.id, task.id)}
            />
          ))}
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
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
      {
        id: '1',
        title: 'Define and validate target segments',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '2',
        title: 'Identify user personas',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '3',
        title: 'Define value proposition',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '4',
        title: 'Positioning and messaging',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '5',
        title: 'Jobs to be done',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '6',
        title: 'Business case',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '7',
        title: 'Pricing and packaging',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '8',
        title: 'Positioning framework',
        description: '',
        labels: ['Product Strategy']
      },
      {
        id: '9',
        title: 'Define user outcomes',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '10',
        title: 'Identify pain points/opportunities',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '11',
        title: 'Build prototypes',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '12',
        title: 'User testing',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '13',
        title: 'Tech exploration',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '14',
        title: 'Opportunity sizing',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '15',
        title: 'User discovery',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '16',
        title: 'Requirements',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '17',
        title: 'Tech discovery',
        description: '',
        labels: ['Product Discovery']
      },
      {
        id: '18',
        title: 'Roadmap updates',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '19',
        title: 'Requirements and backlog',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '20',
        title: 'Sprint planning',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '21',
        title: 'Design',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '22',
        title: 'Development',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '23',
        title: 'Testing',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '24',
        title: 'Launch readiness',
        description: '',
        labels: ['Product Delivery']
      },
      {
        id: '25',
        title: 'Customer rollout',
        description: '',
        labels: ['Product Delivery']
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: []
  },
  {
    id: 'review',
    title: 'Review',
    tasks: []
  },
  {
    id: 'done',
    title: 'Done',
    tasks: []
  }
];

export function KanbanBoard() {
  const [columns, setColumns] = useFirebaseSync<Column[]>("kanbanColumns", initialColumns);

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string, toIndex: number) => {
    if (fromColumnId === toColumnId) return;

    setColumns(prevColumns => {
      const fromColIdx = prevColumns.findIndex(col => col.id === fromColumnId);
      const toColIdx = prevColumns.findIndex(col => col.id === toColumnId);
      if (fromColIdx === -1 || toColIdx === -1) return prevColumns;

      const taskIdx = prevColumns[fromColIdx].tasks.findIndex(t => t.id === taskId);
      if (taskIdx === -1) return prevColumns;

      const task = prevColumns[fromColIdx].tasks[taskIdx];

      return prevColumns.map((col, i) => {
        if (i === fromColIdx) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        if (i === toColIdx) {
          const newTasks = [...col.tasks];
          newTasks.splice(toIndex, 0, task);
          return { ...col, tasks: newTasks };
        }
        return col;
      });
    });
  };

  const handleUpdateTask = (columnId: string, taskId: string, updatedTask: Task) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map(task =>
                task.id === taskId ? updatedTask : task
              )
            }
          : col
      )
    );
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.filter(task => task.id !== taskId)
            }
          : col
      )
    );
  };

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      labels: []
    };

    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? {
              ...col,
              tasks: [...col.tasks, newTask]
            }
          : col
      )
    );
  };

  const handleUpdateColumn = (columnId: string, title: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId ? { ...col, title } : col
      )
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
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
