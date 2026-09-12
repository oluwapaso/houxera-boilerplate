'use client';

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { BsGear, BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import { BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';

const FooterVar3 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const brker_info = useSelector((state: RootState) => state.broker);
    const [showButtons, setShowButtons] = useState(false);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "footer",
                    "type": "section",
                    "name": "FooterVar3",
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleMoveClick = (direction: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'MOVE_SECTION',
                direction: direction,
                component_index: raw_data?.component_index
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "Footer"
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleHover = () => {
        setSectionHover(true);
    }

    const handleMouseExist = () => {
        setSectionHover(false);
    }

    useEffect(() => {

        const handleScroll = () => {
            if (window.scrollY > 750) {
                setShowButtons(true);
            } else {
                setShowButtons(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);


    if (themeSett) {

        return (
            <footer className="border-t border-gray-300 bg-background relative">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                                <span className="text-sm font-bold text-background">M</span>
                            </div>
                            <span className="text-lg font-semibold text-foreground">Minimal</span>
                        </div>

                        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                Home
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                About
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                Services
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                Contact
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                <BsTwitterX className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                <BsGithub className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                <BsLinkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-300 pt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Minimal. All rights reserved.
                        </p>
                    </div>
                </div>


                {is_theme && (
                    <div className='absolute z-[1000] right-1.5 top-2.5 space-x-2 flex items-center justify-end 
                    *:bg-gray-800 *:text-white *:flex *:items-center *:justify-center *:p-2 *:rounded *:cursor-pointer'>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsGear size={17} />
                            <span className='absolute hidden right-0 group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Footer Settings
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REPLACE_FOOTER")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiRefresh size={17} />

                            <span className='absolute hidden right-0 group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Replace Footer
                            </span>
                        </div>
                    </div>
                )}
            </footer>
        )

    }
}

export default FooterVar3