"use client"

import React, { useEffect, useRef, useState } from 'react'
import CustomLinkMain from '../CustomLink'

const SubMenuContainer = ({ menu, themeSett, is_theme, classes }: { menu: any, themeSett: any, is_theme: boolean, classes?: string }) => {

    const [is_menu_shown, setIsMenuShown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return <div className={`${classes} relative hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150 whitespace-nowrap`}
        ref={menuRef} onClick={() => setIsMenuShown(true)}>
        <div className={` `}>{menu.title}</div>

        {is_menu_shown && (
            <div className='absolute w-[290px] top-[60px] right-0  bg-white shadow-xl flex flex-col *:flex *:px-5 *:py-4 
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
        )}
    </div>
}

export default SubMenuContainer