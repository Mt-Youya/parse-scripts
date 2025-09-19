import { IS_DEV } from "@/lib/envConf";

export const devRoutes = [
  {
    path: "/bogo",
    component: lazy(() => import("@/pages/BOGO")),
    redirect: !IS_DEV ? "/404" : undefined
  }
]
