
import { Collapsible, CollapsibleContent, } from '@/ui/collapsible';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Search, Settings, } from 'lucide-react';
import { Button } from '@/ui/button';
import { CommandStore } from '@/stores/commond';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/ui/input';

function Header() {
    const { baseCommand, setBaseCommand, commandSuffix, setCommandSuffix } = CommandStore()
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            {/* 头部 */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                            <Search className="mr-3 text-blue-500" size={32} />
                            字段提取和命令生成工具
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSettings(!showSettings)}
                            className="gap-2"
                        >
                            <Settings size={16} />
                            设置
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* 设置面板 */}
            <Collapsible open={showSettings} onOpenChange={setShowSettings}>
                <CollapsibleContent>
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <Settings className="mr-2 text-slate-600" size={20} />
                                命令模板设置
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="base-command">基础命令</Label>
                                    <Input
                                        id="base-command"
                                        value={baseCommand}
                                        onChange={(e) => setBaseCommand(e.target.value)}
                                        className="font-mono text-sm"
                                        placeholder="hdc shell..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="command-suffix">命令后缀</Label>
                                    <Input
                                        id="command-suffix"
                                        value={commandSuffix}
                                        onChange={(e) => setCommandSuffix(e.target.value)}
                                        className="font-mono text-sm"
                                        placeholder="'"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
        </>
    )
}

export default Header
