import { useEffect, useState } from 'react'
import { projectAuth, projectStorage } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
    try {
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      )
      if (!res) {
        throw new Error('Could not complete signup')
      }

      // upload user thumbnail
      const UPLOAD_PATH = `thumbnail/${res.user.uid}/${thumbnail}`
      const image = await projectStorage.ref(UPLOAD_PATH).put(thumbnail)
      const imageUrl = await image.ref.getDownloadURL()
      // add display name to user
      await res.user.updateProfile({
        displayName,
        photoURL: imageUrl,
      })

      // dispatch login action
      dispatch({
        type: 'LOGIN',
        payload: res.user,
      })
      // update status
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
    error,
    isPending,
    signup,
  }
}
