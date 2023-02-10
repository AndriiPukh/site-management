import { useReducer, useEffect, useState } from 'react'
import { collection, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { db, timestamp } from '../firebase/config'

const initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return {
        isPending: true,
        success: false,
        error: null,
        document: null,
      }
    case 'ADDED_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        success: true,
        error: null,
      }
    case 'UPDATE_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        success: true,
        error: null,
      }
    case 'DELETED_DOCUMENT':
      return {
        document: null,
        isPending: false,
        success: true,
        error: null,
      }
    case 'ERROR':
      return {
        error: action.payload,
        isPending: false,
        success: false,
        document: null,
      }
    default:
      return state
  }
}

export const useFirestore = (_collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add a document
  const addDocument = async (_doc) => {
    dispatch({
      type: 'IS_PENDING',
    })
    try {
      const docRef = collection(db, _collection)
      const createdAt = timestamp.fromDate(new Date())
      const addedDocument = await addDoc(docRef, {
        ..._doc,
        createdAt,
      })
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      })
    } catch (err) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: err.message,
      })
    }
  }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({
      type: 'IS_PENDING',
    })
    try {
      const docRef = doc(db, _collection, id)
      await deleteDoc(docRef)
      dispatchIfNotCancelled({
        type: 'DELETED_DOCUMENT',
      })
    } catch (err) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: err.message,
      })
    }
  }

  // update documents
  // eslint-disable-next-line consistent-return
  const updateDocuments = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' })
    try {
      const docRef = doc(db, _collection, id)
      const updatedDocument = await setDoc(docRef, updates, { merge: true })
      dispatchIfNotCancelled({
        type: 'UPDATE_DOCUMENT',
        payload: updatedDocument,
      })
      return updatedDocument
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  useEffect(() => () => setIsCancelled(true), [])

  return {
    addDocument,
    deleteDocument,
    response,
    updateDocuments,
  }
}
