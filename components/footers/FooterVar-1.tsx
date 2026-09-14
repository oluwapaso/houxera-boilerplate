'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong, FaFacebook, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsArrowDown, BsArrowUp, BsChevronBarUp, BsGear, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiChat, BiEnvelopeOpen } from 'react-icons/bi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PiPhoneIncoming } from 'react-icons/pi';
import { LiaLinkedin } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import CustomLinkMain from '../CustomLink';
import { BiLayerPlus, BiRefresh, BiTrash } from 'react-icons/bi';
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
const FooterVar1 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "component": "FooterVar1",
                    ...raw_data,
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
            <footer className={`w-full relative bg-gray-900 py-20 items-center justify-center text-gray-100`}>

                <div className='container grid grid-cols-12 gap-12 mx-auto'>
                    <div className='col-span-3 flex flex-col'>
                        <div className='mb-4'>
                            <div className="font-medium text-2xl h-[55px]">
                                <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                            </div>
                        </div>

                        <div className='text-sm leading-7 text-zinc-400'>
                            {themeSett?.footer_note || `Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                            Non temporibus hic sunt iure magnam labore,
                            unde tenetur totam quam porro veritatis
                            error blanditiis quisquam, necessitatibus molestias id in. Et, ipsam?`}
                        </div>

                        <div className='mt-6'>
                            <div className=' flex flex-col space-y-2.5 text-zinc-400'>
                                <div className=' flex items-start space-x-1.5'>
                                    <FaMapMarkerAlt size={14} className='shrink-0' />
                                    <span className=' flex flex-col -mt-1'>
                                        <span> {brker_info?.contact_info?.address}</span>
                                        {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                            ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                    </span>
                                </div>

                                <div className=' flex items-center space-x-1.5'>
                                    <PiPhoneIncoming size={14} />
                                    <span>
                                        <Link href={`tel:${brker_info?.contact_info?.phone_cell}`} className={`hover:text-${themeSett.primary_color}`}>
                                            {brker_info?.contact_info?.phone_cell}
                                        </Link>
                                    </span>
                                </div>

                                <div className=' flex items-center space-x-1.5'>
                                    <BiEnvelopeOpen size={14} />
                                    <span>
                                        <Link href={`mailto:${brker_info?.email}`} className={`hover:text-${themeSett.primary_color}`}>
                                            {brker_info?.email}
                                        </Link>
                                    </span>
                                </div>
                            </div>

                            <div className='mt-6 flex items-center space-x-2.5 *:border *:border-gray-500 *:p-3 *:rounded-md 
                                *:flex *:items-center *:justify-center *:cursor-pointer'>

                                {brker_info?.social_accounts?.facebook &&
                                    <Link href={`${brker_info?.social_accounts?.facebook}`} target='_blank'
                                        className={`hover:bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                                        <FaFacebook size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.twitter &&
                                    <Link href={`${brker_info?.social_accounts?.twitter}`} target='_blank'
                                        className={`hover:bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                                        <BsTwitterX size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.linkedin &&
                                    <Link href={`${brker_info?.social_accounts?.linkedin}`} target='_blank'
                                        className={`hover:bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                                        <LiaLinkedin size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.youtube &&
                                    <Link href={`${brker_info?.social_accounts?.youtube}`} target='_blank'
                                        className={`hover:bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                                        <FaYoutube size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.whatsapp &&
                                    <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`} target='_blank'
                                        className={`hover:bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                                        <BsWhatsapp size={20} />
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='col-span-6 grid grid-cols-2 gap-12 *:flex *:flex-col'>
                        {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                            themeSett.footer_menu.map((menu: any, index: any) => {

                                return (
                                    <div key={index} className=''>
                                        <div className='mb-4 font-semibold text-zinc-200 ext-xl border-b-3 border-gray-100 w-fit h-[55px]'>
                                            {menu.title}
                                        </div>

                                        {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                            <div className=' flex flex-col space-y-0.5 *:text-base *:font-medium 
                                            *:flex *:items-center *:space-x-1.5'>
                                                {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                    return <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                        className={`w-fit text-zinc-400 ease-in py-2 hover:delay-150 hover:bg-${themeSett.primary_color} 
                                                        hover:text-${themeSett.primary_button_text} transition-all rounded 
                                                        hover:px-2 hover:py-2 cursor-pointer`}>
                                                        <FaArrowRightLong size={13} />
                                                        <span>{sub_menu.title}</span>
                                                    </CustomLinkMain>
                                                })}
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })
                        ) : null}
                    </div>

                    <div className='col-span-3 flex flex-col'>
                        {/* Newsletter */}
                        {themeSett.footer_settings.show_newsletter &&
                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">
                                    {themeSett.footer_settings.newsletter_header || "Newsletter"}
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    {themeSett.footer_settings.newsletter_sub_header || "Subscribe to our newsletter for the latest updates and insights."
                                    }
                                </p>
                                <div className="space-y-3">
                                    <input type="email" placeholder="Enter your email"
                                        className="w-full px-4 py-2 border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                                    />
                                    <button className={`w-full px-3 py-2 rounded cursor-pointer bg-${themeSett.primary_color} 
                                    text-${themeSett.primary_button_text} hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                                        {themeSett.footer_settings.newsletter_btn_text || "Subscribe"}
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className='container mx-auto mt-16 border-t border-gray-700 pt-8 flex items-center justify-between'>
                    <div className="flex flex-wrap items-center justify-end gap-6 text-sm text-zinc-500">
                        <CustomLinkMain href="/privacy-policy" className="hover:text-zinc-300 cursor-pointer" is_theme={is_theme}>Privacy Policy</CustomLinkMain>
                        <CustomLinkMain href="/terms" className="hover:text-zinc-300 cursor-pointer" is_theme={is_theme}>Terms of Service</CustomLinkMain>
                    </div>

                    <div className='text-zinc-400'>
                        &copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera
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

export default FooterVar1