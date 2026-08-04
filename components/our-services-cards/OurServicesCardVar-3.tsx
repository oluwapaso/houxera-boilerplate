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
const OurServicesCardVar3 = ({ service, index, is_theme = false }: { service: OurService, index: number, is_theme?: boolean }) => {

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
                className="bg-white cursor-pointer rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 flex gap-6" >
                <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)} text-${themeSett.primary_color} 
                    rounded-2xl flex items-center justify-center shadow-sm`}>
                        <DynamicIcon icon={service.icon} size={50} className={`text-${themeSett.primary_color} fill-${themeSett.primary_color}`} />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">
                        {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {service.excerpt}
                    </p>
                </div>
            </CustomLinkMain>
        )
    }
}

export default OurServicesCardVar3