'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import CustomLinkMain from '../CustomLink';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import LoggedInMenu from './LoggedInMenu';
import { BsGear } from 'react-icons/bs';
import SubMenuContainer from './SubMenuContainer';
import { BiMenu, BiX } from 'react-icons/bi';
import MobileSubMenuContaier from './MobileSubMenuContaier';

const NavVar1 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [is_transparent, setTransparent] = useState<boolean>(transparent);
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navRef = useRef<HTMLElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)   // hidden measuring row
    const logoRef = useRef<HTMLDivElement>(null)

    const [forceMobile, setForceMobile] = useState(false)
    const [isReady, setIsReady] = useState(false)     // prevent first-paint flash 

    const checkOverflow = useCallback(() => {
        if (!navRef.current || !measureRef.current || !logoRef.current) return

        const navWidth = navRef.current.clientWidth
        const logoWidth = logoRef.current.offsetWidth
        const safety = 140                               // breathing room

        const available = navWidth - logoWidth - safety
        const required = measureRef.current.scrollWidth
        console.log("navWidth", navWidth, "required", required, "available", available)
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

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "nav",
                    "type": "section",
                    "name": "NavVar1",
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

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
            <nav ref={navRef} className={`fixed w-full flex justify-between items-center px-8 py-2 z-50 h-20 
                transition-all duration-500 ease-out ${(!isScrolled && is_transparent) ? "bg-transparent" : "bg-white shadow-md"}`}>
                <div ref={logoRef} className="shrink-0">
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
                            </div>
                        ))}
                </div>
                {/* ===== HIDDEN MEASURING ROW (never affects layout) ===== */}


                <div className={`${!isReady || forceMobile ? "hidden" : "flex"} shrink-0 items-center rounded *:flex *:items-center *:justify-center *:px-6 *:py-3 *:border-b-4 
                    *:border-b-transparent *:cursor-pointer transition-all duration-500 ease-out
                    ${(!isScrolled && is_transparent) ? "*:text-white bg-black/50 py-2" : "*:text-gray-800"}`}>

                    {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                        themeSett.top_menu.map((menu: any, index: any) => {

                            //Submenu
                            if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {

                                return <SubMenuContainer key={index} menu={menu} themeSett={themeSett} is_theme={is_theme} />

                            } else {
                                return <CustomLinkMain key={index} href={`${menu.link ? menu.link : ""}`} is_theme={is_theme} className={` hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150`}>{menu.title}</CustomLinkMain>
                            }
                        })
                    ) : null}

                    {(user.isLogged)
                        ? <LoggedInMenu is_theme={is_theme} />
                        : <CustomLinkMain href={`/login`} is_theme={is_theme} className={`transition-all ease-in hover:delay-150 mx-3 rounded
                        bg-${themeSett.primary_color} !text-white hover:shadow-2xl !px-8 !border-b-0`}>Login</CustomLinkMain>
                    }
                </div>

                <button className={!isReady || forceMobile ? "block cursor-pointer" : "md:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)} >
                    {isMenuOpen ? (
                        <BiX className={"text-gray-900"} size={24} />
                    ) : (
                        <BiMenu className={"text-gray-900"} size={24} />
                    )}
                </button>

                {isMenuOpen &&
                    <div className={` absolute w-full top-20 right-0 bg-white shadow-xl flex flex-col *:flex *:px-5 *:py-4 
                        divide-y divide-gray-200 rounded-b-md overflow-y-auto max-h-[calc(100dvh-80px)] 
                        transition-all duration-500 ease-out`}>
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

                {is_theme && (
                    <div id='editor_settings' className='absolute z-[1000] right-1.5 top-1.5 bg-gray-200 text-gray-800 flex items-center 
                    justify-center p-2 rounded cursor-pointer hover:shadow-2xl'
                        onClick={handleSettingsClick}>
                        <BsGear size={17} />
                    </div>
                )}
            </nav>
        )
    } else {
        return (<div className=' h-56 w-full flex items-center justify-between'>Theme setting not found</div>)
    }
}

export default NavVar1