'use client';

import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import SalesTypeBadge from './SalesTypeBadge';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiCamera, BiEnvelopeOpen, BiMenu, BiShare, BiShower, BiWalk } from 'react-icons/bi';
import { LuBedDouble } from 'react-icons/lu';
import { TbRulerMeasure2 } from 'react-icons/tb';
import FavoriteButton from './FavoriteButton';
import usePropertyModal from '@/_hooks/usePropertyModal';
import CustomLinkMain from '../CustomLink';

const helpers = new Helpers();
const PropCardVar1 = ({ pro_info, is_theme = false, raw_data = {} }: { pro_info?: any, is_theme?: boolean, raw_data?: any } = {}) => {

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [is_menu_opened, setMenuOpened] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [modal_page, setModalPage] = useState<"Enquiry" | "Tour" | "Share" | null>(null);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    usePropertyModal({ page: modal_page, property_info: pro_info, is_theme: is_theme });

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpened(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [menuRef]);

    useEffect(() => {
        if (!prop_modal.shown) {
            setModalPage(null);
        }
    }, [prop_modal.shown]);

    const rawSlug = `${pro_info?.property_sub_type}-in-${pro_info?.street_address}-${pro_info?.city}-${pro_info?.state}`;
    var slug = helpers.MakeSlug(rawSlug);

    slug = `${slug}?property_uid=${pro_info?.property_uid}`
    if (pro_info?.ad_uid && pro_info?.ad_uid != "") {
        slug = `${slug}&campaign_uid=${pro_info?.ad_uid}`
    }

    //../ in `../${pro_info.primary_photo}` is for testing, remocve this in production
    // const primary_photo = pro_info.primary_photo ? `../${pro_info.primary_photo}` : "../house-not-found-placeholder.png"
    const primary_photo = pro_info?.primary_photo ? `${pro_info?.primary_photo}` : "../house-not-found-placeholder.png"
    if (themeSett && themeSett != null && pro_info && pro_info != null) {
        return (
            <div className='relative shadow-xl hover:shadow-2xl rounded-md bg-white border border-gray-200 flex flex-col'
                data-property-uid={`${pro_info.property_uid}`} data-company-uid={`${pro_info.company_uid}`}
                data-company-id={`${pro_info.company_id}`}>

                <CustomLinkMain href={`/property/${slug}`} is_theme={is_theme}
                    className={`h-[250px] relative z-3 bg-center bg-cover bg-no-repeat rounded-tl-md rounded-tr-md`}
                    style={{ backgroundImage: `url('${primary_photo}')` }}>
                    <div className=' w-full absolute top-4 flex items-center px-2 justify-end space-x-2 z-5'>
                        <SalesTypeBadge sales_type={pro_info.listing_type} />
                    </div>

                    <div className=' w-full absolute bottom-3 px-2 grid grid-cols-[1fr_50px] z-6 space-x-1.5'>
                        <div className=' flex items-start text-white'>
                            <span> <FaMapMarkerAlt size={13} className='mr-1 mt-1' /></span>
                            <span className='text-sm font-medium line-clamp-2'>
                                {pro_info.street_address}, {pro_info.city}, {pro_info.state} State
                            </span>
                        </div>
                        <div className='p-1 text-white bg-white/30 backdrop-blur-sm flex items-center justify-center 
                        rounded-md cursor-pointer'>
                            <BiCamera size={15} className='mr-0.5' />
                            <span className=' text-sm font-medium'>{pro_info.photo_counts}</span>
                        </div>
                    </div>

                    <div className="absolute hidden w-full h-full z-2 bg-gradient-to-t from-transparent to-black/50 from-80%"></div>
                    <div className="absolute w-full h-full z-2 bg-gradient-to-b from-transparent to-black/80 from-75%"></div>
                </CustomLinkMain>

                <div className='px-4 xs:px-6 py-4 xs:py-6 flex pb-20 flex-col'>
                    <div className={`font-semibold text-base flex items-center justify-between`}>
                        <div className={`text-${themeSett.primary_color}`}>
                            {helpers.formatCurrency(pro_info.listing_price, true)}
                        </div>
                        <FavoriteButton themeSett={themeSett} property_uid={pro_info.property_uid} />
                    </div>
                    <div className='font-semibold text-lg mt-0 text-gray-800 line-clamp-2'>{pro_info.title}</div>
                    <div className='mt-2 text-gray-600 line-clamp-4 text-sm'>
                        {pro_info.property_description}
                    </div>
                </div>

                <div className=' w-full h-16 absolute z-4 bottom-0 mt-6 grid grid-cols-[repeat(3,1fr)_50px] gap-0.5 *:text-sm
                    *:flex *:flex-col *:items-center *:justify-center *:bg-gray-10 *:p-2 border-t border-gray-200'>
                    <div>
                        <div className=' flex items-center space-x-1'>
                            <div className='font-semibold'>{helpers.formatWholeNumber(pro_info.bedrooms)}</div>
                            <LuBedDouble size={16} />
                        </div>
                        <div>Beds</div>
                    </div>

                    <div>
                        <div className=' flex items-center space-x-1'>
                            <div className='font-semibold'>{helpers.formatWholeNumber(pro_info.bathrooms)}</div>
                            <BiShower size={16} />
                        </div>
                        <div>Baths</div>
                    </div>

                    <div>
                        <div className=' flex items-center space-x-1'>
                            <div className='font-semibold'>{helpers.formatWholeNumber(pro_info.lot_size)}</div>
                            <TbRulerMeasure2 size={16} />
                        </div>
                        <div>Sqm</div>
                    </div>

                    <div className=' border-l border-gray-100 relative z-4' ref={menuRef}>
                        <div className={` size-8 flex items-center justify-center cursor-pointer rounded-full 
                            bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -70)} hover:bg-${themeSett.primary_color} hover:text-white`}
                            onClick={() => setMenuOpened(true)}>
                            <BiMenu size={15} />
                        </div>

                        {is_menu_opened &&
                            <div className=' absolute z-30 w-[180px] bg-white shadow-2xl rounded-lg divide-y divide-gray-300 
                                overflow-hidden top-12 right-0 border border-gray-200 *:flex *:items-center *:space-x-2 *:px-4 
                                *:py-3 *:cursor-pointer'>
                                <div className=' hover:bg-gray-200' onClick={() => setModalPage("Enquiry")}>
                                    <BiEnvelopeOpen size={20} />
                                    <div>Make Enquiry</div>
                                </div>

                                <div className=' hover:bg-gray-200' onClick={() => setModalPage("Tour")}>
                                    <BiWalk size={20} />
                                    <div>Schedule a Tour</div>
                                </div>

                                <div className=' hover:bg-gray-200' onClick={() => setModalPage("Share")}>
                                    <BiShare size={20} />
                                    <div>Share Listing</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default PropCardVar1