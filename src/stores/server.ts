import { create } from "zustand"

interface ServerStore {
    server: string,
    setServer: (server: string) => void,

    port: number | string,
    setPort: (port: number | string) => void,
}

export const ServerStore = create<ServerStore>((set) => ({
    server: "11.64.60.176",
    setServer: (server: string) => set({ server }),

    port: 8081,
    setPort: (port: number | string) => set({ port }),
}))
