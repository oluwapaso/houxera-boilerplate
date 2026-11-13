
'use client';

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BiLayerPlus } from 'react-icons/bi';

const NoComponents = ({ is_theme = false, layout_page = true, raw_data }: { is_theme?: boolean, layout_page?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const AddLayout = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            { type: layout_page ? 'ADD_PAGE_LAYOUT' : 'ADD_COMPONENT' },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {

        return (
            <section className="w-full py-20 flex justify-center relative" data-show-featured-listings="Yes">

                <div className={`container flex flex-col items-center justify-center space-y-3.5 py-16`}>
                    <div className=' w-full flex items-center justify-center'>
                        {layout_page ? "No page layout added yet." : "No component added yet."}
                    </div>
                    <div className='px-4 py-2 bg-gray-900 text-white hover:shadow-2xl rounded flex items-center justify-center
                        cursor-pointer' onClick={AddLayout}>
                        <BiLayerPlus size={16} className='mr-1.5' />
                        <span>{layout_page ? "Add Page Layout" : "Add a Component"} </span>
                    </div>
                </div>

            </section>
        )
    }
}

export default NoComponents