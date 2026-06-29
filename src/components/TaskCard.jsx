import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onDelete, isDragging = false }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.9 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        task-card group flex items-start gap-2
        bg-slate-800 hover:bg-slate-750 border border-slate-700/60
        rounded-lg px-2.5 py-2 text-xs
        ${isDragging ? 'shadow-2xl ring-1 ring-slate-500 z-50' : ''}
      `}
    >
      <span className="flex-1 leading-relaxed break-words min-w-0">{task.text}</span>
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); onDelete(task.id) }}
        className="flex-shrink-0 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 mt-0.5 leading-none"
      >
        ×
      </button>
    </div>
  )
}
