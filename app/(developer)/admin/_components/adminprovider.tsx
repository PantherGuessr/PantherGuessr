import React, { createContext, useContext } from 'react';

interface AdminContextProps {
    tab: string;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ tab: string, children: React.ReactNode }> = ({ tab, children }) => {
    return (
        <AdminContext.Provider value={{tab}}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};