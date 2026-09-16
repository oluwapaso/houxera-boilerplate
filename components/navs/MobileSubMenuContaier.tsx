"use client"

import React, { useEffect, useRef, useState } from 'react'
import CustomLinkMain from '../CustomLink'
import { FaArrowRightLong } from 'react-icons/fa6'

const MobileSubMenuContaier = ({ menu, themeSett, is_theme }: { menu: any, themeSett: any, is_theme: boolean }) => {

    return <div className={`relative flex flex-col hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150 whitespace-nowrap`}>
        <div className={`font-semibold`}>{menu.title}</div>
        <div className='mt-2 flex space-x-1.5'>
            <FaArrowRightLong size={18} className='shrink-0' />
            <div className='grow flex flex-col *:flex *:py-4 *:w-full divide-y divide-gray-200 '>
                {(Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) && (
                    menu.sub_menu.map((sub_menu: any, index: any) => {
                        return <CustomLinkMain key={index} href={`${sub_menu.link ? menu.link : ""}`} is_theme={is_theme}
                            className={` text-gray-900 hover:bg-${themeSett.primary_color} hover:text-white transition-all 
                                ease-in hover:delay-150`}>
                            {sub_menu.title}
                        </CustomLinkMain>
                    })
                )}
            </div>
        </div>
    </div>
}

export default MobileSubMenuContaier