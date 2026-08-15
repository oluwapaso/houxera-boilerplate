
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
            <div className='flex flex-col relative shadow-xl rounded-md bg-white border border-gray-200'
                id={`saved_search_${search_info.search_uid}`}>

                <div className='p-4 flex pb-20 flex-col'>
                    <div className='font-semibold text-lg mt-0 text-gray-800 line-clamp-2' id={`search_title_${search_info.search_uid}`}>
                        {search_info.search_title}
                    </div>
                    <div className=' flex items-start space-x-1.5 mt-2'>
                        <span className='font-semibold text-gray-600 flex items-center space-x-1'>
                            <BiBell size={18} />  <span>Alert Frequency:</span>
                        </span>
                        <span className='text-smx font-medium line-clamp-2 italic text-gray-500' id={`email_frequency_${search_info.search_uid}`}>
                            {search_info.email_frequency}
                        </span>
                    </div>

                    <div className=' flex items-center space-x-1.5 mt-2'>
                        <span className='font-semibold text-gray-600 flex items-center space-x-1'>
                            <HiHomeModern size={16} />  <span>Prop Type:</span>
                        </span>
                        <span className='text-smx font-medium line-clamp-2 text-gray-500'>
                            {search_info.property_type} - {search_info.property_sub_type}
                        </span>
                    </div>

                    <div className=' flex items-center space-x-1.5 mt-2'>
                        <span className='font-semibold text-gray-600 flex items-center space-x-1'>
                            <GiMoneyStack size={16} />  <span>Price:</span>
                        </span>
                        <span className='text-smx font-medium line-clamp-2 text-gray-500 flex space-x-2.5'>
                            <span>
                                {(search_info.min_price == "Any" || search_info.min_price == "0") ? `Min. Any` : `Min.${helpers.formatCurrency(search_info.min_price, true)}`}
                            </span>
                            <span>
                                {(search_info.max_price == "Any" || search_info.max_price == "0") ? `Max. Any` : `Max.${helpers.formatCurrency(search_info.max_price, true)}`}
                            </span>
                        </span>
                    </div>

                    <div className=' flex items-center mt-2'>
                        <div className='flex items-center space-x-2.5'>
                            <div className=' flex items-center space-x-1'>
                                <LuBedDouble size={16} />
                                <span className='font-semibold text-gray-600'>Beds:</span>
                                <span className=' text-gray-500'>{search_info.beds}</span>
                            </div>

                            <div className=' flex items-center space-x-1'>
                                <BiShower size={16} />
                                <span className='font-semibold text-gray-600'>Baths:</span>
                                <span className=' text-gray-500'>{search_info.baths}</span>
                            </div>
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