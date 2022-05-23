import { useEffect, useRef, useState } from 'react'
import { projectFirestore } from '../firebase/config'

export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // if we don`t use a ref --> infinite loop
  const query = useRef(_query).current
  const orderBy = useRef(_orderBy).current
  useEffect(() => {
    let ref = projectFirestore.collection(collection)

    if (query) {
      ref = ref.where(...query)
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy)
    }
    const unsubscribe = ref.onSnapshot(
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
