'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6';
import CustomLinkMain from '../CustomLink';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';

const OurServicesCardVarxx = ({ service_info }: { service_info: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    //../ in `../${service_info.header_image_large}` is for testing, remocve this in production
    const header_image_large = service_info.header_image_large ? `../${service_info.header_image_large}` : "../no-image-found.jpg"
    if (themeSett && themeSett != null) {
        return (
            <CustomLinkMain href={`${themeSett.theme_prefix}/service-details/${service_info.slug}`}
                className={`w-full flex flex-col text-base font-normal bg-white boder border-gray-300 shadow-lg 
                rounded-2xl overflow-hidden hover:shadow-2xl`}>
                <div className={`w-full h-[200px] relative z-10 bg-center bg-cover bg-no-repeat cursor-pointer`}
                    style={{ backgroundImage: `url('${header_image_large}')` }}>
                </div>
                <div className='w-full flex flex-col p-3'>
                    <span className='ml-1 flex-grow font-semibold text-base'>{service_info.title}</span>
                    <span className='ml-1 flex-grow line-clamp-4 text-sm'>{service_info.excerpt}</span>

                    <div className={`px-2 mt-1 mb-2`}>
                        <div className={`w-fit px-4 py-1 mt-1 text-sm bg-white border-1 border-${themeSett.primary_color}-600 flex 
                            items-center justify-center hover:bg-${themeSett.primary_color}-600 text-${themeSett.primary_color}-600 
                            hover:text-white cursor-pointer rounded space-x-2.5 hover:shadow-2xl`}>
                            <span>Read More</span>
                            <FaArrowRightLong size={18} />
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        )
    }
}

export default OurServicesCardVarxx