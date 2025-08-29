import { Slot } from "@radix-ui/react-slot"
import { Button, type ButtonProps } from "@/ui/button";
import { CheckCircle } from "lucide-react";

export default function CopyComp({ asChild = false, copyValue = '', text = "", ...props }: ButtonProps & { copyValue: any, text: React.ReactNode }) {
    const [status, setStatus] = useState(false)

    async function handleCopy(value: typeof copyValue) {
        let cpValue
        try {
            cpValue = JSON.stringify(value)
            await navigator.clipboard.writeText(cpValue);
        } catch (err) {
            // 降级处理
            const textArea = document.createElement('textarea');
            textArea.value = cpValue ?? "";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        } finally {
            setStatus(true);
            const timer = setTimeout(() => (setStatus(false), clearTimeout(timer)), 2000);
        }
    }

    const Comp = asChild ? Slot : Button

    return (
        <Comp onClick={() => handleCopy(copyValue)} {...props}>
            {status ? (
                <>
                    <CheckCircle size={16} />
                    已复制
                </>
            ) : text}
        </Comp>
    )
}


