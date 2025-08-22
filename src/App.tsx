import Header from './layouts/Header';
import Instructions from './layouts/Instructions';
import GenerateCommand from './components/generateCommand';
import InputWorkSpace from './components/InputWorkSpace';
import OptionResult from './components/OptionResult';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />
        {/* 主要工作区 */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <InputWorkSpace />
          {/* 配置和结果区域 */}
          <OptionResult />
        </main>
        {/* 生成的命令 */}
        <GenerateCommand />
        {/* 使用说明 */}
        <Instructions />
      </div>
    </div>
  );
};

export default App;
