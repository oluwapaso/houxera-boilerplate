'use client';

import React, { useEffect, useRef, useState } from 'react'
import CustomLinkMain from '../CustomLink';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import { BiHeartCircle, BiLogOut, BiMenu, BiSave, BiWalk } from 'react-icons/bi';
import { logOutState, updateUserWholeState } from '@/app/GlobalRedux/user/userSlice';
import { FaGears } from 'react-icons/fa6';
import { BsHeart } from 'react-icons/bs';
import { ImHeart } from 'react-icons/im';

const LoggedInMenu = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [is_menu_opened, setMenuOpened] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const Logout = () => {
        setMenuOpened(false);
        dispatch(logOutState());
        // dispatch(updateUserWholeState({ isLogged: false, user_info: {} }));
    }

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpened(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [menuRef]);

    if (themeSett) {
        return (
            <div className=' flex items-center space-x-6'>
                <CustomLinkMain href={`/favorites?page=1`} is_theme={is_theme}
                    className={`relative flex items-center justify-center cursor-pointer `}>
                    <ImHeart size={25} />
                    <span className=' absolute -top-3.5 -right-3.5 flex items-center justify-center 
                    rounded-full text-xs size-6'>
                        {user.data_counts.favorites || 99}
                    </span>
                </CustomLinkMain>

                <div className=' relative' ref={menuRef}>
                    <div className={` size-9 rounded-full flex items-center justify-center `}
                        onClick={() => setMenuOpened(true)}>
                        <BiMenu size={25} />
                    </div>

                    {is_menu_opened &&
                        <div className={` absolute w-[240px] z-30 bg-white shadow-2xl rounded divide-y divide-gray-200 
                            overflow-hidden top-12 right-0 *:flex *:items-center *:space-x-2 *:px-4 *:py-4 *:cursor-pointer 
                            *:text-gray-800`}>

                            <CustomLinkMain href={`/prefrences`}
                                className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150`}>
                                <FaGears size={18} /> <span>Prefrences</span>
                            </CustomLinkMain>

                            <CustomLinkMain href={`/favorites?page=1`}
                                className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150`}>
                                <BsHeart size={18} /> <span>Favorites ({user.data_counts.favorites || 0})</span>
                            </CustomLinkMain>

                            <CustomLinkMain href={`/scheduled-tours?satus=Pending&page=1`}
                                className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150`}>
                                <BiWalk size={18} /> <span>Scheduled Tours ({user.data_counts.upcoming_tours || 0})</span>
                            </CustomLinkMain>

                            <CustomLinkMain href={`/saved-searches?page=1`}
                                className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150`}>
                                <BiSave size={18} /> <span>Saved Searches</span>
                            </CustomLinkMain>

                            <div onClick={Logout} className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in 
                                hover:delay-150`}>
                                <BiLogOut size={18} /> <span>Logout</span>
                            </div>

                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default LoggedInMenu