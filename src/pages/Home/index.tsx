import { Link } from "react-router-dom"
import { Button } from '@/ui/button'
import GenerateCommand from './components/GenerateCommand'
import InputWorkSpace from './components/InputWorkSpace'
import OptionResult from './components/OptionResult'
import Main from '@/layouts/Main'

function Home() {
    return (
        <Main>
            <div>
                <Button asChild>
                    <span><Link to="/contrast">   前往 JSON 对比  </Link> </span>
                </Button>

                <Button asChild>
                    <span><Link to="/bogo">   喜加一  </Link> </span>
                </Button>
            </div>
            {/* 主要工作区 */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 输入区域 */}
                <InputWorkSpace />
                {/* 配置和结果区域 */}
                <OptionResult />
            </main>
            {/* 生成的命令 */}
            <GenerateCommand />
        </Main>
    )
}

export default Home
