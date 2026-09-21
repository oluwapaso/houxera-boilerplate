"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { BiEnvelope, BiMenu, BiPhoneOutgoing, BiX } from "react-icons/bi"
import { BsArrowRight, BsDot, BsTwitterX, BsWhatsapp } from "react-icons/bs"
import CustomLinkMain from "../CustomLink"
import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/app/GlobalRedux/store"
import SubMenuContainer from "./SubMenuContainer"
import LoggedInMenu from "./LoggedInMenu"
import MobileSubMenuContaier from "./MobileSubMenuContaier"
import Link from "next/link"
import { FaMapMarkerAlt } from "react-icons/fa"

const NavVar7 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const brker_info = useSelector((state: RootState) => state.broker);
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [is_transparent, setTransparent] = useState<boolean>(transparent);

    const navRef = useRef<HTMLElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)   // hidden measuring row 
    const rightRef = useRef<HTMLDivElement>(null)

    const [forceMobile, setForceMobile] = useState(false)
    const [isReady, setIsReady] = useState(false)     // prevent first-paint flash 

    const [themeSett, setThemeSett] = useState<any | null>(null);

    const checkOverflow = useCallback(() => {
        if (!navRef.current || !measureRef.current || !rightRef.current) return

        const navWidth = navRef.current.clientWidth
        const rightWidth = rightRef.current.offsetWidth
        const safety = 165 // breathing room

        const available = navWidth - rightWidth - safety
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

        // first check
        checkOverflow()

        return () => {
            ro.disconnect()
            window.removeEventListener("resize", checkOverflow)
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

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [isMenuOpen]);

    if (themeSett) {
        return (
            <nav ref={navRef} id="NavVar7" data-is-mobile={forceMobile} className={`fixed flex flex-col space-y-2 items-center z-50 transition-all duration-500 
                ease-out top-0 left-0 right-0 bg-white ${!isReady || forceMobile ? "h-[80px]" : "h-[130px]"} `}>

                <div className="w-full mx-auto grow flex flex-col">

                    <div className={`flex items-center gap-2.5 px-6 py-4 ${!isReady || forceMobile ? "h-full" : ""}`}>
                        <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium shrink-0 text-2xl cursor-pointer">
                            <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                        </CustomLinkMain>

                        <div className={` grow flex items-center justify-end gap-8`}>
                            <div className=" hidden md:flex space-x-1.5">
                                <div>
                                    <FaMapMarkerAlt size={35} className={`mt-0.5 text-${themeSett.primary_color}`} />
                                </div>
                                <span className='text-sm flex flex-col grow'>
                                    <span className="font-medium text- text-gray-900"> {brker_info?.contact_info?.address}</span>
                                    {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                        ? <span className="text-gray-500 text-sm">{brker_info?.contact_info?.address_2}</span> : null}
                                </span>
                            </div>

                            <Link href={`tel:${brker_info?.contact_info?.phone_cell}`}
                                className={` hidden 2xs:flex hover:text-${themeSett.primary_color} space-x-1.5`}>
                                <div className=" shrink-0">
                                    <BiPhoneOutgoing size={35} className={`mt-0.5 text-${themeSett.primary_color}`} />
                                </div>
                                <span className='text-sm flex flex-col grow'>
                                    <span className="font-medium text- text-gray-900">{brker_info?.contact_info?.phone_cell}</span>
                                    <span className="text-gray-500 text-sm">Call Us</span>
                                </span>
                            </Link>
                        </div>

                        <button className={!isReady || forceMobile ? "block cursor-pointer" : "md:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)} >
                            {isMenuOpen ? (
                                <BiX className={"text-gray-900"} size={24} />
                            ) : (
                                <BiMenu className={"text-gray-900"} size={24} />
                            )}
                        </button>
                    </div>

                    <div className={` ${!isReady || forceMobile ? "invisible absolute pointer-events-none" : "flex"} w-full px-6 
                        bg-${themeSett.primary_color} text-${themeSett.primary_button_text} items-center grow justify-center`}>
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
                        {/* ===== HIDDEN MEASURING ROW (never affects layout) ===== */}


                        <div className={`${!isReady || forceMobile ? "hidden" : "flex"} shrink-0 grow hidden-md:flex space-x-1 
                            items-center justify-center rounded *:flex *:items-center *:justify-center *:px-6 *:py-1.5 *:border-b-4
                            *:border-b-transparent *:cursor-pointer *:whitespace-nowrap `}>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                                themeSett.top_menu.map((menu: any, index: any) => {

                                    //Submenu
                                    if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {

                                        return <SubMenuContainer key={index} menu={menu} themeSett={themeSett} is_theme={is_theme} />

                                    } else {
                                        return <CustomLinkMain key={index} href={`${menu.link ? menu.link : ""}`} is_theme={is_theme}
                                            className={` whitespace-nowrap hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150`}>
                                            {menu.title}
                                        </CustomLinkMain>
                                    }
                                })
                            ) : null}
                        </div>

                        {/* Right side (login / logged-in menu) */}
                        <div ref={rightRef} className={`${!isReady || forceMobile ? "invisible absolute pointer-events-none" : "flex"} shrink-0 items-center space-x-3`}>
                            {(user.isLogged)
                                ? <LoggedInMenu is_theme={is_theme} />
                                : <button className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition-all duration-300 group 
                                    border border-${themeSett.primary_color} cursor-pointer bg-white text-${themeSett.primary_color}`} >
                                    <span>Log in</span>
                                    <BsArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            }
                        </div>

                        <button className={!isReady || forceMobile ? "block cursor-pointer" : "md:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)} >
                            {isMenuOpen ? (
                                <BiX className={"text-gray-900"} size={24} />
                            ) : (
                                <BiMenu className={"text-gray-900"} size={24} />
                            )}
                        </button>
                    </div>

                    {/* Animated border bottom */}
                    <div className={`w-full bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent transition-opacity 
                    duration-700 ${!isReady || forceMobile ? "h-0.5 opacity-100" : "h-0 opacity-0"}`} />

                    {isMenuOpen &&
                        <div className={` absolute w-full top-24 right-0 bg-white shadow-xl flex flex-col *:flex *:px-5 *:py-4 
                            divide-y divide-gray-200 rounded-b-md overflow-y-auto transition-all duration-500 ease-out
                            ${isScrolled ? "max-h-[calc(100dvh-96px)]" : "max-h-[calc(100dvh-80px)]"}  `}>
                            {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                                themeSett.top_menu.map((menu: any, index: any) => {

                                    //Submenu
                                    if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {

                                        return <MobileSubMenuContaier key={index} menu={menu} themeSett={themeSett} is_theme={is_theme} />

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

export default NavVar7