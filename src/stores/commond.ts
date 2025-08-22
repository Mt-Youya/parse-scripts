import { create } from "zustand"
import { FormatDetectors, type FormatDetectorsType } from "@/constants/FormatDetectors"

export interface Dictionary {
    [p: string]: string | number
}

type DetectorsType = FormatDetectorsType[number] & { checked: boolean }
interface CommondState {
    baseCommand: string
    setBaseCommand: (baseCommand: string) => void

    commandSuffix: string
    setCommandSuffix: (commandSuffix: string) => void

    extractedData: Dictionary
    setExtractedData: (extractedData: Dictionary) => void

    targetFields: string
    setTargetFields: (targetFields: string) => void

    detectors: DetectorsType[]
    setDetectors: (detectors: DetectorsType[]) => void
}

export const CommandStore = create<CommondState>((set) => ({
    baseCommand: `hdc shell "aa start -U 'com.huawei.hms.push/.service.PushService' --es 'appId' '10000000' --es 'appVersion' '1.0.0' --es 'packageName' 'com.huawei.hms.push' --es 'deviceId' '1234567890abcdef' --es 'deviceType' 'android`,
    setBaseCommand: (baseCommand: string) => set({ baseCommand }),

    commandSuffix: `'"`,
    setCommandSuffix: (commandSuffix: string) => set({ commandSuffix }),

    extractedData: {},
    setExtractedData: (extractedData: Dictionary) => set({ extractedData }),

    targetFields: "cityId,mboxCouponId,spuId",
    setTargetFields: (targetFields: string) => set({ targetFields }),

    detectors: FormatDetectors.map(item => ({ ...item, checked: true })),
    setDetectors: (detectors: DetectorsType[]) => set({ detectors }),
}))
