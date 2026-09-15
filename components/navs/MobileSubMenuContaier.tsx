"use client"

import React, { useEffect, useRef, useState } from 'react'
import CustomLinkMain from '../CustomLink'

const MobileSubMenuContaier = ({ menu, themeSett, is_theme }: { menu: any, themeSett: any, is_theme: boolean }) => {

    return <div className={`relative hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150 whitespace-nowrap`}>
        <div className={` `}>{menu.title}</div>
        <div className='pl-5'>
            <div className='  bg-white shadow-xl flex flex-col *:flex *:px-5 *:py-4 
                divide-y divide-gray-200 rounded-md max-h-[300px] overflow-y-auto'>
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