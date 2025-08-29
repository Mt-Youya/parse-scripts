import { Button } from "@/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Textarea } from "@/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { Loader2Icon } from "lucide-react";

function flattenObject(obj, parentKey = "", result = {}) {
    for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], newKey, result);
        } else if (Array.isArray(obj[key])) {
            obj[key].forEach((item, index) => {
                flattenObject(item, `${newKey}[${index}]`, result);
            });
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

// ============ Tree View ============
function TreeNode({ nodeKey, values }) {
    const [expanded, setExpanded] = useState(true);
    const isObjectOrArray = values.some(
        (val) => typeof val === "object" && val !== null
    );

    if (isObjectOrArray) {
        const childKeys = new Set();
        values.forEach((val) => {
            if (val && typeof val === "object") {
                Object.keys(val).forEach((k) => childKeys.add(k));
            }
        });

        return (
            <div className="ml-4">
                <div
                    className="cursor-pointer font-bold"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "➖" : "➕"} {nodeKey || "root"}
                </div>
                {expanded && (
                    <div className="ml-6">
                        {Array.from(childKeys).map((child: any, idx) => {
                            const childValues = values.map(
                                (val) => (val && typeof val === "object" ? val[child] : undefined)
                            );
                            return (
                                <TreeNode
                                    key={idx + child}
                                    nodeKey={child}
                                    values={childValues}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // primitive values
    const allEqual = values.every((val) => val === values[0]);
    return (
        <div className={`ml-4 p-1 ${allEqual ? "" : "bg-red-200"}`}>
            <span className="font-medium">{nodeKey}: </span>
            {values.map((val, i) => (
                <>
                    <span key={i}>
                        {val === undefined ? "<缺失> 🙅" : String(val)}
                    </span>
                    {i % 2 === 0 && <span className="mx-4"> {allEqual ? "✅" : "❌"}</span>}
                </>
            ))}
        </div>
    );
}

function TreeView({ jsonObjects }) {
    return <TreeNode nodeKey="root" values={jsonObjects} />;
}

// ============ Table View ============
function TableView({ jsonObjects }) {
    const flattened = jsonObjects.map((obj) => flattenObject(obj));
    const keys = Array.from(
        new Set(flattened.flatMap((obj) => Object.keys(obj)))
    );

    return (
        <Table className="border-collapse border border-gray-400 w-screen max-w-screen overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead className="border border-gray-400 px-2">Key</TableHead>
                    {jsonObjects.map((_, i) => (
                        <TableHead key={i} className="border border-gray-400 px-2">
                            JSON {i + 1}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className="max-w-screen overflow-hidden">
                {keys.map((key, idx) => {
                    const rowValues = flattened.map((obj) => obj[key]);
                    const allEqual = rowValues.every((val) => val === rowValues[0]);
                    return (
                        <TableRow key={key + idx} className={`${allEqual ? "" : "bg-red-200"} max-w-screen`}>
                            <TableCell className="border border-gray-400 px-2 max-w-1/3 truncate">{key}</TableCell>
                            {rowValues.map((val, i) => {
                                const content = val === undefined ? "❌ <缺失> 🙅" : val?.toString()
                                return (
                                    <Tooltip key={val + i}>
                                        <TableCell key={i} className="border border-gray-400 px-2 max-w-3xl truncate">
                                            <TooltipTrigger> {content} </TooltipTrigger>
                                        </TableCell>
                                        <TooltipContent className="max-w-screen"> {content} </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

// ============ Main Component ============
export default function JSONComparer() {
    const [jsonInputs, setJsonInputs] = useState(["", ""]);
    const [jsonObjects, setJsonObjects] = useState([]);
    const [mode, setMode] = useState("table");
    const [loading, setLoading] = useState(false)

    function handleChange(index, value) {
        const newInputs = [...jsonInputs];
        newInputs[index] = value;
        setJsonInputs(newInputs);
    };

    function handleCompare() {
        setLoading(true)
        Promise.resolve().then(() => {
            requestIdleCallback((idle) => {
                if (idle.timeRemaining() > 2) {
                    try {
                        const parsed = jsonInputs.map((input) => JSON.parse(input));
                        setJsonObjects(parsed);
                    } catch (e) {
                        alert("JSON 格式错误: " + e.message);
                        setLoading(false)
                    }
                }
            })
        }).finally(() => setLoading(false))
    };

    const addInput = () => setJsonInputs([...jsonInputs, ""]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">JSON 对比工具</h1>
            <Button asChild className="mb-4">
                <Link
                    replace to="/"
                    className="relative pb-1 text-[#0009] bg-size-[0_2px] bg-linear-to-r[#92db72_#90ff00] transition-all duration-300 ease-in-out bg-bottom bg-right bg-no-repeat hover:bg-size-[100%_2px] hover:bg-left hover:bg-bottom"
                >
                    Back Home
                </Link>
            </Button>
            <div className="grid-cols-2 grid-cols-3 grid-cols-4"/>
            <div className={`grid grid-cols-${jsonInputs.length > 4 ? 4 : jsonInputs.length || 4}`}>
                {jsonInputs.map((input, index) => (
                    <Textarea
                        key={index}
                        value={input}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="border w-full h-24 mb-2 p-2"
                        placeholder={`输入 JSON ${index + 1}`}
                    />
                ))}
            </div>
            <Button onClick={addInput}>添加 JSON</Button> &emsp;
            <Button onClick={handleCompare} disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />} 对比
            </Button>

            {jsonObjects.length > 0 && (
                <div className="mt-4">
                    <div className="mb-2">
                        <button
                            onClick={() => setMode("table")}
                            className={`px-2 py-1 mr-2 rounded ${mode === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            表格模式
                        </button>
                        <button
                            onClick={() => setMode("tree")}
                            className={`px-2 py-1 rounded ${mode === "tree" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            树形模式
                        </button>
                    </div>

                    {mode === "table" ? (
                        <TableView jsonObjects={jsonObjects} />
                    ) : (
                        <TreeView jsonObjects={jsonObjects} />
                    )}
                </div>
            )}
        </div>
    );
}
