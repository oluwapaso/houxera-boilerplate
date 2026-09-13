'use client';

import React, { useEffect, useState } from 'react'
import { FaFacebook } from 'react-icons/fa6';
import { BsChevronBarUp, BsGear, BsInstagram, BsLinkedin, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiBuilding, BiChat, BiMapPin, BiPhone, BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import { CgMail } from 'react-icons/cg';
import { Helpers } from '@/_lib/helper';
import Image from 'next/image';
import { LiaLinkedin } from 'react-icons/lia';
import { FaYoutube } from 'react-icons/fa';
import CustomLinkMain from '../CustomLink';

const helpers = new Helpers();
const FooterVar4 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "name": "FooterVar4",
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
            <footer className="bg-[#1a1a1a] text-white relative">
                {/* Top Section with CTA */}
                <div className="border-b border-white/10">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-3xl font-light tracking-tight md:text-4xl">
                                {themeSett?.footer_header || `Find Your Dream Home`}
                            </h2>
                            <p className="mt-4 text-sm text-white/60">
                                {themeSett?.footer_sub_header || `Schedule a private consultation with our luxury real estate specialists`}
                            </p>
                            <button className={`mt-6 px-8 py-4 rounded-md cursor-pointer hover:shadow-xl bg-${themeSett.primary_color} 
                            text-${themeSett.primary_button_text} hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                                {themeSett?.footer_button_text || `Book Consultation`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <div className="flex items-center h-[55px]">
                                <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                            </div>

                            <p className="text-sm text-white/60 leading-relaxed">
                                {themeSett?.footer_note || `Curating exceptional properties for discerning clients since 1985.`}
                            </p>
                            <div className="flex gap-4 pt-2">
                                {brker_info?.social_accounts?.facebook &&
                                    <Link href={`${brker_info?.social_accounts?.facebook}`}
                                        className="text-white/60 hover:text-white transition-colors" target='_blank'>
                                        <FaFacebook size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.twitter &&
                                    <Link href={`${brker_info?.social_accounts?.twitter}`}
                                        className="text-white/60 hover:text-white transition-colors" target='_blank'>
                                        <BsTwitterX size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.linkedin &&
                                    <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                        className="text-white/60 hover:text-white transition-colors" target='_blank'>
                                        <LiaLinkedin size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.youtube &&
                                    <Link href={`${brker_info?.social_accounts?.youtube}`}
                                        className="text-white/60 hover:text-white transition-colors" target='_blank'>
                                        <FaYoutube size={20} />
                                    </Link>
                                }

                                {brker_info?.social_accounts?.whatsapp &&
                                    <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                        className="text-white/60 hover:text-white transition-colors" target='_blank' >
                                        <BsWhatsapp size={20} />
                                    </Link>
                                }
                            </div>
                        </div>

                        {/* Quick Links */}
                        {/* <div>
                            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
                                Properties
                            </h3>
                            <ul className="space-y-3">
                                {["Featured Listings", "New Developments", "Luxury Estates", "Waterfront Properties", "International"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div> */}

                        {/* Services */}
                        {(Array.isArray(themeSett.footer_menu) && themeSett.footer_menu.length > 0) ? (
                            themeSett.footer_menu.map((menu: any, index: any) => {

                                return (
                                    <div>
                                        <div key={index} className=''>
                                            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
                                                {menu.title}
                                            </h3>

                                            {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) ? (
                                                <ul className="space-y-3">
                                                    {menu.sub_menu.map((sub_menu: any, sub_index: any) => {
                                                        return <li>
                                                            <CustomLinkMain key={sub_index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                                                                className={`text-sm text-white/60 hover:text-white transition-all cursor-pointer `}>
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
                            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
                                Contact
                            </h3>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li className="flex items-start gap-3">
                                    <BiMapPin className="h-4 w-4 shrink-0" />
                                    <span className=' flex flex-col -mt-1'>
                                        <span> {brker_info?.contact_info?.address}</span>
                                        {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                            ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <BiPhone className="h-4 w-4 shrink-0" />
                                    <span>{brker_info?.contact_info?.phone_cell}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CgMail className="h-4 w-4 shrink-0" />
                                    <span>{brker_info?.email}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-xs text-white/40">
                                &copy; {new Date().getFullYear()}. All rights reserved. Made by Houxera
                            </p>
                            <div className="flex gap-6">
                                <CustomLinkMain href="/privacy-policy" className="text-xs text-white/40 hover:text-white transition-colors">
                                    Privacy Policy
                                </CustomLinkMain>

                                <CustomLinkMain href="/Terms" className="text-xs text-white/40 hover:text-white transition-colors">
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

export default FooterVar4