'use client';

import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import SalesTypeBadge from './SalesTypeBadge';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiEnvelopeOpen, BiMenu, BiShare, BiShower, BiWalk } from 'react-icons/bi';
import { LuBedDouble } from 'react-icons/lu';
import { TbRulerMeasure2 } from 'react-icons/tb';
import FavoriteButton from './FavoriteButton';
import usePropertyModal from '@/_hooks/usePropertyModal';
import CustomLinkMain from '../CustomLink';

const helpers = new Helpers();
const PropCardVar2 = ({ pro_info, is_theme = false, raw_data = {} }: { pro_info?: any, is_theme?: boolean, raw_data?: any } = {}) => {

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

    usePropertyModal({ page: modal_page, property_info: pro_info });

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
            <div className='relative shadow-xl hover:shadow-2xl rounded-md bg-white border border-gray-200 flex flex-col
            bg-center bg-cover bg-no-repeat' style={{ backgroundImage: `url('${primary_photo}')` }}
                data-property-uid={`${pro_info.property_uid}`} data-company-uid={`${pro_info.company_uid}`}
                data-company-id={`${pro_info.company_id}`}>

                <CustomLinkMain href={`${themeSett.theme_prefix}/property/${slug}`} is_theme={is_theme}
                    className={`h-[250px] relative z-10 bg-center bg-cover bg-no-repeat rounded-tl-md rounded-tr-md`}>
                    <div className={` w-full absolute top-4 flex items-center px-2 justify-end space-x-2 z-20`}>
                        <SalesTypeBadge sales_type={pro_info.listing_type} />
                    </div>
                </CustomLinkMain>

                <div className='p-3 flex pb-20 flex-col z-20'>
                    <div className={`font-semibold text-base flex items-center justify-between`}>
                        <div className={`px-3 py-1 rounded text-${themeSett.primary_color} 
                        bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)}`}>
                            {helpers.formatCurrency(pro_info.listing_price, true)}
                        </div>
                        <FavoriteButton themeSett={themeSett} property_uid={pro_info.property_uid} />
                    </div>
                    <CustomLinkMain href={`${themeSett.theme_prefix}/property/${slug}`} is_theme={is_theme}
                        className='font-semibold text-lg mt-1 text-white line-clamp-2'>
                        {pro_info.title}
                    </CustomLinkMain>

                    <CustomLinkMain href={`${themeSett.theme_prefix}/property/${slug}`} is_theme={is_theme}
                        className='mt-2 text-white line-clamp-4 text-sm'>
                        <div className='w-full flex items-start text-white'>
                            <span> <FaMapMarkerAlt size={13} className='mr-1 mt-1' /></span>
                            <span className='text-sm font-medium line-clamp-2'>
                                {pro_info.street_address}, {pro_info.city}, {pro_info.state} State
                            </span>
                        </div>
                    </CustomLinkMain>
                </div>

                <div className=' w-full h-16 absolute z-20 bottom-0 mt-6 grid grid-cols-[repeat(3,1fr)_50px] gap-0.5 *:text-sm
                    *:flex *:flex-col *:items-center *:justify-center *:bg-gray-10 *:p-2 text-gray-100 border-t border-gray-700'>
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

                    <div className=' border-l border-gray-700 relative z-20' ref={menuRef}>
                        <div className={` size-8 flex items-center justify-center cursor-pointer rounded-full bg-${themeSett.primary_color} 
                            hover:bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, 10)}
                            hover:text-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -20)}`}
                            onClick={() => setMenuOpened(true)}>
                            <BiMenu size={15} />
                        </div>

                        {is_menu_opened &&
                            <div className=' absolute z-30 w-[180px] bg-gray-100 shadow-2xl rounded-lg divide-y divide-gray-300 
                                overflow-hidden top-12 right-0 border border-gray-200 *:flex *:items-center *:space-x-2 *:px-4 
                                *:py-3 *:cursor-pointer text-gray-900'>
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

                <div className="absolute hidden w-full h-full z-10 bg-gradient-to-t from-transparent to-black/50 from-80%"></div>
                <div className="absolute w-full h-full z-10 bg-gradient-to-b from-transparent to-black from-20%"></div>
            </div>
        )
    }
}

export default PropCardVar2