import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { auth, db, storage } from '../firebase/config'
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
      const res = await createUserWithEmailAndPassword(auth, email, password)
      if (!res) {
        throw new Error('Could not complete signup')
      }

      // upload user thumbnail
      const UPLOAD_PATH = `thumbnail/${res.user.uid}/${thumbnail}`
      const storageRef = ref(storage, UPLOAD_PATH)
      const uploadTask = uploadBytesResumable(storageRef, thumbnail)
      uploadTask.on(
        'state_changed',
        () => {},
        (err) => {
          setError(err)
        },
        async () => {
          const imgUrl = await getDownloadURL(uploadTask.snapshot.ref)
          await updateProfile(res.user, {
            displayName,
            photoURL: imgUrl,
          })
          await addDoc(collection(db, 'users'), {
            uid: res.user.uid,
            online: true,
            displayName,
            photoURL: imgUrl,
          })
          dispatch({
            type: 'LOGIN',
            payload: res.user,
          })
        }
      )

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
