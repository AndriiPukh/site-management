import { useEffect, useRef, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const useCollection = (_collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // if we don`t use a ref --> infinite loop
  const queryRef = useRef(_query).current
  const orderByRef = useRef(_orderBy).current
  useEffect(() => {
    let ref = collection(db, _collection)

    if (_query) {
      ref = query(ref, where(...queryRef))
    }
    if (_orderBy) {
      ref = query(ref, orderBy(...orderByRef))
    }
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const results = []
        snapshot.docs.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          })
        })

        setDocuments(results)
        setError(null)
      },
      () => {
        setError('could not fetch the data')
      }
    )

    // unsubscribe on unmount
    return () => unsubscribe()
  }, [collection, query, orderBy])

  return {
    error,
    documents,
  }
}
