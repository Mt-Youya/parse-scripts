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
                            url: `https://www.epicgames.com/store/zh-CN/p/${game.urlSlug}`
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
        <div>

            <h1>免费游戏</h1>
            下面是一些常见的免费游戏获取地址，点击链接可以直接访问对应的页面。

            <ul>
                {urls.map(({ name, list }, index) => (
                    <li key={index}>
                        <h2>{name}</h2>
                        <ul>
                            {list?.map(({ title, url }, idx) => (
                                <li key={idx}>
                                    <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BOGO