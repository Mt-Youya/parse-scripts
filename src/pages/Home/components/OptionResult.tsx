import { AlertCircle, Settings } from 'lucide-react';
import { isEmpty } from "lodash-es"
import { CommandStore } from '@/stores/command';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';
import { FieldTemplates } from '@/constants/FieldTemplates';
import { Checkbox } from '@/ui/checkbox';
import CopyComp from '@/layouts/CopyComp';

function OptionResult() {
    const { extractedData, targetFields, setTargetFields, detectors, setDetectors } = CommandStore()

    return (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-xl flex items-center">
                    <Settings className="mr-2 text-green-500" size={20} />
                    字段配置
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="target-fields">目标字段 (逗号分隔)</Label>
                    <Input
                        id="target-fields"
                        value={targetFields}
                        onChange={(e) => setTargetFields(e.target.value)}
                        className="font-mono"
                        placeholder="cityId,mboxCouponId,spuId"
                    />
                </div>

                {/* 字段模板 */}
                <div className="space-y-2">
                    <Label>快速模板</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(FieldTemplates).map(([name, template]) => (
                            <Badge
                                key={name}
                                variant="secondary"
                                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                onClick={() => setTargetFields(template)}
                            >
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label> 使用的解析器 </Label>
                    <ul className='grid grid-cols-2'>
                        {detectors.map(({ name, format, checked }, idx) => (
                            <li key={idx + name} className='flex flex-start gap-2 space-y-1'>
                                <Checkbox
                                    id={idx + format} checked={checked}
                                    onCheckedChange={() => setDetectors(detectors.map(item => ({ ...item, checked: item.format === format ? !checked : item.checked })))}
                                />
                                <Label htmlFor={idx + format} >  {name} </Label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 提取结果 */}
                <div className="space-y-2">
                    <Label>提取结果</Label>
                    <div className="bg-slate-50 p-4 rounded-lg border min-h-[120px]">
                        {isEmpty(extractedData) ? (
                            <div className="flex items-center justify-center h-full text-slate-500 italic">
                                <AlertCircle size={16} className="mr-2" />
                                暂无提取结果
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    {Object.entries(extractedData).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center bg-white p-3 rounded-md border shadow-sm">
                                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                {key}
                                            </Badge>
                                            <code className="text-slate-800 bg-slate-100 px-2 py-1 rounded text-sm">
                                                {JSON.stringify(value)}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                                <CopyComp copyValue={extractedData} text="复制为JSON" />
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default OptionResult
