"use client"

import { useState, useEffect } from "react"
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

    const [themeSett, setThemeSett] = useState<any | null>(null);

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
            <nav className={`fixed flex w-full items-center h-20 z-50 transition-all duration-500 ease-out ${isScrolled
                ? "top-4 left-4 right-4 bg-white rounded-lg shadow-xl px-6"
                : "top-0 left-0 right-0 bg-[#f8f6f3] px-8"}`} >
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl">
                            <Image src={`${themeSett?.light_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                        </CustomLinkMain>

                        <div className={`hidden md:flex space-x-1 items-center rounded *:flex *:items-center *:justify-center *:px-6 *:py-3 *:border-b-4 
                        *:border-b-transparent *:cursor-pointer  `}>
                            {/* {["Features", "Pricing", "Resources", "Enterprise"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isScrolled
                                        ? "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                                        : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                                        }`}
                                >
                                    {item}
                                </a>
                            ))} */}

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

                        <div className="hidden md:flex items-center space-x-3">

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

                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} >
                            {isMenuOpen ? (
                                <BiX className={"text-gray-900"} size={24} />
                            ) : (
                                <BiMenu className={"text-gray-900"} size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        )
    }
}

export default NavVar3