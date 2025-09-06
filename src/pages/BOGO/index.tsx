import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ExternalLink, Gamepad2 } from 'lucide-react';

const urls = [
    {
        name: "Epic Games Store",
        list: [
            { title: "每周免费游戏", url: "https://store.epicgames.com/zh-CN/free-games" },
            { title: "Epic Games 促销", url: "https://store.epicgames.com/zh-CN/sales-and-specials" }
        ]
    },
    {
        name: "Steam",
        list: [
            { title: "Steam 免费游戏", url: "https://store.steampowered.com/genre/Free%20to%20Play/" },
            { title: "Steam 限时免费", url: "https://steamdb.info/upcoming/free/" }
        ]
    },
    {
        name: "GOG",
        list: [
            { title: "GOG 免费游戏", url: "https://www.gog.com/games?priceRange=0,0&sort=popularity&page=1" }
        ]
    },
    {
        name: "其他平台",
        list: [
            { title: "Itch.io 免费游戏", url: "https://itch.io/games/free" },
            { title: "Game Jolt 免费游戏", url: "https://gamejolt.com/games/free" }
        ]
    }
];

const FreeGamesUrl = [
    {
        href: 'https://www.epicgames.com/store/zh-CN/free-games',
        api: "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions",
        name: "Epic 免费游戏"
    }
]

function BOGO() {

    const [urls, setUrls] = useState([])

    async function getUrls() {
        for (const { href, api, name } of FreeGamesUrl) {
            try {
                const params = new URLSearchParams({
                    locale: 'zh-CN',
                    country: 'CN',
                    allowCountries: 'CN',
                    api
                });

                const response = await fetch(`/api/epic?${params.toString()}`);
                const data = await response.json();
                const games = data.data.Catalog.searchStore.elements ?? [];
                setUrls(prev => [
                    ...prev,
                    {
                        title: name,
                        href,
                        list: games.map((game: any) => ({
                            title: game.title,
                            url: `https://www.epicgames.com/store/zh-CN/p/${game?.catalogNs?.mappings?.[0]?.pageSlug}`
                        }))
                    }
                ]);
            } catch (error) {
                console.error('Error fetching Epic games:', error);
            }
        }
    }


    useEffect(() => {
        getUrls()
    }, [])


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* 头部区域 */}
                <div className="text-center mb-10">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <Gamepad2 className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            免费游戏
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        下面是一些常见的免费游戏获取地址，点击链接可以直接访问对应的页面，发现你的下一个最爱游戏！
                    </p>
                </div>

                {/* 游戏平台卡片网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {urls.map(({ name, list }, index) => (
                        <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {name}
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-xs">
                                        {list?.length || 0} 个链接
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {list?.map(({ title, url }, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/80 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 group/item">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm text-foreground truncate group-hover/item:text-primary transition-colors">
                                                {title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate mt-1">
                                                {new URL(url).hostname}
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 opacity-70 group-hover/item:opacity-100 hover:bg-primary/10"
                                        >
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">访问 {title}</span>
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 底部提示 */}
                <div className="mt-12 text-center">
                    <Card className="inline-block p-4 bg-primary/5 border-primary/20">
                        <p className="text-sm text-muted-foreground">
                            💡 提示：建议定期检查这些平台，以免错过限时免费的优质游戏！
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default BOGO
