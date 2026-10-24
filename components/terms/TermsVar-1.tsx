"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import ComponentSettings from '../editor-items/ComponentSettings'
import { BiEdit, BiLayerPlus } from 'react-icons/bi'

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

    const AddPageContent = (page_body?: string) => {

        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'UPDATE_PAGE_CONTENT',
                data: {
                    "category": "terms",
                    "field": "page_body",
                    "component": "TermsVar1",
                    "page_body": page_body
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );

    }

    if (themeSett && themeSett != null) {
        return (
            <section className="w-full min-h-[100dvh] relative bg-gray-100 max-xs:px-3 pb-8 sm:pb-16">

                {/* hero band */}
                <div className={`w-full pb-20 pt-48 px-4 text-center object-cover !bg-cover !bg-center bg-${themeSett.primary_color} 
                text-${themeSett.primary_button_text} relative`} style={{ background: `url('${raw_data.header_image || "../no-image-found.jpg"}')` }}>
                    <h1 className="text-4xl md:text-5xl font-bold relative z-2 ">{raw_data.header || "Terms and Conditions"}</h1>
                    <p className={`mt-3 max-w-[480px] mx-auto text-sm relative z-2 `}>
                        {raw_data.sub_header || "A practical estimator for monthly home loan payments."}
                    </p>

                    <div className='absolute bg-gradient-to-b from-25% from-transparent to-black/70 z-1 top-0 left-0 bottom-0 w-full h-full'></div>
                </div>

                {!raw_data.page_body && (
                    <div className=' mx-auto w-full max-w-2xl bg-white p-6 rounded mt-12 flex flex-col items-center justify-center shadow-lg'>
                        <div>No terms added yet</div>
                        <div className=' flex w-fit mt-2 items-center justify-center bg-gray-900 text-white 
                            px-3 xs:px-6 py-2 xs:py-3 rounded cursor-pointer space-x-1.5' onClick={() => AddPageContent()}>
                            <BiLayerPlus size={16} /> <span className='text-sm'>Add Contents</span>
                        </div>
                    </div>
                )}

                {raw_data.page_body && (
                    <div className='container max-w-[1280px] mx-auto bg-white rounded shadow-lg 
                        mt-8 sm:mt-16 px-4 xs:px-6 xl:px-8 py-5 xs:py-8 relative'>
                        <div className='w-full font-normal overflow-x-hidden'>
                            <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: raw_data.page_body }} />
                        </div>
                    </div>
                )}

                {is_theme && <ComponentSettings raw_data={raw_data} category='terms' component='TermsVar1' component_type='Terms' />}

            </section>
        )
    }
}

export default TermsVar1