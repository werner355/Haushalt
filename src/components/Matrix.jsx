import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore'
import {
  DndContext, DragOverlay, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors
} from '@dnd-kit/core'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import Quadrant from './Quadrant'
import TaskCard from './TaskCard'

const QUADRANTS = [
  { id: 'do',       label: 'Sofort erledigen',  sub: 'Dringend + Wichtig',         color: 'rose' },
  { id: 'plan',     label: 'Einplanen',          sub: 'Nicht dringend + Wichtig',   color: 'emerald' },
  { id: 'delegate', label: 'Delegieren',         sub: 'Dringend + Nicht wichtig',   color: 'amber' },
  { id: 'drop',     label: 'Eliminieren',        sub: 'Weder noch',                 color: 'slate' },
]

export default function Matrix({ user }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [activeTask, setActiveTask] = useState(null)
  const [addingTo, setAddingTo] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tasks'), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  async function addTask(quadrantId) {
    if (!newTask.trim()) return
    await addDoc(collection(db, 'tasks'), {
      text: newTask.trim(),
      quadrant: quadrantId,
      createdAt: serverTimestamp(),
      createdBy: user.email,
    })
    setNewTask('')
    setAddingTo(null)
  }

  async function deleteTask(id) {
    await deleteDoc(doc(db, 'tasks', id))
  }

  function handleDragStart(event) {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task)
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return
    const targetQuadrant = QUADRANTS.find(q => q.id === over.id)?.id || over.id
    if (!targetQuadrant) return
    const task = tasks.find(t => t.id === active.id)
    if (task && task.quadrant !== targetQuadrant) {
      await updateDoc(doc(db, 'tasks', active.id), { quadrant: targetQuadrant })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h1 className="font-bold text-lg">Eisenhower Matrix</h1>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs hidden sm:block">{user.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Abmelden
          </button>
        </div>
      </header>

      {/* Matrix */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="flex-1 grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3">
          {QUADRANTS.map(q => (
            <Quadrant
              key={q.id}
              quadrant={q}
              tasks={tasks.filter(t => t.quadrant === q.id)}
              onDelete={deleteTask}
              onAdd={addTask}
              addingTo={addingTo}
              setAddingTo={setAddingTo}
              newTask={newTask}
              setNewTask={setNewTask}
            />
          ))}
        </main>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onDelete={() => {}} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
