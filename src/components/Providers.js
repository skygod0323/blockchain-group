import { useReducer, createContext } from 'react';

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

export const StateContext = createContext({ state: initialState, dispatch: null });

const StateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>
}

export default StateContextProvider;
