'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6';
import CustomLinkMain from '../CustomLink';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { Neighorhood } from '../types';
import { BiChat } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';

const NeighborhoodCardVar1 = ({ neigh_info, is_theme = false }: { neigh_info: Neighorhood, is_theme?: boolean }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const { neighborhood_uid, company_uid, title, slug, header_image_large, header_image_small,
        views, comments, excerpt } = neigh_info

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {
        return (
            <CustomLinkMain href={`/neighborhood-insight/${neigh_info.slug}`} is_theme={is_theme}
                className={`group h-[400px] relative shadow-lg z-10 bg-center bg-cover bg-no-repeat border border-gray-200 cursor-pointer 
                rounded-md overflow-hidden hover:shadow-2xl`}
                style={{ backgroundImage: `url('${header_image_large}')` }}>

                <div className=' w-full absolute top-4 flex items-center px-3 space-x-2 z-20'>
                    <div className='font-semibold text-white text-lg'>
                        {neigh_info.title}
                    </div>
                </div>

                {/* Base bottom row - fades out on hover */}
                <div className='w-full absolute bottom-3 px-3 grid grid-cols-[1fr_50px] z-20 
                transition-opacity duration-300 group-hover:opacity-0'>
                    <div className=' flex items-center text-white'>
                        <span className='text-base font-medium flex items-center space-x-2.5'>
                            <span>Explore Neighborhoods</span>
                            <FaArrowRightLong size={18} />
                        </span>
                    </div>
                </div>

                {/* Bottom sheet - slides up on hover */}
                <div className='absolute bottom-0 left-0 w-full z-30 bg-black/25 backdrop-blur-sm
                translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out
                px-4 py-4 space-y-3 flex flex-col'>
                    <div className=' text-white line-clamp-4'>
                        {excerpt}
                    </div>
                    <div className='flex items-center justify-between text-white'>
                        <div className='flex items-center space-x-4 text-sm'>
                            <span className='flex items-center space-x-1.5'>
                                <BsEye size={14} />
                                <span>{views ?? 0}</span>
                            </span>
                            <span className='flex items-center space-x-1.5'>
                                <BiChat size={14} />
                                <span>{comments ?? 0}</span>
                            </span>
                        </div>
                        <span className='text-sm font-medium flex items-center space-x-2 text-white'>
                            <span>Explore Neighborhoods</span>
                            <FaArrowRightLong size={16} />
                        </span>
                    </div>
                </div>

                <div className="absolute w-full h-full z-10 bg-gradient-to-t from-transparent to-black/80 from-75%"></div>
                <div className="absolute w-full h-full z-10 bg-gradient-to-b from-transparent to-black/80 from-75%"></div>
            </CustomLinkMain>
        )
    }
}

export default NeighborhoodCardVar1