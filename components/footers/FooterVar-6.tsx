'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong, FaFacebook, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsArrowDown, BsArrowRight, BsArrowUp, BsArrowUpRight, BsChevronBarUp, BsGear, BsGithub, BsInstagram, BsLinkedin, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiBuilding, BiChat, BiEnvelopeOpen, BiHome, BiLayerPlus, BiMapPin, BiPhone, BiRefresh, BiTrash } from 'react-icons/bi';
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
const FooterVar6 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "component": "FooterVar6",
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
            <footer className="bg-white border-t border-neutral-200 relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Main Content */}
                    <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
                        {/* Brand and Contact */}
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 h-[55px]">
                                    <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                                </div>

                                <p className="mt-1 text-sm max-w-xs">
                                    {themeSett?.footer_note || `Modern real estate solutions powered by technology. Find, buy, or sell properties with confidence.`}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-600">
                                    <FaMapMarkerAlt className="h-4 w-4" />
                                    <span className='text-sm'>
                                        <span> {brker_info?.contact_info?.address}</span>
                                        {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                            ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-600">
                                    <BiPhone className="h-4 w-4" />
                                    <span className="text-sm">{brker_info?.contact_info?.phone_cell}</span>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-600">
                                    <CgMail className="h-4 w-4" />
                                    <span className="text-sm">{brker_info?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-3 gap-8">

                                {/* Services */}
                                {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                                    themeSett.footer_menu.map((menu: any, index: any) => {

                                        return (
                                            <div>
                                                <div key={index} className=''>
                                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                                                        {menu.title}
                                                    </h4>

                                                    {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                                        <ul className="space-y-3">
                                                            {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                                return <li key={sub_index}>
                                                                    <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                                        className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
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

                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Connect</h4>
                                    <ul className="space-y-3">
                                        {brker_info?.social_accounts?.facebook &&
                                            <li>
                                                <Link href={`${brker_info?.social_accounts?.facebook}`}
                                                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors inline-flex 
                                                    items-center gap-2" target='_blank'>
                                                    <FaFacebook size={16} /> <span>Facebook</span>
                                                </Link>
                                            </li>
                                        }

                                        {brker_info?.social_accounts?.twitter &&
                                            <li>
                                                <Link href={`${brker_info?.social_accounts?.twitter}`}
                                                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors inline-flex 
                                                    items-center gap-2" target='_blank'>
                                                    <BsTwitterX size={16} /> <span>Twitter</span>
                                                </Link>
                                            </li>
                                        }

                                        {brker_info?.social_accounts?.linkedin &&
                                            <li>
                                                <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors inline-flex 
                                                    items-center gap-2" target='_blank'>
                                                    <LiaLinkedin size={16} /> <span>Linkedin</span>
                                                </Link>
                                            </li>
                                        }

                                        {brker_info?.social_accounts?.youtube &&
                                            <li>
                                                <Link href={`${brker_info?.social_accounts?.youtube}`}
                                                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors inline-flex 
                                                    items-center gap-2" target='_blank'>
                                                    <FaYoutube size={16} /> <span>Youtube</span>
                                                </Link>
                                            </li>
                                        }

                                        {brker_info?.social_accounts?.whatsapp &&
                                            <li>
                                                <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors inline-flex 
                                                    items-center gap-2" target='_blank'>
                                                    <BsWhatsapp size={16} /> <span>Whatsapp</span>
                                                </Link>
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="py-6 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-neutral-400">
                            &copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera
                        </p>
                        <div className="flex gap-6">
                            <CustomLinkMain href="/privacy-policy" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                                Privacy Policy
                            </CustomLinkMain>

                            <CustomLinkMain href="/terms" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
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

export default FooterVar6