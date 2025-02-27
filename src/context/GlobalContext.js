import React, { createContext, useState } from 'react';


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const [mode, setMode] = useState(null);

    return (
        <GlobalContext.Provider value={{ mode, setMode }}>
            {children}
        </GlobalContext.Provider>
    );
};