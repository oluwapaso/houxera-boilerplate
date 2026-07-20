'use client';

import React, { useEffect, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6';
import CustomLinkMain from '../CustomLink';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { BsStars } from 'react-icons/bs';
import { Helpers } from '@/_lib/helper';
import DynamicIcon from '../DynamicIcon';

const helpers = new Helpers();
const OurServicesCardVar1 = ({ service_info, is_theme = false }: { service_info: any, is_theme?: boolean }) => {

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
            <CustomLinkMain href={`${themeSett.theme_prefix}/service-details/${service_info.slug}`} is_theme={is_theme}
                className=' flex items-start space-x-4 tab:space-x-8'>
                <div className={`bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)} text-${themeSett.primary_color} p-2 rounded-md`} >
                    <DynamicIcon icon={service_info.icon} size={40} className={`text-${themeSett.primary_color} fill-${themeSett.primary_color}`} />
                </div>
                <div className=' flex flex-col'>
                    <div className='font-semibold text-xl'>{service_info.title}</div>
                    <div className=' tracking-wider leading-8'>
                        {service_info.excerpt}
                    </div>
                    <div className={`w-fit px-4 py-1 mt-1 text-sm bg-white border-1 border-${themeSett.primary_color} flex 
                        items-center justify-center hover:bg-${themeSett.primary_color} text-${themeSett.primary_color} 
                        hover:text-white cursor-pointer rounded space-x-2.5 hover:shadow-2xl`}>
                        <span>Read More</span>
                        <FaArrowRightLong size={18} />
                    </div>
                </div>
            </CustomLinkMain>
        )
    }
}

export default OurServicesCardVar1