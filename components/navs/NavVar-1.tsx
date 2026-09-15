'use client';

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import CustomLinkMain from '../CustomLink';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import LoggedInMenu from './LoggedInMenu';
import { BsGear } from 'react-icons/bs';
import SubMenuContainer from './SubMenuContainer';

const NavVar1 = ({ transparent = true, is_theme = false, raw_data = {} }: { transparent: boolean, is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [is_transparent, setTransparent] = useState<boolean>(transparent);

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "nav",
                    "type": "section",
                    "name": "NavVar1",
                }
            },
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
            <nav className={`w-full flex justify-between items-center px-8 py-2 z-50 h-20 relative
            ${is_transparent ? "bg-transparent" : "bg-white shadow-md"}`}>
                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl">
                    <Image src={`${themeSett?.light_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                </CustomLinkMain>
                <div className={`flex items-center rounded *:flex *:items-center *:justify-center *:px-6 *:py-3 *:border-b-4 
                    *:border-b-transparent *:cursor-pointer 
                    ${is_transparent ? "*:text-white bg-black/50 py-2" : "*:text-gray-800"}`}>

                    {(Array.isArray(themeSett.top_menu) && themeSett.top_menu.length > 0) ? (
                        themeSett.top_menu.map((menu: any, index: any) => {

                            //Submenu
                            if (Array.isArray(menu.sub_menu) && menu.sub_menu.length > 0) {

                                return <SubMenuContainer key={index} menu={menu} themeSett={themeSett} is_theme={is_theme} />

                            } else {
                                return <CustomLinkMain key={index} href={`${menu.link ? menu.link : ""}`} is_theme={is_theme} className={` hover:border-b-${themeSett.primary_color} transition-all ease-in hover:delay-150`}>{menu.title}</CustomLinkMain>
                            }
                        })
                    ) : null}

                    {(user.isLogged)
                        ? <LoggedInMenu is_theme={is_theme} />
                        : <CustomLinkMain href={`/login`} is_theme={is_theme} className={`transition-all ease-in hover:delay-150 mx-3 rounded
                        bg-${themeSett.primary_color} !text-white hover:shadow-2xl !px-8 !border-b-0`}>Login</CustomLinkMain>
                    }
                </div>

                {is_theme && (
                    <div id='editor_settings' className='absolute z-[1000] right-1.5 top-1.5 bg-gray-200 text-gray-800 flex items-center 
                    justify-center p-2 rounded cursor-pointer hover:shadow-2xl'
                        onClick={handleSettingsClick}>
                        <BsGear size={17} />
                    </div>
                )}
            </nav>
        )
    } else {
        return (<div className=' h-56 w-full flex items-center justify-between'>Theme setting not found</div>)
    }
}

export default NavVar1