'use client';

import React, { useEffect, useState } from 'react'
import CustomLinkMain from '../CustomLink';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { OurService } from '../types';

import { Helpers } from '@/_lib/helper';
import DynamicIcon from '../DynamicIcon';
import { FaArrowRightLong } from 'react-icons/fa6';

const helpers = new Helpers();
const OurServicesCardVar4 = ({ service, index, is_theme = false }: { service: OurService, index: number, is_theme?: boolean }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {
        return (
            <CustomLinkMain
                key={service.title}
                href={`${themeSett.theme_prefix}/service-details/${service.slug}`} is_theme={is_theme}
                className="bg-white cursor-pointer rounded-2xl px-4 xs:px-6 py-6 xs:py-8 shadow-sm hover:shadow-lg transition-shadow duration-300 
                flex flex-col items-center justify-center gap-6" >
                <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)} text-${themeSett.primary_color} 
                    rounded-2xl flex items-center justify-center shadow-sm`}>
                        <DynamicIcon icon={service.icon} size={50} className={`text-${themeSett.primary_color} fill-${themeSett.primary_color}`} />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center justify-center">
                        {service.title}
                    </h3>

                    <div className={`h-0.5 bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent 
                        transition-opacity duration-700 mt-2 mb-4`} />

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 text-center">
                        {service.excerpt}
                    </p>
                </div>
            </CustomLinkMain>
        )
    }
}

export default OurServicesCardVar4