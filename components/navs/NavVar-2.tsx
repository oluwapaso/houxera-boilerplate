"use client"

import { RootState } from "@/app/GlobalRedux/store"
import { useState, useEffect, useRef, useCallback } from "react"
import { BiChevronRight, BiGlobe, BiMenu, BiX } from "react-icons/bi"
import { BsLayers } from "react-icons/bs"
import { useSelector } from "react-redux"
import CustomLinkMain from "../CustomLink"
import Image from "next/image"
import SubMenuContainer from "./SubMenuContainer"
import LoggedInMenu from "./LoggedInMenu"

const NavVar2 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [is_transparent, setTransparent] = useState<boolean>(transparent);

    const navRef = useRef<HTMLElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)   // hidden measuring row
    const logoRef = useRef<HTMLDivElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    const [forceMobile, setForceMobile] = useState(false)
    const [isReady, setIsReady] = useState(false)     // prevent first-paint flash 

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "nav",
                    "type": "section",
                    "name": "NavVar2",
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const checkOverflow = useCallback(() => {
        if (!navRef.current || !measureRef.current || !logoRef.current || !rightRef.current) return

        const navWidth = navRef.current.clientWidth
        const logoWidth = logoRef.current.offsetWidth

        // Always measure the real width of the right side,
        // even if we are currently in mobile mode
        const rightWidth = rightRef.current.scrollWidth || rightRef.current.offsetWidth || 120 // fallback

        const safety = 48 // you can lower this now
        const available = navWidth - logoWidth - rightWidth - safety
        const required = measureRef.current.scrollWidth

        console.log("nav", navWidth, "req", required, "avl", available, "logo", logoWidth, "right", rightWidth)

        setForceMobile(prev => {
            if (required > available + 12) return true
            if (required < available - 32) return false
            return prev
        })

        setIsReady(true)
    }, [])

    useEffect(() => {
        // Initial check + observer
        const ro = new ResizeObserver(() => {
            // small delay so layout settles
            requestAnimationFrame(checkOverflow)
        })

        if (navRef.current) ro.observe(navRef.current)
        if (measureRef.current) ro.observe(measureRef.current)

        window.addEventListener("resize", checkOverflow)

        // also re-check after fonts / logo image load
        const img = logoRef.current?.querySelector("img")
        if (img && !img.complete) {
            img.addEventListener("load", checkOverflow)
        }

        // first check
        checkOverflow()

        return () => {
            ro.disconnect()
            window.removeEventListener("resize", checkOverflow)
            if (img) img.removeEventListener("load", checkOverflow)
        }
    }, [checkOverflow, themeSett?.top_menu])

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [isMenuOpen]);

    if (themeSett) {
        return (
            <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${isScrolled ? "py-0" : "py-4"}`}>
                <div
                    className={`mx-auto transition-all duration-700 ease-out ${isScrolled
                        ? "max-w-full bg-white backdrop-blur-xl"
                        : ` max-w-[95%] xl:max-w-6xl bg-${themeSett.primary_color} text-${themeSett.primary_button_text} backdrop-blur-3xl 
                        rounded-xl mx-4 shadow-xl`
                        }`} >
                    <div className={`flex items-center justify-between transition-all duration-700 ${isScrolled ? "px-8 py-3" : "px-6 py-4"}`}>
                        <div ref={logoRef} className="shrink-0">
                            <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                <Image src={`${isScrolled ? themeSett?.dark_logo || "/Houxera-logo-black.png" : themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                            </CustomLinkMain>
                        </div>


                        {/* ===== HIDDEN MEASURING ROW (never affects layout) ===== */}
                        <div
                            ref={measureRef}
                            aria-hidden="true"
                            className="absolute opacity-0 pointer-events-none flex space-x-1 items-center
                            *:flex *:items-center *:justify-center *:px-4 *:py-3 whitespace-nowrap"
                            style={{ visibility: "hidden", height: 0, overflow: "hidden" }}>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) &&
                                themeSett.top_menu.map((menu: any, index: number) => (
                                    <div key={`measure-${index}`} className="px-4 py-3">
                                        {menu.title}
                                    </div>
                                ))}

                            <button className={`group cursor-pointer flex items-center space-x-2 bg-white text-gray-700 font-semibold rounded-md 
                            hover:bg-indigo-100 transition-all duration-300 ${isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5"}`} >
                                <span>Explore</span>
                                <BiChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        {/* ===== HIDDEN MEASURING ROW (never affects layout) ===== */}


                        <div className={`${!isReady || forceMobile ? "hidden" : "flex"} shrink-0 items-center space-x-1`}>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                                themeSett.top_menu.map((menu: any, index: any) => {

                                    //Submenu
                                    if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {

                                        return <SubMenuContainer key={index} menu={menu} themeSett={themeSett} is_theme={is_theme}
                                            classes={`px-4 py-2 transition-all duration-300 font-medium rounded-md cursor-pointer
                                                ${isScrolled
                                                    ? `text-gray-800 hover:text-${themeSett.primary_button_text} hover:bg-${themeSett.primary_color}`
                                                    : `text-${themeSett.primary_button_text} hover:text-gray-600 hover:bg-gray-100`}`} />

                                    } else {
                                        return <CustomLinkMain key={index} href={`${menu.link ? menu.link : ""}`} is_theme={is_theme}
                                            className={`px-4 py-2 transition-all duration-300 font-medium rounded-md cursor-pointer 
                                                ${isScrolled
                                                    ? `text-gray-800 hover:text-${themeSett.primary_button_text} hover:bg-${themeSett.primary_color}`
                                                    : `text-${themeSett.primary_button_text} hover:text-gray-600 hover:bg-gray-100`}`}>
                                            {menu.title}
                                        </CustomLinkMain>
                                    }
                                })
                            ) : null}
                        </div>

                        <div ref={rightRef} className={`${!isReady || forceMobile ? "invisible absolute pointer-events-none" : "flex"} 
                        shrink-0 items-center space-x-3`}>
                            {(user.isLogged)
                                ? <LoggedInMenu is_theme={is_theme} />
                                : <button className={`group cursor-pointer flex items-center space-x-2 bg-white text-gray-700 font-semibold 
                                    rounded-md  px-5 py-2.5`} >
                                    <span>Log in</span>
                                    <BiChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            }
                        </div>

                        <button className={!isReady || forceMobile ? "block cursor-pointer" : "hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)} >
                            {isMenuOpen ? (
                                <BiX className={`${isScrolled ? "text-gray-800" : `text-${themeSett.primary_button_text}`}`} size={24} />
                            ) : (
                                <BiMenu className={`${isScrolled ? "text-gray-800" : `text-${themeSett.primary_button_text}`}`} size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Animated border bottom */}
                <div className={`h-0.5 bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent transition-opacity 
                duration-700 ${isScrolled ? "opacity-100" : "opacity-0"}`} />
            </nav>
        )
    }
}

export default NavVar2