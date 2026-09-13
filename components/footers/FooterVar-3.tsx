'use client';

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { BsChevronBarUp, BsGear, BsGithub, BsLinkedin, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiChat, BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { LiaLinkedin } from 'react-icons/lia';
import CustomLinkMain from '../CustomLink';

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
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
                        <div className="flex items-center h-[55px] -mt-4">
                            <Image src={`${themeSett?.light_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                        </div>

                        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 -mt-2 text-sm">
                            {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                                themeSett.footer_menu.map((menu: any, index: any) => {

                                    return ((Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                        <>
                                            {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                return <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                    className={`text-gray-800 transition-all py-2 px-3 rounded-md
                                                    cursor-pointer hover:text-gray-950 hover:bg-gray-100`}>
                                                    {/* <FaArrowRightLong size={13} /> */}
                                                    <span>{sub_menu.title}</span>
                                                </CustomLinkMain>
                                            })}
                                        </>
                                    ) : null)
                                })
                            ) : null}
                        </nav>

                        <div className="flex items-center gap-4">
                            {brker_info?.social_accounts?.facebook &&
                                <Link href={`${brker_info?.social_accounts?.facebook}`} target='_blank'
                                    className="text-muted-foreground transition-colors hover:text-foreground">
                                    <FaFacebook size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.twitter &&
                                <Link href={`${brker_info?.social_accounts?.twitter}`} target='_blank'
                                    className="text-muted-foreground transition-colors hover:text-foreground">
                                    <BsTwitterX size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.linkedin &&
                                <Link href={`${brker_info?.social_accounts?.linkedin}`} target='_blank'
                                    className="text-muted-foreground transition-colors hover:text-foreground">
                                    <LiaLinkedin size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.youtube &&
                                <Link href={`${brker_info?.social_accounts?.youtube}`} target='_blank'
                                    className="text-muted-foreground transition-colors hover:text-foreground">
                                    <FaYoutube size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.whatsapp &&
                                <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`} target='_blank'
                                    className="text-muted-foreground transition-colors hover:text-foreground">
                                    <BsWhatsapp size={20} />
                                </Link>
                            }
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-300 pt-8 text-center">
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground justify-center gap-6 text-gray-800">
                            <CustomLinkMain href="/privacy-policy" className="transition-all py-2 px-3 rounded-md cursor-pointer 
                            hover:text-gray-950 hover:bg-gray-100">Privacy Policy</CustomLinkMain>
                            <CustomLinkMain href="/terms" className="transition-all py-2 px-3 rounded-md cursor-pointer 
                            hover:text-gray-950 hover:bg-gray-100">Terms of Service</CustomLinkMain>
                        </div>
                        <p className="text-sm text-muted-foreground pt-5">
                            &copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera
                        </p>
                    </div>
                </div>

                {/* ${showButtons ? "fixed" : "hidden"}  */}
                <div className={`fixed bottom-8 flex justify-end right-2.5`}>
                    <div className=' flex flex-col space-y-3.5 *:flex *:items-center *:justify-center *:size-11 *:rounded-full *:cursor-pointer'>
                        {showButtons &&
                            <div className='text-white bg-gray-800 hover:drop-shadow-xl' onClick={backToTop}>
                                <BsChevronBarUp size={20} />
                            </div>
                        }

                        {brker_info?.social_accounts?.whatsapp &&
                            <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`} target='_blank' className='text-white bg-green-700 hover:drop-shadow-xl'>
                                <BsWhatsapp size={20} />
                            </Link>
                        }

                        <div className='text-white bg-amber-600 hover:drop-shadow-xl'>
                            <BiChat size={20} />
                        </div>
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