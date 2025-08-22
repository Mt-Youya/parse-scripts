import { FieldTemplates } from '@/constants/fieldTemplates';
import { CommandStore, type Dictionary } from '@/stores/commond';
import { Button } from '@/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { parseTextData } from '@/utils/parse';
import { Search } from 'lucide-react';

// 样本数据
const sampleData = `App: 美团内测
App 版本: 12.41.400

EVA 项目: group
EVA 环境: product

VersionCode: 1200410400
UUID: 00000000000004683C4A3897B4664805D7CB320620307A175500445871134337

React Native SDK 版本: 0.63.3
MRN SDK 版本: 3.63.2
Base Bundle 版本: 3.0.71
JavaScript 执行引擎: JavaScriptCore
BaseBundle CodeFormat: JS
当前Bundle CodeFormat: JS

当前容器壳类型: c_container

当前页 Component: superdeal
launchOptions: {
"bundle_version" = "";
cityId = 1;
"city_id" = 1;
"cube_id" = 223551;
"engine_type" = 0;
"engine_type_horn" = 0;
isNested = 0;
isStandardContainer = 0;
mboxCouponId = 1403688762;
"mrn_biz" = hotel;
"mrn_component" = superdeal;
"mrn_entry" = superdeal;
"mrn_env_params" = {
env = test;
"fetch_bridge_type" = 0;
"is_remote" = 0;
"local_bundle" = 0;
"retry_count" = 0;
};
"mrn_fetch_bridge_type" = 0;
"mrn_page_create_time" = "1755678763862.831";
"mrn_run_application_time" = "1755678764281.001";
spuId = 794615414;
}
`;

function assignKeysToValues(target: string[], source: Dictionary) {
    const keys = Object.keys(source)
    return target.reduce((prev, current) => keys.includes(current) ? { ...prev, [current]: source[current] } : prev, {} as Dictionary)
}

function InputWorkSpace() {
    const { setExtractedData, targetFields, detectors } = CommandStore()
    const [inputText, setInputText] = useState("")

    // 字段提取逻辑
    const extractFields = useMemo<Dictionary>(() => {
        if (!inputText || !targetFields) return {};

        const fieldNames = targetFields.split(",")
        const result = parseTextData(inputText, detectors)
        if (targetFields === FieldTemplates['所有字段']) {
            return result
        }
        return assignKeysToValues(fieldNames, result)
    }, [inputText, targetFields]);

    // 更新提取结果
    useEffect(() => {
        setExtractedData(extractFields);
    }, [extractFields]);

    return (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-xl flex items-center">
                    <Search className="mr-2 text-blue-500" size={20} />
                    数据输入
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="input-text">输入文本数据</Label>
                    <Textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[280px] font-mono text-sm resize-none"
                        placeholder="粘贴包含字段数据的文本..."
                    />
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setInputText(sampleData)}
                >
                    使用样本数据
                </Button>
            </CardContent>
        </Card>
    )
}

export default InputWorkSpace
