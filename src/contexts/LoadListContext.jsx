import { createContext, useState } from "react";

const LoadListContext = createContext();

export function LoadListProvider({ children }) {
  const [loadList, setLoadList] = useState(false);

  return (
    <LoadListContext.Provider value={{loadList, setLoadList}}>
      {children}
    </LoadListContext.Provider>
  );
}

export { LoadListContext };