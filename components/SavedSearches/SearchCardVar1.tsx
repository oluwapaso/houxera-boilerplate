
'use client';

import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BiBell, BiEdit, BiSearch, BiShower, BiTrash } from 'react-icons/bi';
import { LuBedDouble } from 'react-icons/lu';
import usePropertyModal from '@/_hooks/usePropertyModal';
import { HiHomeModern } from 'react-icons/hi2';
import { GiMoneyStack } from 'react-icons/gi';
import CustomLinkMain from '../CustomLink';

const helpers = new Helpers();
const SearchCardVar1 = ({ search_info, handleDelete, handleEdit }:
    { search_info: any, handleDelete: (search_uid: any) => Promise<void>, handleEdit: (search_info: any) => void }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const account_id = process.env.NEXT_PUBLIC_ACCOUNT_ID;

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

    usePropertyModal({ page: modal_page, property_info: search_info });

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

    if (themeSett && themeSett != null) {
        return (
            <div className='flex flex-col relative shadow-xl rounded-lg bg-white border border-gray-200'
                id={`saved_search_${search_info.search_uid}`}>

                <div className='p-4 pb-22 xs:p-6 xs:pb-22 flex flex-col'>
                    <div className='font- text-xl xs:text-xl mt-0 text-gray-800 line-clamp-2' id={`search_title_${search_info.search_uid}`}>
                        {search_info.search_title}
                    </div>

                    <div className=' flex flex-col xs:flex-row xs:items-center space-x-2 mt-3 text-base xs:text-base'>
                        <span className='font-medium text-gray-800 flex items-center space-x-3'>
                            <span className='p-2 rounded-full bg-gray-100 text-gray-600 shrink-0'>
                                <BiBell size={23} />
                            </span>
                            <span className=' shrink-0'>Alert Frequency:</span>
                        </span>
                        <span className='max-xs:pl-[52px] text-smx font- line-clamp-2 text-gray-500' id={`email_frequency_${search_info.search_uid}`}>
                            {search_info.email_frequency}
                        </span>
                    </div>

                    <div className=' flex flex-col xs:flex-row xs:items-center space-x-2 mt-3 text-base xs:text-base'>
                        <span className='font-medium text-gray-800 flex items-center space-x-3'>
                            <span className='p-2 rounded-full bg-gray-100 text-gray-600 shrink-0'>
                                <HiHomeModern size={23} />
                            </span>
                            <span className=' shrink-0'>Prop Type:</span>
                        </span>
                        <span className='max-xs:pl-[52px] text-smx font- line-clamp-2 text-gray-500'>
                            {search_info.property_type} - {search_info.property_sub_type}
                        </span>
                    </div>

                    <div className=' flex flex-col xs:flex-row xs:items-center space-x-2 mt-3 text-base xs:text-base'>
                        <span className='font-medium text-gray-800 flex items-center space-x-3'>
                            <span className='p-2 rounded-full bg-gray-100 text-gray-600 shrink-0'>
                                <GiMoneyStack size={23} />
                            </span>
                            <span className=' shrink-0'>Price:</span>
                        </span>
                        <span className='max-xs:pl-[52px] text-smx font- line-clamp-2 text-gray-500 flex space-x-2.5'>
                            <span>
                                {(search_info.min_price == "Any" || search_info.min_price == "0") ? `Min. Any` : `Min.${helpers.formatCurrency(search_info.min_price, true)}`}
                            </span>
                            <span>
                                {(search_info.max_price == "Any" || search_info.max_price == "0") ? `Max. Any` : `Max.${helpers.formatCurrency(search_info.max_price, true)}`}
                            </span>
                        </span>
                    </div>

                    <div className=' flex flex-col xs:flex-row xs:items-center xs:space-x-4 mt-3 text-base xs:text-base'>

                        <div className=' flex justify-between xs:justify-start items-center space-x-2 text-base xs:text-base'>
                            <span className='font-medium text-gray-800 flex items-center space-x-3'>
                                <span className='p-2 rounded-full bg-gray-100 text-gray-600 relative shrink-0'>
                                    <LuBedDouble size={23} />
                                </span>
                                <span className=' shrink-0'>Beds:</span>
                            </span>
                            <span className='max-xs:pl-[52px] text-smx font- line-clamp-2 text-gray-500'>
                                {search_info.beds}
                            </span>
                        </div>

                        <div className=' hidden xs:block border-r-2 border-gray-300 h-[25px]'></div>

                        <div className=' flex justify-between xs:justify-start items-center space-x-2 max-xs:mt-3 text-base xs:text-base'>
                            <span className='font-medium text-gray-800 flex items-center space-x-3'>
                                <span className='p-2 rounded-full bg-gray-100 text-gray-600 relative shrink-0'>
                                    <BiShower size={23} />
                                </span>
                                <span className=' shrink-0'>Baths:</span>
                            </span>
                            <span className='max-xs:pl-[52px] text-smx font- line-clamp-2 text-gray-500'>
                                {search_info.baths}
                            </span>
                        </div>
                    </div>

                </div>

                <div className=' w-full h-16 absolute z-20 bottom-0 mt-6 grid grid-cols-[repeat(3,1fr)] gap-0.5 *:text-sm
                    *:flex *:flex-col *:items-center *:justify-center cursor-pointer *:bg-gray-10 *:p-2 border-t border-gray-200'>
                    <CustomLinkMain href={`/property-search?${search_info.query_link}`} className='hover:bg-gray-100'>
                        <div className=' flex items-center space-x-1'>
                            <BiSearch size={20} />
                        </div>
                        <div>Search</div>
                    </CustomLinkMain>

                    <div className='hover:bg-gray-100' onClick={() => handleEdit(search_info)}>
                        <div className=' flex items-center space-x-1'>
                            <BiEdit size={20} />
                        </div>
                        <div>Edit</div>
                    </div>

                    <div className='hover:bg-gray-100' onClick={() => handleDelete(search_info.search_uid)}>
                        <div className=' flex items-center space-x-1'>
                            <BiTrash size={20} />
                        </div>
                        <div>Delete</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchCardVar1