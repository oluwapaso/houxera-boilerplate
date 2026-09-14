'use client';

import React, { useEffect, useState } from 'react'
import { FaFacebook, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsChevronBarUp, BsGear, BsInstagram, BsLinkedin, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiChat, BiRefresh } from 'react-icons/bi';
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
const FooterVar7 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "component": "FooterVar7",
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
            <footer className='w-full relative'>
                {/* CTA Banner */}
                <div className={`bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} text-${themeSett.primary_button_text} `}>
                    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {themeSett?.footer_settings?.footer_cta_header || "Ready to find your perfect home?"}
                                </h3>
                                <p className="text-amber-100 text-sm mt-1">
                                    {themeSett?.footer_settings?.footer_cta_sub_header || `Our agents are available 7 days a week`}
                                </p>
                            </div>
                            <div className="flex gap-3 *:px-6 *:py-3 *:rounded-md *:cursor-pointer *:transition-all">
                                <div className={`border border-gray-100  text-gray-100 bg-transparent hover:shadow-2xl
                                    hover:bg-${themeSett.primary_button_text} hover:text-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                                    {brker_info?.contact_info?.phone_cell}
                                </div>
                                <CustomLinkMain href="/contact-us" is_theme={is_theme} className={`bg-gray-100 text-${helpers.adjustColorShade(themeSett.primary_color, 1)} border border-transparent
                                    hover:bg-transparent hover:text-${helpers.adjustColorShade(themeSett.primary_color, -10)} hover:shadow-2xl
                                    hover:border-${helpers.adjustColorShade(themeSett.primary_color, -10)} `}>
                                    {themeSett?.footer_settings?.footer_cta_button_text || `Contact Us`}
                                </CustomLinkMain>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer */}
                <div className="bg-[#2c2c2c] text-white">
                    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* About */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-3 h-[55px]">
                                        <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-400 mb-4">
                                    {themeSett?.footer_note || `Trusted by families for over 40 years. We specialize in residential properties,
                                    helping you find not just a house, but a home.`}
                                </p>
                            </div>

                            {/* Services */}
                            {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                                themeSett.footer_menu.map((menu: any, index: any) => {

                                    return (
                                        <div>
                                            <div key={index} className=''>
                                                <h4 className={`font-semibold mb-4 text-${themeSett.primary_color} `}>
                                                    {menu.title}
                                                </h4>

                                                {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                                    <ul className="space-y-3">
                                                        {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                            return <li key={sub_index}>
                                                                <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                                    className="text-sm text-neutral-400 hover:text-white transition-colors">
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
                                <h4 className={`font-semibold mb-4 text-${themeSett.primary_color} `}>Contact Us</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-neutral-400">
                                        <FaMapMarkerAlt className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span className='text-sm'>
                                            <span> {brker_info?.contact_info?.address}</span>
                                            {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                                ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-neutral-400">
                                        <PiPhoneIncoming className="h-4 w-4 shrink-0" />
                                        <span className="text-sm">
                                            <Link href={`tel:${brker_info?.contact_info?.phone_cell}`} className={`hover:text-${themeSett.primary_color}`}>
                                                {brker_info?.contact_info?.phone_cell}
                                            </Link>
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-neutral-400">
                                        <CgMail className="h-4 w-4 shrink-0" />
                                        <span className="text-sm">
                                            <Link href={`mailto:${brker_info?.email}`} className={`hover:text-${themeSett.primary_color}`}>
                                                {brker_info?.email}
                                            </Link>
                                        </span>
                                    </li>
                                </ul>
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
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-neutral-700">
                        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                                <p>&copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera</p>
                                <div className="flex gap-4">
                                    <CustomLinkMain href="/privacy-policy" is_theme={is_theme} className="hover:text-white transition-colors cursor-pointer">
                                        Privacy Policy
                                    </CustomLinkMain>

                                    <CustomLinkMain href="/terms" is_theme={is_theme} className="hover:text-white transition-colors cursor-pointer">
                                        Terms of Service
                                    </CustomLinkMain>
                                </div>
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

export default FooterVar7