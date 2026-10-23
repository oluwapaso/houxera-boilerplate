"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import ComponentSettings from '../editor-items/ComponentSettings'

const helpers = new Helpers();
const TermsVar1 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    useEffect(() => {
        dispatch(hidePageLoader());
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {
        return (
            <section className="w-full min-h-[100dvh] relative bg-gray-100">

                {/* hero band */}
                <div className={`w-full pb-20 pt-48 px-4 text-center object-cover !bg-cover !bg-center bg-${themeSett.primary_color} 
                text-${themeSett.primary_button_text} relative`} style={{ background: `url('${raw_data.header_image || "../no-image-found.jpg"}')` }}>
                    <h1 className="text-4xl md:text-5xl font-bold relative z-2 ">{raw_data.header || "Terms and Conditions"}</h1>
                    <p className={`mt-3 max-w-[480px] mx-auto text-sm relative z-2 `}>
                        {raw_data.sub_header || "A practical estimator for monthly home loan payments."}
                    </p>

                    <div className='absolute bg-gradient-to-b from-25% from-transparent to-black/70 z-1 top-0 left-0 bottom-0 w-full h-full'></div>
                </div>

                <div className=''>Terms body goes here</div>

                {is_theme && <ComponentSettings raw_data={raw_data} category='terms' component='TermsVar1' component_type='Terms' />}

            </section>
        )
    }
}

export default TermsVar1