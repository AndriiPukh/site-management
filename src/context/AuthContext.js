import { createContext, useEffect, useMemo, useReducer } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    case 'AUTH_IS_READY': {
      return {
        ...state,
        user: action.payload,
        authIsReady: true,
      }
    }
    default:
      return state
  }
}

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  })
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({
        type: 'AUTH_IS_READY',
        payload: user,
      })
      unsub()
    })
  }, [])

  const context = useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  )
  // eslint-disable-next-line react/react-in-jsx-scope
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
