export default function useCopy(text = "") {
  const [status, setStatus] = useState(false);

  async function copyToClipboard(value = text) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(true);
    } catch (err) {
      console.log(err);
      // 降级处理
      const textArea = document.createElement('textarea');
      textArea.value = value ?? "";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setStatus(true);
    } finally {
      const timer = setTimeout(() => (setStatus(false), clearTimeout(timer)), 2000);
    }
  }
  return { status, copyToClipboard }
}

export { useCopy }
