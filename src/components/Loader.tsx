import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";

interface LoaderProps {
  loading?: boolean;
}
function Loader({ children = "Loading...", loading = false }: PropsWithChildren & LoaderProps) {
  const [spining, setSpining] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setSpining(true);
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    }
    setVisible(false);
    const timer = setTimeout(() => setSpining(false), 500);
    return () => clearTimeout(timer);
  }, [loading]);

  if (!spining) return null;

  return (
    <Loader.Static variants={visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-90"}>
      {children}
    </Loader.Static>
  );
}

export default Loader;

Loader.Static = function ({
  variants = "translate-y-0 opacity-100 scale-100",
  children = "Loading...",
}: { variants?: string } & PropsWithChildren) {
  const classes = cva(
    "fixed inset-0 z-50 transition-all duration-500 ease-in-out w-full h-full flex items-center justify-center p-4 bg-sky-100 rounded-lg"
  );
  return (
    <div className={cn(classes(), variants)}>
      <Loader2 className="animate-spin" />
      <span className="ml-2 text-orange-800">{children}</span>
    </div>
  );
};
