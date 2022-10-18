import * as React from 'react';
import { createContext, useState, ReactNode} from "react";
import { appWindow, PhysicalPosition } from '@tauri-apps/api/window';

type Props = {
    children: ReactNode
}

type AppContextType = {
    windowPosition: [PhysicalPosition, React.Dispatch<PhysicalPosition>],
    min1: [number, React.Dispatch<number>],
    min2: [number, React.Dispatch<number>],
    min3: [number, React.Dispatch<number>],
    notificationType: [string, React.Dispatch<string>],
    voice: [string, React.Dispatch<string>],
}

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider: React.FC<Props> = (props) => {
    const [winPosition, setWinPosition] = React.useState(() => {
        const json = localStorage.getItem("minipomo-WindowPosition");
        const initWinPosition = json === null ? null : JSON.parse(json);

        return initWinPosition === null ? {x: 10, y: 10} : initWinPosition;
    });

    const [min1, setMin1] = React.useState(() => {
        const json = localStorage.getItem("minipomo-Min1");
        const initMin1 = json === null ? null : JSON.parse(json);

        return initMin1 === null ? 25 : initMin1;
    });

    const [min2, setMin2] = React.useState(() => {
        const json = localStorage.getItem("minipomo-Min2");
        const initMin2 = json === null ? null : JSON.parse(json);

        return initMin2 === null ? 5 : initMin2;
    });

    const [min3, setMin3] = React.useState(() => {
        const json = localStorage.getItem("minipomo-Min3");
        const initMin3 = json === null ? null : JSON.parse(json);

        return initMin3 === null ? 20 : initMin3;
    });

    const [notificationType, setNotificationType] = React.useState(() => {
        const json = localStorage.getItem("minipomo-NotificationType");
        const initNotificationType = json === null ? null : JSON.parse(json);

        return initNotificationType === null ? 'voice' : initNotificationType;
    });

    const [voice, setVoice] = React.useState(() => {
        const json = localStorage.getItem("minipomo-Voice");
        const initVoice = json === null ? null : JSON.parse(json);

        return initVoice === null ? 0: initVoice;
    });

    return(
        <AppContext.Provider value={{
            windowPosition: [winPosition, setWinPosition],
            min1: [min1, setMin1],
            min2: [min2, setMin2],
            min3: [min3, setMin3],
            notificationType: [notificationType, setNotificationType],
            voice: [voice, setVoice]
            }}>
            {props.children}
        </AppContext.Provider>
    )
}
