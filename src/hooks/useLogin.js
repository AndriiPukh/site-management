import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)

      // update oline status
      const { uid } = res.user

      await setDoc(collection(db, 'users', uid), { online: true })

      // dispatch logout action
      dispatch({
        type: 'LOGIN',
        payload: res.user,
      })
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => () => setIsCancelled(true), [])

  return {
    login,
    error,
    isPending,
  }
}
