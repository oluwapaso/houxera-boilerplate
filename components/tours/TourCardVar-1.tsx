
'use client';

import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiCalendarEvent, BiCamera, BiEnvelopeOpen, BiMenu, BiShare, BiShower } from 'react-icons/bi';
import { LuBedDouble } from 'react-icons/lu';
import { TbRulerMeasure2 } from 'react-icons/tb';
import usePropertyModal from '@/_hooks/usePropertyModal';
import SalesTypeBadge from '../property-cards/SalesTypeBadge';
import moment from 'moment';
import { BsClock } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';

const helpers = new Helpers();
const TourCardVar1 = ({ tour_info }: { tour_info: any }) => {

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

    usePropertyModal({ page: modal_page, property_info: tour_info });

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

    const rawSlug = `${tour_info.property_sub_type}-in-${tour_info.street_address}-${tour_info.city}-${tour_info.state}`;
    var slug = helpers.MakeSlug(rawSlug);

    slug = `${slug}?property_uid=${tour_info.property_uid}`
    if (tour_info.ad_uid && tour_info.ad_uid != "") {
        slug = `${slug}&campaign_uid=${tour_info.ad_uid}`
    }

    //../ in `../${tour_info.primary_photo}` is for testing, remocve this in production
    // const primary_photo = tour_info.primary_photo ? `../${tour_info.primary_photo}` : "../house-not-found-placeholder.png"
    const primary_photo = tour_info.primary_photo ? `${tour_info.primary_photo}` : "../house-not-found-placeholder.png"
    if (themeSett && themeSett != null) {
        return (
            <div className=' relative shadow-xl rounded-md bg-white border border-gray-200 grid grid-cols-10'>
                <CustomLinkMain href={`${themeSett.theme_prefix}/property/${slug}`}
                    className={` col-span-4 h-auto max-h-[300px] relative z-10 bg-center bg-cover bg-no-repeat overflow-hidden rounded-tl-md rounded-bl-md`}
                    style={{ backgroundImage: `url('${primary_photo}')` }}>
                    <div className=' w-full absolute top-4 flex items-center px-2 justify-end space-x-2 z-20'>
                        <SalesTypeBadge sales_type={tour_info.listing_type} />
                    </div>

                    <div className=' w-full absolute bottom-3 px-2 z-20'>
                        <div className='w-fit py-1 px-2 text-white bg-white/30 backdrop-blur-sm flex items-center justify-center 
                        rounded-md cursor-pointer'>
                            <BiCamera size={15} className='mr-0.5' />
                            <span className=' text-sm font-medium'>{tour_info.photo_counts}</span>
                        </div>
                    </div>

                    <div className="absolute hidden w-full h-full z-10 bg-gradient-to-t from-transparent to-black/50 from-80%"></div>
                    <div className="absolute w-full h-full z-10 bg-gradient-to-b from-transparent to-black/80 from-75%"></div>
                </CustomLinkMain>

                <div className=' col-span-6 flex flex-col relative'>
                    <div className='p-4 flex pb-20 flex-col'>
                        <CustomLinkMain href={`${themeSett.theme_prefix}/property/${slug}`} className='font-semibold text-lg mt-0 text-gray-800 line-clamp-2'>
                            {tour_info.title}
                        </CustomLinkMain>
                        <div className=' flex items-start'>
                            <span className='mt-1'> <FaMapMarkerAlt size={13} className='mr-1' /></span>
                            <span className='text-sm font-medium line-clamp-2 italic text-gray-600'>
                                {tour_info.street_address}, {tour_info.city}, {tour_info.state} State
                            </span>
                        </div>

                        <div className={`font-semibold text-base flex items-center justify-between mt-1`}>
                            <div className={`text-${themeSett.primary_color}-600`}>
                                {helpers.formatCurrency(tour_info.listing_price, true)}
                            </div>
                        </div>
                        <div className='mt-2 text-gray-600 line-clamp-4 text-sm flex flex-col space-y-2'>
                            <div className='font-semibold flex items-center space-x-1.5'>
                                <BiCalendarEvent className='' size={18} />
                                <span>{moment(tour_info.tour_date).format("Do MMM, YYYY")}</span>
                            </div>

                            <div className='flex items-center space-x-1.5'>
                                <BsClock className='' size={18} /> <span className='font-semibold text-orange-500'>From</span>
                                <span className=' italic'>{tour_info.start_time}</span>
                                <span className='font-semibold text-orange-500'>- To -</span>
                                <span className=' italic'>{tour_info.end_time}</span>
                            </div>
                        </div>
                    </div>

                    <div className=' w-full h-16 absolute z-20 bottom-0 mt-6 grid grid-cols-[repeat(3,1fr)_50px] gap-0.5 *:text-sm
                    *:flex *:flex-col *:items-center *:justify-center *:bg-gray-10 *:p-2 border-t border-gray-200'>
                        <div>
                            <div className=' flex items-center space-x-1'>
                                <div className='font-semibold'>{helpers.formatWholeNumber(tour_info.bedrooms)}</div>
                                <LuBedDouble size={16} />
                            </div>
                            <div>Beds</div>
                        </div>

                        <div>
                            <div className=' flex items-center space-x-1'>
                                <div className='font-semibold'>{helpers.formatWholeNumber(tour_info.bathrooms)}</div>
                                <BiShower size={16} />
                            </div>
                            <div>Baths</div>
                        </div>

                        <div>
                            <div className=' flex items-center space-x-1'>
                                <div className='font-semibold'>{helpers.formatWholeNumber(tour_info.square_meter)}</div>
                                <TbRulerMeasure2 size={16} />
                            </div>
                            <div>Sqm</div>
                        </div>

                        <div className=' border-l border-gray-100 relative z-20' ref={menuRef}>
                            <div className={` size-8 flex items-center justify-center cursor-pointer rounded-full 
                            bg-${themeSett.primary_color}-200 hover:bg-${themeSett.primary_color}-600 hover:text-white`}
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

                                    {/* <div className=' hover:bg-gray-200' onClick={() => setModalPage("Tour")}>
                                        <BiWalk size={20} />
                                        <div>Re-Schedule Tour</div>
                                    </div> */}

                                    <div className=' hover:bg-gray-200' onClick={() => setModalPage("Share")}>
                                        <BiShare size={20} />
                                        <div>Share Listing</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default TourCardVar1