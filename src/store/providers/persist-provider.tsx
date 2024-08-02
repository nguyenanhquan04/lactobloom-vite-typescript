import { PersistGate } from "redux-persist/es/integration/react";
import { persistor } from "../store";
import React, { ReactNode, FC } from "react";

interface PersistProviderProps {
    children: ReactNode;
}

const PersistProvider: FC<PersistProviderProps> = ({ children }) => {
    return (
        <PersistGate loading={null} persistor={persistor}>
            {children}
        </PersistGate>
    );
};

export default PersistProvider;