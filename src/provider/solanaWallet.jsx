import {
  createContext, useContext, useMemo, useReducer,
} from 'react';

const initState = {
  state: {
    publicKey: '',
    provider: null,
    connected: false,
  },
  dispatch: (action) => {},
};

const solanaWalletContext = createContext(initState);

export function SolanaWalletProvider(props) {
  const reducer = (_state, action) => {
    const { type, payload } = action || {};
    switch (type) {
      case 'CONNECT':
        return {
          ..._state,
          ...payload,
          connected: true,
        };
      case 'SETACCOUNT':
        return {
          ..._state,
          ...payload,
        };
      case 'DISCONNECT':
        return {
          ...initState.state,
        };
      default:
        break;
    }
    return _state;
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state]);
  return (
    <solanaWalletContext.Provider value={value}>
      {props.children}
    </solanaWalletContext.Provider>
  );
}

export const useSolanaWalletProvider = () => useContext(solanaWalletContext);
