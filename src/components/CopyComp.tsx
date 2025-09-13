import { Slot } from "@radix-ui/react-slot"
import { Button, type ButtonProps } from "@/ui/button";
import { CheckCircle } from "lucide-react";
import { isString } from "@/utils/is";
import { toast } from "sonner";
import useCopy from "@/hooks/useCopy";

export default function CopyComp({ asChild = false, copyValue = "", text = "", ...props }: ButtonProps & { copyValue: any, text: React.ReactNode }) {
    const { status, copyToClipboard } = useCopy(copyValue)

    async function handleCopy(value: typeof copyValue) {
        if (!isString(value)) {
            return toast.error("复制失败!", { description: "复制内容只能为字符串" })
        }
        await copyToClipboard(value)
    }

    const Comp = asChild ? Slot : Button

    return (
        <Comp className="my-2" onClick={() => handleCopy(copyValue)} {...props}>
            {status ? (
                <>
                    <CheckCircle size={16} />
                    已复制
                </>
            ) : text}
        </Comp>
    )
}
