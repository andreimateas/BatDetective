import {refresh} from "ionicons/icons";
import React, {useCallback, useContext, useState} from "react";


interface AddLocationContextProps {
    refresh:boolean
    triggerRefresh:() => void
}
const AddLocationContext = React.createContext<AddLocationContextProps|undefined>(undefined)

export const AddLocationProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
    const [refresh, setRefresh] = useState<boolean>(false);
    const triggerRefresh =()=>{

        console.log("REFRESH",refresh);
        setRefresh((prev) => !prev); // This ensures React detects a state change

        console.log("REFRESH",refresh);
    };
    return(
        <AddLocationContext.Provider value={{refresh, triggerRefresh}}>
            {children}
        </AddLocationContext.Provider>
    )


}
export const useAddLocationContext = () =>{
    const context = useContext(AddLocationContext);
    if (!context) throw new Error('useAddLocationContext must be used within a AddLocationProvider');

    return context;
}