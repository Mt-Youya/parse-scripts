import { useRef, useState } from "react"
import { useGSAP } from '@gsap/react';
import gsap from "gsap"

gsap.registerPlugin(useGSAP);


const perimeter = 2 * 20 * Math.PI
const { scrollTo } = window

function getPreciseScrollPercentage() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight <= clientHeight) {
        return 1;
    }

    const maxScroll = scrollHeight - clientHeight;
    return scrollTop / maxScroll
}

function BackToTop() {
    const [rate, setRate] = useState(0)
    const toTopRef = useRef<HTMLDivElement | null>(null)


    useGSAP(() => {
        if (toTopRef.current) {
            if (window.scrollY < 200) {
                // toTopRef.current.style.bottom = "-3rem"
                // toTopRef.current.style.opacity = "0"
                gsap.from(toTopRef.current, {
                    bottom: '-3rem',
                    opacity: 0,
                    duration: .1
                })

            } else {
                // toTopRef.current.style.bottom = "6rem"
                // toTopRef.current.style.opacity = "1"
                gsap.to(toTopRef.current, {
                    bottom: '6rem',
                    opacity: 1,
                    duration: .4
                })
            }
        }

        const rateComputed = getPreciseScrollPercentage() * perimeter
        setRate(rateComputed)
    }, { scope: '#root' });


    return (
        <div ref={toTopRef} onClick={() => scrollTo({ top: 0, behavior: "smooth" })} title="Back To Top"
            className="w-12 h-12 bg-transparent fixed bottom-0 right-12 text-black flex justify-center items-center cursor-pointer opacity-0 transition-all ease-in-out duration-300 z-50 drop-shadow"
        >
            <svg className="absolute top-0 left-0 w-10.5 h-10.5">
                <circle cx="21" cy="21" r="20" stroke="#ca2015" fill="#fff" strokeWidth="0.125rem" className="transition-all ease-in-out duration-300" strokeDasharray={rate + ", " + perimeter} />
            </svg>
            <svg
                className="relative -top-1 -left-1 hover:repeat-infinite duration-1000 ease-in-out hover:-translateY-24"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g className="">
                    <path fill="currentColor" d="M1.73734 0.5V1.75H14.2373V0.5H1.73734Z" />
                    <path
                        fill="currentColor"
                        d="M15.0669 8.86364L14.1831 9.74752L8.62087 4.18534V15.5426H7.37087V4.18534L1.80869 9.74752L0.924805 8.86364L7.99587 1.79257L15.0669 8.86364Z"
                    />
                </g>
                <g>
                    <path fill="currentColor" d="M1.73734 0.5V1.75H14.2373V0.5H1.73734Z" />
                    <path
                        fill="currentColor"
                        d="M15.0669 8.86364L14.1831 9.74752L8.62087 4.18534V15.5426H7.37087V4.18534L1.80869 9.74752L0.924805 8.86364L7.99587 1.79257L15.0669 8.86364Z"
                    />
                </g>
            </svg>
        </div>
    )
}

export default BackToTop