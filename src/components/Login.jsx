import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message || err.code || 'Unbekannter Fehler')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Eisenhower Matrix</h1>
        <p className="text-slate-400 text-center text-sm mb-8">Gemeinsam Prioritäten setzen</p>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 space-y-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-500 placeholder:text-slate-500"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-500 placeholder:text-slate-500"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-100 text-slate-900 font-semibold rounded-lg py-3 text-sm hover:bg-white transition-colors"
          >
            {isRegister ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-4">
          {isRegister ? 'Schon ein Konto?' : 'Noch kein Konto?'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError('') }}
            className="text-slate-300 underline"
          >
            {isRegister ? 'Anmelden' : 'Registrieren'}
          </button>
        </p>
      </div>
    </div>
  )
}
