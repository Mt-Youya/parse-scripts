import { useEffect, useRef, useState } from "react"



const perimeter = 2 * 20 * Math.PI
const { scrollTo } = window

function BackToTop() {
    const [rate, setRate] = useState(0)
    const toTop = useRef<HTMLDivElement | null>(null)

    function transitionBackToTop() {
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.body.clientHeight
        const rateComputed = ((window.scrollY + clientHeight) / scrollHeight) * perimeter

        if (toTop.current) {
            if (window.scrollY < 200) {
                toTop.current.style.bottom = "-3rem"
                toTop.current.style.opacity = "0"
            } else {
                toTop.current.style.bottom = "6rem"
                toTop.current.style.opacity = "1"
            }
        }
        setRate(rateComputed)
    }


    useEffect(() => {
        window.addEventListener("scroll", transitionBackToTop)
        return () => window.removeEventListener("scroll", transitionBackToTop)
    }, [])

    return (
        <div ref={toTop} onClick={() => scrollTo({ top: 0, behavior: "smooth" })} title="Back To Top"
            className="w-12 h-12 bg-transparent fixed bottom-0 right-12 text-black flex justify-center items-center cursor-pointer opacity-0 transition-all ease-in-out duration-300 z-50"
        >
            <svg className="absolute top-0 left-0 w-10.5 h-10.5">
                <circle cx="21" cy="21" r="20" stroke="#ca2015" fill="#fff" strokeWidth="0.125rem" className="transition-all ease-in-out duration-300" strokeDasharray={rate + ", " + perimeter} />
            </svg>
            <svg
                className="relative -top-1 -left-1 hover:repeat-infinite duration-1000 ease-in-out"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path fill="currentColor" d="M1.73734 0.5V1.75H14.2373V0.5H1.73734Z" />
                <path
                    fill="currentColor"
                    d="M15.0669 8.86364L14.1831 9.74752L8.62087 4.18534V15.5426H7.37087V4.18534L1.80869 9.74752L0.924805 8.86364L7.99587 1.79257L15.0669 8.86364Z"
                />
            </svg>
        </div>
    )
}

export default BackToTop