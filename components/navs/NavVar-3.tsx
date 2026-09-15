"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { BiMenu, BiX } from "react-icons/bi"
import { BsArrowRight } from "react-icons/bs"
import CustomLinkMain from "../CustomLink"
import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/app/GlobalRedux/store"
import SubMenuContainer from "./SubMenuContainer"
import LoggedInMenu from "./LoggedInMenu"

const NavVar3 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [is_transparent, setTransparent] = useState<boolean>(transparent);

    const navRef = useRef<HTMLElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)   // hidden measuring row
    const logoRef = useRef<HTMLDivElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    const [forceMobile, setForceMobile] = useState(false)
    const [isReady, setIsReady] = useState(false)     // prevent first-paint flash 

    const [themeSett, setThemeSett] = useState<any | null>(null);

    const checkOverflow = useCallback(() => {
        if (!navRef.current || !measureRef.current || !logoRef.current || !rightRef.current) return

        const navWidth = navRef.current.clientWidth
        const logoWidth = logoRef.current.offsetWidth
        const rightWidth = rightRef.current.offsetWidth
        const safety = 56                               // breathing room

        const available = navWidth - logoWidth - rightWidth - safety
        const required = measureRef.current.scrollWidth

        // Hysteresis: only switch when we clearly overflow / have room
        // This stops oscillation when the difference is only a few pixels
        setForceMobile(prev => {
            if (required > available + 8) return true      // clearly needs mobile
            if (required < available - 24) return false    // clearly has room
            return prev                                    // stay in current mode
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
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <nav ref={navRef} className={`fixed flex items-center h-20 z-50 transition-all duration-500 ease-out ${isScrolled
                ? `top-4 left-4 right-4 bg-white ${isMenuOpen ? `rounded-t-lg` : `rounded-lg`} shadow-xl px-6`
                : "top-0 left-0 right-0 bg-[#f8f6f3] px-8"}`} >
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div ref={logoRef}>
                            <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl">
                                <Image src={`${themeSett?.light_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                            </CustomLinkMain>
                        </div>

                        {/* ===== HIDDEN MEASURING ROW (never affects layout) ===== */}
                        <div
                            ref={measureRef}
                            aria-hidden="true"
                            className="absolute opacity-0 pointer-events-none flex space-x-1 items-center
                            *:flex *:items-center *:justify-center *:px-6 *:py-3 whitespace-nowrap"
                            style={{ visibility: "hidden", height: 0, overflow: "hidden" }}>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) &&
                                themeSett.top_menu.map((menu: any, index: number) => (
                                    <div key={`measure-${index}`} className="px-6 py-3">
                                        {menu.title}
                                        {/* if SubMenuContainer adds a chevron, mimic it here */}
                                        {/* {Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0 && (
                                            <span className="ml-1">▾</span>
                                        )} */}
                                    </div>
                                ))}
                        </div>

                        <div className={`${!isReady || forceMobile ? "hidden" : "flex"} hidden-md:flex space-x-1 items-center rounded *:flex *:items-center *:justify-center *:px-6 *:py-3 *:border-b-4 
                        *:border-b-transparent *:cursor-pointer `}>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                                themeSett.top_menu.map((menu: any, index: any) => {

                                    //Submenu
                                    if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {

                                        return <SubMenuContainer key={index} menu={menu} themeSett={themeSett} is_theme={is_theme} />

                                    } else {
                                        return <CustomLinkMain key={index} href={`${menu.link ? menu.link : ""}`} is_theme={is_theme}
                                            className={` hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150`}>
                                            {menu.title}
                                        </CustomLinkMain>
                                    }
                                })
                            ) : null}
                        </div>

                        {/* Right side (login / logged-in menu) */}
                        <div ref={rightRef} className={`${!isReady || forceMobile ? "hidden" : "flex"} items-center space-x-3`}>
                            {(user.isLogged)
                                ? <LoggedInMenu is_theme={is_theme} />
                                : <button className={`flex items-center space-x-2 px-5 py-2.5 rounded-md font-medium transition-all duration-300 group 
                                    hover:shadow-2xl border border-${themeSett.primary_color} 
                                    ${isScrolled
                                        ? `bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`
                                        : `bg-white text-${themeSett.primary_color}`}`} >
                                    <span>Log in</span>
                                    <BsArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            }
                        </div>

                        <button className={forceMobile ? "block" : "md:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)} >
                            {isMenuOpen ? (
                                <BiX className={"text-gray-900"} size={24} />
                            ) : (
                                <BiMenu className={"text-gray-900"} size={24} />
                            )}
                        </button>
                    </div>

                    {isMenuOpen &&
                        <div className=' absolute w-full max---w-[90%] top-20 right-0  bg-white shadow-xl flex flex-col *:flex *:px-5 *:py-4 
                            divide-y divide-gray-200 rounded-b-md max-h-[300px] overflow-y-auto'>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                                themeSett.top_menu.map((menu: any, index: any) => {

                                    //Submenu
                                    if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {



                                    } else {
                                        return <CustomLinkMain key={index} href={`${menu.link ? menu.link : ""}`} is_theme={is_theme}
                                            className={` text-gray-900 hover:bg-${themeSett.primary_color} hover:text-white transition-all 
                                            ease-in hover:delay-150`}>
                                            {menu.title}
                                        </CustomLinkMain>
                                    }
                                })
                            ) : null}
                        </div>
                    }
                </div>
            </nav>
        )
    }
}

export default NavVar3