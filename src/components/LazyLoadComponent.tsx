import { Suspense, type ComponentType } from "react";
import Loader from "./Loader";

export const LazyLoad = ({ component: Component }: { component: ComponentType }) => (
  <Suspense fallback={<Loader.Static />}>
    <Component />
  </Suspense>
);
