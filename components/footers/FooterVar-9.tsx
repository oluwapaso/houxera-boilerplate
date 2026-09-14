'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong, FaFacebook, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import { BsArrowDown, BsArrowRight, BsArrowUp, BsArrowUpRight, BsChevronBarUp, BsClock, BsGear, BsGithub, BsInstagram, BsLinkedin, BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { BiBuilding, BiChat, BiEnvelopeOpen, BiHeart, BiHome, BiMapPin, BiPhone } from 'react-icons/bi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PiPhoneIncoming } from 'react-icons/pi';
import { LiaLinkedin } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import CustomLinkMain from '../CustomLink';
import { Button } from '../Button';
import { CgMail } from 'react-icons/cg';
import { LuTreePine } from 'react-icons/lu';
import { BiLayerPlus, BiRefresh, BiTrash } from 'react-icons/bi';

const FooterVar9 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "component": "FooterVar9",
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
            <footer className="w-full relative bg-[#2d3b2d] text-white">
                {/* Top CTA */}
                <div className="bg-[#4a6741]">
                    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 text-center">
                        <h3 className="text-2xl font-serif">Discover Country Living</h3>
                        <p className="mt-2 text-green-100 text-sm max-w-lg mx-auto">
                            From charming farmhouses to sprawling ranches, find your perfect rural retreat
                        </p>
                        <Button className="mt-4 bg-white text-[#2d3b2d] hover:bg-green-50">
                            Browse Properties
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <LuTreePine className="h-7 w-7 text-green-400" />
                                <span className="text-xl font-serif">Countryside</span>
                            </div>
                            <p className="text-sm text-green-200/70">
                                Specializing in farms, ranches, and rural properties since 1978.
                                Your trusted partner in country real estate.
                            </p>
                            <div className="flex gap-3 mt-6">
                                {[FaFacebook, BsInstagram, FaYoutube].map((Icon, i) => (
                                    <Link
                                        key={i}
                                        href="#"
                                        className="w-9 h-9 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Property Types */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-4">Properties</h4>
                            <ul className="space-y-2">
                                {[
                                    "Working Farms",
                                    "Horse Properties",
                                    "Vineyards & Orchards",
                                    "Hunting Land",
                                    "Ranch Land",
                                    "Country Estates"
                                ].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm text-green-200/70 hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-4">Services</h4>
                            <ul className="space-y-2">
                                {[
                                    "Land Evaluation",
                                    "Farm Financing",
                                    "Property Tours",
                                    "Auction Services",
                                    "Conservation Easements",
                                    "1031 Exchanges"
                                ].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm text-green-200/70 hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-4">Contact</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-green-200/70">
                                    <BiMapPin className="h-4 w-4 mt-0.5 shrink-0 text-green-400" />
                                    <span>2847 Country Road<br />Lancaster, PA 17601</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-green-200/70">
                                    <PiPhoneIncoming className="h-4 w-4 shrink-0 text-green-400" />
                                    <span>(717) 555-FARM</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-green-200/70">
                                    <CgMail className="h-4 w-4 shrink-0 text-green-400" />
                                    <span>info@countryside.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Regions */}
                <div className="border-t border-green-800/50">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                        <p className="text-xs text-green-200/50 text-center mb-3">Serving Rural Communities Across</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-green-200/70">
                            {["Pennsylvania", "Virginia", "Kentucky", "Tennessee", "Texas", "Montana", "Colorado"].map((state) => (
                                <Link key={state} href="#" className="hover:text-white transition-colors">
                                    {state}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="bg-[#1e2a1e]">
                    <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-green-200/50">
                            <p>&copy; 2024 Countryside Realty. Equal Housing Opportunity.</p>
                            <div className="flex gap-4">
                                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                                <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                                <Link href="#" className="hover:text-white transition-colors">Fair Housing</Link>
                            </div>
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

export default FooterVar9