import React, { createContext, useState, useContext } from 'react';

interface RegistrationContextProps {
    username: any;
    setRegistrationData: (data: any) => void;
}

const RegistrationContext = createContext<RegistrationContextProps | undefined>(undefined);
interface ComponentProps {
    children: React.ReactNode;
}
export const RegistrationProvider: React.FC<ComponentProps> = ({ children }) => {
    const [username, setRegistrationData] = useState<any>(null);

    return (
        <RegistrationContext.Provider value={{ username, setRegistrationData }}>
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistration = () => {
    const context = useContext(RegistrationContext);
    if (!context) throw new Error('useRegistration must be used within a RegistrationProvider');
    return context;
};
