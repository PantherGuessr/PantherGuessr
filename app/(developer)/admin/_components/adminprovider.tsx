// import React, { createContext, useContext } from "react";

// const AdminContext = createContext<AdminContextProps | undefined>(undefined);

// export const AdminProvider: React.FC<{ tab: string; children: React.ReactNode }> = ({ tab, children }) => {
//   return <AdminContext.Provider>{children}</AdminContext.Provider>;
// };

// export const useAdmin = () => {
//   const context = useContext(AdminContext);
//   if (context === undefined) {
//     throw new Error("useAdmin must be used within an AdminProvider");
//   }
//   return context;
// };
