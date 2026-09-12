'use client';

import React, { useEffect, useState } from 'react'
import { FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsGear, BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import { BiMapPin, BiPhone, BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import { Button } from '../Button';
import { CgMail } from 'react-icons/cg';
import { FaMapMarkerAlt } from 'react-icons/fa';

const FooterVar2 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "name": "FooterVar2",
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
            <footer className="bg-zinc-900 text-zinc-100 relative">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                        {/* Company Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 h-[55px]">
                                <Image src={`${themeSett?.light_logo || "/logo-light.png"}`} height={50} width={150} className="" alt={`Houxera MLS and IDX provider in Nieria/Africa`} />
                            </div>
                            <p className="text-sm leading-relaxed text-zinc-400">
                                {themeSett?.footer_note || `Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                                Non temporibus hic sunt iure magnam labore,
                                unde tenetur totam quam porro veritatis
                                error blanditiis quisquam, necessitatibus molestias id in. Et, ipsam?`}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 text-sm text-zinc-400">
                                    <FaMapMarkerAlt size={14} className='shrink-0' />
                                    <span className=' flex flex-col -mt-1'>
                                        <span> {brker_info?.contact_info?.address}</span>
                                        {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                            ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <BiPhone className="h-4 w-4" />
                                    <span>{brker_info?.contact_info?.phone_cell}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <CgMail className="h-4 w-4 text-blue-500" />
                                    <span>{brker_info?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">Services</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Cloud Solutions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Data Analytics
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Cybersecurity
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        IT Consulting
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Digital Transformation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">Company</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Press Room
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Partners
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-zinc-400 transition-colors hover:text-blue-400">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-100">Newsletter</h3>
                            <p className="text-sm text-zinc-400">
                                Subscribe to our newsletter for the latest updates and insights.
                            </p>
                            <form className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                                />
                                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-zinc-800 pt-8 md:flex-row">
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
                            <Link href="#" className="hover:text-zinc-300">Privacy Policy</Link>
                            <Link href="#" className="hover:text-zinc-300">Terms of Service</Link>
                            <Link href="#" className="hover:text-zinc-300">Cookie Policy</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-zinc-500 transition-colors hover:text-blue-400">
                                <BsTwitterX className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-500 transition-colors hover:text-blue-400">
                                <BsGithub className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-500 transition-colors hover:text-blue-400">
                                <BsLinkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-500 transition-colors hover:text-blue-400">
                                <FaYoutube className="h-5 w-5" />
                            </Link>
                        </div>

                        <p className="text-sm text-zinc-500">
                            © {new Date().getFullYear()} CorpTech Inc.
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

export default FooterVar2