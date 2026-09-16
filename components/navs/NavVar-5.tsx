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
import { FaFacebook } from "react-icons/fa6"
import { LiaLinkedin } from "react-icons/lia"
import { FaYoutube } from "react-icons/fa"
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
const NavVar5 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const brker_info = useSelector((state: RootState) => state.broker);
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
        if (!navRef.current || !measureRef.current || !logoRef.current) return

        const navWidth = navRef.current.clientWidth
        const logoWidth = logoRef.current.offsetWidth
        const safety = 165 // breathing room

        const available = navWidth - logoWidth - safety
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

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [isMenuOpen]);

    if (themeSett) {
        return (
            <nav ref={navRef} className={`fixed flex flex-col items-center ${!isReady || forceMobile ? "h-18" : "h-[100px]"} z-50 transition-all duration-500 ease-out top-0 left-0 right-0 bg-[#f8f6f3]`}>

                <div className={`w-full max-w-7xl mx-auto grow`}>
                    <div className="flex items-center h-full justify-between">
                        <div ref={logoRef} className={`shrink-0 h-full flex items-center justify-center px-6 bg-${themeSett.primary_color}`}>
                            <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
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
                                    </div>
                                ))}
                        </div>
                        {/* ===== HIDDEN MEASURING ROW (never affects layout) ===== */}


                        <div className={`${!isReady || forceMobile ? "hidden" : "flex flex-col"} grow h-full shrink-0 hidden-md:flex`}>

                            <div className={`w-full flex items-center justify-between text-sm py-2 px-6 gap-4 overflow-hidden`}>

                                {/* Left side - can also shrink if needed */}
                                <div className="flex items-center space-x-3 min-w-0 shrink">
                                    <Link
                                        href={`tel:${brker_info?.contact_info?.phone_cell}`}
                                        className={`flex items-center space-x-1.5 min-w-0`}
                                    >
                                        <BiPhoneOutgoing size={16} className="shrink-0" />
                                        <span className="truncate">{brker_info?.contact_info?.phone_cell}</span>
                                    </Link>

                                    <BsDot size={16} className="shrink-0" />

                                    <Link
                                        href={`mailto:${brker_info?.email}`}
                                        className={`flex items-center space-x-1.5 min-w-0`}
                                    >
                                        <BiEnvelope size={16} className="shrink-0" />
                                        <span className="truncate">{brker_info?.email}</span>
                                    </Link>
                                </div>

                                {/* Right side - can shrink and truncate */}
                                <div className="flex gap-4 min-w-0 flex-1 truncate items-center justify-end">
                                    {brker_info?.social_accounts?.facebook &&
                                        <Link href={`${brker_info?.social_accounts?.facebook}`}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <FaFacebook size={18} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.twitter &&
                                        <Link href={`${brker_info?.social_accounts?.twitter}`}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center 
                                            transition-colors
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <BsTwitterX size={18} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.linkedin &&
                                        <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center 
                                            transition-colors
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <LiaLinkedin size={18} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.youtube &&
                                        <Link href={`${brker_info?.social_accounts?.youtube}`}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center 
                                            transition-colors
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <FaYoutube size={18} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.whatsapp &&
                                        <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center 
                                            transition-colors
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank' >
                                            <BsWhatsapp size={18} />
                                        </Link>
                                    }
                                </div>
                            </div>

                            <div className={`h-0.5 bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent 
                                transition-opacity duration-700 `} />

                            <div className=" flex grow items-center justify-end space-x-2.5">
                                <div className={`flex h-full shrink-0 hidden-md:flex space-x-1 items-center 
                                    rounded *:flex *:items-center *:justify-center *:px-6 *:py-3 *:border-b-4 *:border-b-transparent 
                                    *:cursor-pointer *:whitespace-nowrap `}>
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
                                <div className={`${!isReady || forceMobile ? "invisible absolute pointer-events-none" : "flex"} h-full pr-6 shrink-0 items-center space-x-3`}>
                                    {(user.isLogged)
                                        ? <LoggedInMenu is_theme={is_theme} />
                                        : <button className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition-all duration-300 group 
                                        hover:shadow-2xl border border-${themeSett.primary_color} cursor-pointer 
                                        ${isScrolled
                                                ? `bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`
                                                : `bg-white text-${themeSett.primary_color}`}`} >
                                            <span>Log in</span>
                                            <BsArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    }
                                </div>
                            </div>

                        </div>



                        <button className={!isReady || forceMobile ? "block cursor-pointer pr-6" : "md:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)} >
                            {isMenuOpen ? (
                                <BiX className={"text-gray-900"} size={24} />
                            ) : (
                                <BiMenu className={"text-gray-900"} size={24} />
                            )}
                        </button>
                    </div>

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

export default NavVar5