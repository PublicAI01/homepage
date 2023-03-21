import { createContext } from 'react';

const ActiveFQContext = createContext({
  activeFQ: null,
  setActiveFQ: () => { },
});

export default ActiveFQContext;
