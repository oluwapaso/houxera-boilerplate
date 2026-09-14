'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong, FaFacebook, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsArrowDown, BsArrowRight, BsArrowUp, BsArrowUpRight, BsChevronBarUp, BsClock, BsGear, BsGithub, BsInstagram, BsLinkedin, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiBuilding, BiChat, BiEnvelopeOpen, BiHeart, BiHome, BiLayerPlus, BiMapPin, BiPhone, BiRefresh, BiTrash } from 'react-icons/bi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PiPhoneIncoming } from 'react-icons/pi';
import { LiaLinkedin } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import CustomLinkMain from '../CustomLink';
import { Button } from '../Button';
import { CgMail } from 'react-icons/cg';
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
const FooterVar8 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    // ...raw_data,
                    ...themeSett?.footer_settings,
                    "component": "FooterVar8",
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
            <footer className="bg-[#f8f6f3] relative">
                {/* Newsletter */}
                {themeSett?.footer_settings?.show_newsletter == "Yes" &&
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="py-16 border-b border-stone-200 text-center">
                            <h3 className="text-2xl font-serif text-stone-800">
                                {themeSett?.footer_settings?.newsletter_header || "Stay Updated"}
                            </h3>
                            <p className="mt-2 text-stone-500 text-sm max-w-md mx-auto">
                                {themeSett?.footer_settings?.newsletter_sub_header || "Get the latest listings and market insights."}
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-white border border-stone-200 flex-1 px-4 shadow-lg rounded"
                                />
                                <button className={`w-fit flex items-center space-x-1 px-4 py-2 rounded cursor-pointer 
                                    bg-${themeSett.primary_color} text-${themeSett.primary_button_text} hover:shadow-xl 
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                                    <span>{themeSett?.footer_settings?.newsletter_button_text || "Subscribe"}</span>
                                    <BsArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                }

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <div className="flex items-center gap-3 h-[55px]">
                                    <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-stone-500 max-w-xs mx-auto md:mx-0">
                                {themeSett?.footer_settings?.footer_note || `Curating beautiful homes with heart. 
                                We believe finding your perfect space should be a joyful journey.`}
                            </p>
                        </div>

                        {/* Services */}
                        <div className="grid grid-cols-2 gap-8">
                            {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                                themeSett.footer_menu.map((menu: any, index: any) => {

                                    return (
                                        <div>
                                            <div key={index} className=''>
                                                <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-4">
                                                    {menu.title}
                                                </h4>

                                                {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                                    <ul className="space-y-2 *:cursor-pointer">
                                                        {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                            return <li key={sub_index}>
                                                                <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
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
                        </div>

                        {/* Contact & Social */}
                        <div className="flex flex-col items-center md:items-end">
                            <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-4">Get in Touch</h4>
                            <div className=' flex flex-col space-y-1 items-center md:items-end'>
                                <p className="text-sm text-stone-600">
                                    <Link href={`tel:${brker_info?.contact_info?.phone_cell}`} className={`hover:text-${themeSett.primary_color}`}>
                                        {brker_info?.contact_info?.phone_cell}
                                    </Link>
                                </p>
                                <p className="text-sm">
                                    <Link href={`mailto:${brker_info?.email}`} className={`hover:text-${themeSett.primary_color}`}>
                                        {brker_info?.email}
                                    </Link>
                                </p>
                                <span className='text-sm text-stone-600'>
                                    <span> {brker_info?.contact_info?.address}</span>
                                    {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                        ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                </span>
                            </div>

                            <div className="flex gap-4 mt-6">
                                {brker_info?.social_accounts?.facebook &&
                                    <Link href={`${brker_info?.social_accounts?.facebook}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <FaFacebook size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.twitter &&
                                    <Link href={`${brker_info?.social_accounts?.twitter}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <BsTwitterX size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.linkedin &&
                                    <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <LiaLinkedin size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.youtube &&
                                    <Link href={`${brker_info?.social_accounts?.youtube}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                        <FaYoutube size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.whatsapp &&
                                    <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                        className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank' >
                                        <BsWhatsapp size={20} />
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-stone-200">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
                            <p>&copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera</p>
                            <div className="flex gap-6">
                                <CustomLinkMain href="/privacy-policy" is_theme={is_theme} className="hover:text-stone-600 transition-colors cursor-pointer">
                                    Privacy Policy
                                </CustomLinkMain>

                                <CustomLinkMain href="/terms" is_theme={is_theme} className="hover:text-stone-600 transition-colors cursor-pointer">
                                    Terms of Service
                                </CustomLinkMain>
                            </div>
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

export default FooterVar8