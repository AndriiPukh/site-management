import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useDocuments = (_collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    const ref = doc(db, _collection, id)
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id })
          setError(null)
        } else {
          setError('no such document exists')
        }
      },
      (err) => setError(err.message)
    )

    return () => {
      unsubscribe()
    }
  }, [_collection, id])
  return { document, error }
}
