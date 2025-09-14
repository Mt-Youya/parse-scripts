import { Slot } from "@radix-ui/react-slot";
import { Button, type ButtonProps } from "@/ui/button";
import { CheckCircle } from "lucide-react";
import useCopy from "@/hooks/useCopy";

export default function CopyComp({
  asChild = false,
  copyValue = "",
  text = "",
  ...props
}: ButtonProps & { copyValue: any; text: React.ReactNode }) {
  const { status, copyToClipboard } = useCopy(copyValue);

  const Comp = asChild ? Slot : Button;

  return (
    <Comp className="my-2" onClick={() => copyToClipboard(copyValue)} {...props}>
      {status ? (
        <>
          <CheckCircle size={16} />
          已复制
        </>
      ) : (
        text
      )}
    </Comp>
  );
}
