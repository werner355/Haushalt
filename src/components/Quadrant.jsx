import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

const COLOR_MAP = {
  rose:    { bg: 'bg-rose-950/40',    border: 'border-rose-800/50',    badge: 'bg-rose-500',    dot: 'bg-rose-400' },
  emerald: { bg: 'bg-emerald-950/40', border: 'border-emerald-800/50', badge: 'bg-emerald-500', dot: 'bg-emerald-400' },
  amber:   { bg: 'bg-amber-950/40',   border: 'border-amber-800/50',   badge: 'bg-amber-500',   dot: 'bg-amber-400' },
  slate:   { bg: 'bg-slate-800/40',   border: 'border-slate-700/50',   badge: 'bg-slate-500',   dot: 'bg-slate-400' },
}

export default function Quadrant({ quadrant, tasks, onDelete, onAdd, addingTo, setAddingTo, newTask, setNewTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: quadrant.id })
  const c = COLOR_MAP[quadrant.color]
  const isAdding = addingTo === quadrant.id

  function handleKeyDown(e) {
    if (e.key === 'Enter') onAdd(quadrant.id)
    if (e.key === 'Escape') { setAddingTo(null); setNewTask('') }
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        ${c.bg} ${c.border} border rounded-xl flex flex-col
        min-h-[calc(50vh-4rem)] sm:min-h-[calc(50vh-3rem)]
        transition-all duration-150
        ${isOver ? 'scale-[1.01] brightness-110' : ''}
      `}
    >
      {/* Quadrant header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
          <span className="font-semibold text-sm leading-tight">{quadrant.label}</span>
        </div>
        <p className="text-slate-500 text-xs pl-4">{quadrant.sub}</p>
      </div>

      {/* Tasks */}
      <div className="flex-1 px-2 pb-2 space-y-1.5 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} />
        ))}

        {/* Inline add */}
        {isAdding ? (
          <div className="flex gap-1.5 mt-1">
            <input
              autoFocus
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Aufgabe eingeben…"
              className="flex-1 bg-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-slate-500 placeholder:text-slate-500 min-w-0"
            />
            <button
              onClick={() => onAdd(quadrant.id)}
              className="bg-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-white transition-colors flex-shrink-0"
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setAddingTo(quadrant.id); setNewTask('') }}
            className="w-full text-left text-slate-600 hover:text-slate-400 text-xs px-1 py-1 transition-colors"
          >
            + Aufgabe
          </button>
        )}
      </div>
    </div>
  )
}
