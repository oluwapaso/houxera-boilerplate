'use client';

import React, { useEffect, useState } from 'react'
import CustomLinkMain from '../CustomLink';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { OurService } from '../types';
import { FaArrowRightLong } from 'react-icons/fa6';
import DynamicIcon from '../DynamicIcon';

const OurServicesCardVar2 = ({ service, index, is_theme = false }: { service: OurService, index: number, is_theme?: boolean }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {
        return (
            <div key={service.title} className="flex gap-6">
                <div className="shrink-0 pt-1 text-gray-800">
                    <DynamicIcon icon={service.icon} size={40} className={`text-${themeSett.primary_color} fill-${themeSett.primary_color}`} />
                </div>

                <div className="flex-1">
                    <span className="block text-xs font-medium text-gray-400">
                        {String(index + 1).padStart(2, '0')}.
                    </span>
                    <div className="mt-2 mb-4 h-px w-full bg-gray-200" />
                    <h3 className="mb-2 text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600 line-clamp-4">{service.excerpt}</p>

                    <CustomLinkMain href={`${themeSett.theme_prefix}/service-details/${service.slug}`} is_theme={is_theme}
                        className=' flex justify-end items-center '>
                        <div className={`w-fit px-4 py-1 mt-1 text-sm bg-white border-1 border-${themeSett.primary_color} flex 
                            items-center justify-center hover:bg-${themeSett.primary_color} text-${themeSett.primary_color} 
                            hover:text-white cursor-pointer rounded space-x-2.5 hover:shadow-2xl`}>
                            <span>Read More</span>
                            <FaArrowRightLong size={18} />
                        </div>
                    </CustomLinkMain>
                </div>
            </div>
        )
    }
}

export default OurServicesCardVar2