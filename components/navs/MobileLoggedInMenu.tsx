"use client"

import React, { useEffect, useState } from 'react'
import CustomLinkMain from '../CustomLink'
import { FaGears } from 'react-icons/fa6'
import { BsHeart } from 'react-icons/bs'
import { BiLogOut, BiSave, BiWalk } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/GlobalRedux/store'
import { logOutState } from '@/app/GlobalRedux/user/userSlice';

const MobileLoggedInMenu = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const Logout = () => {
        dispatch(logOutState());
        // dispatch(updateUserWholeState({ isLogged: false, user_info: {} }));
    }

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <>
                <CustomLinkMain href={`/prefrences`}
                    className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150
                    flex items-center space-x-2 px-4 py-4 cursor-pointer `}>
                    <FaGears size={18} /> <span>Prefrences</span>
                </CustomLinkMain>

                <CustomLinkMain href={`/favorites?page=1`}
                    className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150
                    flex items-center space-x-2 px-4 py-4 cursor-pointer`}>
                    <BsHeart size={18} /> <span>Favorites ({user.data_counts.favorites || 0})</span>
                </CustomLinkMain>

                <CustomLinkMain href={`/scheduled-tours?satus=Pending&page=1`}
                    className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150
                    flex items-center space-x-2 px-4 py-4 cursor-pointer`}>
                    <BiWalk size={18} /> <span>Scheduled Tours ({user.data_counts.upcoming_tours || 0})</span>
                </CustomLinkMain>

                <CustomLinkMain href={`/saved-searches?page=1`}
                    className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150
                    flex items-center space-x-2 px-4 py-4 cursor-pointer`}>
                    <BiSave size={18} /> <span>Saved Searches</span>
                </CustomLinkMain>

                <div onClick={Logout} className={`hover:border-b-${themeSett.primary_color}-400 transition-all ease-in hover:delay-150
                    flex items-center space-x-2 px-4 py-4 cursor-pointer`}>
                    <BiLogOut size={18} /> <span>Logout</span>
                </div>
            </>
        )
    }
}

export default MobileLoggedInMenu