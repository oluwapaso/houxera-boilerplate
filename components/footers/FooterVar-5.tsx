'use client';

import React, { useEffect, useState } from 'react'
import { FaFacebook, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsArrowRight, BsChevronBarUp, BsGear, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiChat, BiPhone, BiRefresh } from 'react-icons/bi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { LiaLinkedin } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import CustomLinkMain from '../CustomLink';
import { CgMail } from 'react-icons/cg';
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
const FooterVar5 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "component": "FooterVar5",
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
            <footer className="bg-[#0f172a] text-white relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Newsletter Section */}
                    <div className="py-12 border-b border-white/10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold">
                                    {themeSett.newsletter_header ? themeSett.newsletter_header : "Stay Updated"}
                                </h3>
                                <p className="mt-1 text-white/60 text-sm">
                                    {themeSett.newsletter_sub_header
                                        ? themeSett.newsletter_sub_header
                                        : "Get the latest listings and market insights."
                                    }
                                </p>
                            </div>
                            <div className="flex w-full md:w-auto gap-2">
                                <input type="email" placeholder="Enter your email"
                                    className="px-3 rounded bg-white/5 border-white/10 text-white 
                                    placeholder:text-white/40 min-w-[280px]"
                                />
                                <button className={`w-full flex items-center space-x-1.5 px-3 py-2 rounded cursor-pointer 
                                    bg-${themeSett.primary_color} text-${themeSett.primary_button_text} 
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                                    <span>{themeSett.newsletter_btn_text ? themeSett.newsletter_btn_text : "Subscribe"}</span>
                                    <BsArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
                        {/* Brand */}
                        <div className="col-span-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-3 h-[55px]">
                                    <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-white/60 max-w-xs">
                                {themeSett?.footer_note || ` Modern real estate solutions powered by technology. Find, buy, or sell properties with confidence.`}
                            </p>
                            <div className="flex gap-3 mt-6">
                                {brker_info?.social_accounts?.facebook &&
                                    <Link href={`${brker_info?.social_accounts?.facebook}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-${themeSett.primary_button_text} 
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <FaFacebook size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.twitter &&
                                    <Link href={`${brker_info?.social_accounts?.twitter}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-${themeSett.primary_button_text} 
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <BsTwitterX size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.linkedin &&
                                    <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-${themeSett.primary_button_text} 
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <LiaLinkedin size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.youtube &&
                                    <Link href={`${brker_info?.social_accounts?.youtube}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-${themeSett.primary_button_text} 
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <FaYoutube size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.whatsapp &&
                                    <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-${themeSett.primary_button_text} 
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank' >
                                        <BsWhatsapp size={20} />
                                    </Link>
                                }
                            </div>
                        </div>

                        {/* Services */}
                        {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                            themeSett.footer_menu.map((menu: any, index: any) => {

                                return (
                                    <div>
                                        <div key={index} className=''>
                                            <h4 className="font-semibold text-white mb-4">
                                                {menu.title}
                                            </h4>

                                            {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                                <ul className="space-y-2.5">
                                                    {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                        return <li key={sub_index}>
                                                            <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                                className={`text-sm text-white/60 transition-all cursor-pointer 
                                                                hover:text-${themeSett.primary_color}`}>
                                                                {/* <FaArrowRightLong size={13} /> */}
                                                                <span>{sub_menu.title}</span>
                                                            </CustomLinkMain>
                                                        </li>
                                                    })}
                                                </ul>
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })
                        ) : null}

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="h-4 w-4 shrink-0" />
                                    <span className=' flex flex-col -mt-1'>
                                        <span> {brker_info?.contact_info?.address}</span>
                                        {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                            ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <BiPhone className="h-4 w-4 shrink-0" />
                                    <span>
                                        <Link href={`tel:${brker_info?.contact_info?.phone_cell}`} className={`hover:text-${themeSett.primary_color}`}>
                                            {brker_info?.contact_info?.phone_cell}
                                        </Link>
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CgMail className="h-4 w-4 shrink-0" />
                                    <span>
                                        <Link href={`mailto:${brker_info?.email}`} className={`hover:text-${themeSett.primary_color}`}>
                                            {brker_info?.email}
                                        </Link>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/40">
                            &copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <CustomLinkMain href="/privacy-policy" is_theme={is_theme} className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">
                                Privacy Policy
                            </CustomLinkMain>

                            <CustomLinkMain href="/terms" is_theme={is_theme} className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">
                                Terms of Service
                            </CustomLinkMain>
                        </div>
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
                            <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                target='_blank' className='text-white bg-green-700 hover:drop-shadow-xl'>
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

export default FooterVar5