"use client"

import { RootState } from "@/app/GlobalRedux/store"
import { useState, useEffect } from "react"
import { BiChevronRight, BiGlobe } from "react-icons/bi"
import { BsLayers } from "react-icons/bs"
import { useSelector } from "react-redux"

const NavVar2 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [is_transparent, setTransparent] = useState<boolean>(transparent);

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

    if (themeSett) {
        return (
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${isScrolled ? "py-0" : "py-4"}`}>
                <div
                    className={`mx-auto transition-all duration-700 ease-out ${isScrolled
                        ? "max-w-full bg-indigo-950/95 backdrop-blur-xl"
                        : "max-w-6xl bg-white/10 backdrop-blur-md rounded-2xl mx-4"
                        }`} >
                    <div className={`flex items-center justify-between transition-all duration-700 ${isScrolled ? "px-8 py-3" : "px-6 py-4"}`}>
                        <div className="flex items-center space-x-3">
                            <div className={`rounded-xl transition-all duration-700 ${isScrolled
                                ? "bg-indigo-500 p-2"
                                : "bg-white/20 p-2.5"
                                }`} >
                                <BsLayers className="text-white" size={isScrolled ? 20 : 24} />
                            </div>
                            <div>
                                <span className={`font-bold text-lg ${isScrolled ? "text-white" : "text-gray-900"}`}>Stratum</span>
                                <span className={`block text-indigo-300 text-xs transition-all duration-700 overflow-hidden ${isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"}`} >
                                    Design System
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-1">
                            {["Components", "Templates", "Plugins", "Showcase"].map((item) => (
                                <a key={item} href="#" className={`px-4 py-2 transition-all duration-300 font-medium 
                                ${isScrolled
                                        ? "text-white/80 hover:text-white rounded-lg hover:bg-indigo-800/50"
                                        : "text-gray-900 hover:bg-white/10"}`} >
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className={`hidden sm:flex items-center space-x-1 transition-all duration-300 
                                ${isScrolled ? "text-sm text-white/80 hover:text-white" : "text-gray-900"}`} >
                                <BiGlobe size={16} />
                                <span>EN</span>
                            </button>

                            <button className={`group flex items-center space-x-2 bg-white text-indigo-950 font-semibold rounded-xl 
                            hover:bg-indigo-100 transition-all duration-300 ${isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5"}`} >
                                <span>Explore</span>
                                <BiChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated border bottom */}
                <div className={`h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-opacity 
                duration-700 ${isScrolled ? "opacity-100" : "opacity-0"}`} />
            </nav>
        )
    }
}

export default NavVar2