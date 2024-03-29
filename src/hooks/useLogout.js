import { useEffect, useState } from 'react'
import { collection, setDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()

  const logout = async () => {
    setError(null)
    setIsPending(true)
    try {
      // update online status
      const { uid } = user
      await setDoc(collection(db, 'users', uid), { online: false })

      await signOut(auth)

      // dispatch logout action
      dispatch({
        type: 'LOGOUT',
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
    logout,
    error,
    isPending,
  }
}
