"use client"

import { Helpers } from '@/_lib/helper';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import { updateDataCounts, updateFavorites } from '@/app/GlobalRedux/user/userSlice';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaHeartCircleMinus, FaHeartCirclePlus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const helpers = new Helpers();
const FavoriteButton = ({ themeSett, property_uid }: { themeSett: any, property_uid: string, }) => {

    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [submitting, setIsSubmitting] = useState(false);

    const AddToFav = async () => {

        if (window.MLS_Util) {
            // window.MLS_Util.Init(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ACCOUNT_ID);
            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "user_uid": user.user_info?.user_uid,
                "property_uid": property_uid
            }

            toast.dismiss();
            setIsSubmitting(true);
            const response = await window.MLS_Util.AddToFavorites(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                dispatch(updateFavorites(response.data.favorites));
                dispatch(updateDataCounts({ "favorites": response.data.favorites.length }));

                toast.success(`Property successfully added to favorite lists`);

            } else {

                var msg_out = resp_message;
                if (resp_message == "Missing required field (user_uid)") {
                    msg_out = "You need to login to add listing to favorites"
                }

                toast.error(`${msg_out}`);
            }

            setIsSubmitting(false);
        }

    }

    const RemoveFromFav = async () => {

        if (window.MLS_Util) {
            // window.MLS_Util.Init(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ACCOUNT_ID);
            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "user_uid": user.user_info?.user_uid,
                "property_uid": property_uid,
            }

            toast.dismiss();
            setIsSubmitting(true);
            const response = await window.MLS_Util.RemoveFromFavorites(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                dispatch(updateFavorites(response.data.favorites));
                dispatch(updateDataCounts({ "favorites": response.data.favorites.length }));

                toast.success(`Property successfully removed to favorite lists`);

            } else {

                var msg_out = resp_message;
                if (resp_message == "Missing required field (user_uid)") {
                    msg_out = "You need to login to remove listing from favorites"
                }

                toast.error(`${msg_out}`);
            }

            setIsSubmitting(false);
        }

    }

    if (submitting) {
        return (
            <div className={`size-8 flex items-center justify-center cursor-pointer rounded-full 
            bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -80)} text-${themeSett.primary_color}`}>
                <AiOutlineLoading3Quarters size={24} className='animate animate-spin' />
            </div>
        )
    }

    if (!submitting) {
        if (user.favorites.includes(property_uid)) {
            return (
                <div className={` size-8 flex items-center justify-center cursor-pointer rounded-full 
                    bg-${themeSett.primary_color} hover:bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -50)} 
                    text-white hover:text-${themeSett.primary_color}`}
                    onClick={RemoveFromFav}>
                    <FaHeartCircleMinus size={20} />
                </div>
            )
        } else {
            return (
                <div className={` size-8 flex items-center justify-center cursor-pointer rounded-full 
                    bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -50)} 
                    text-${themeSett.primary_color} hover:bg-${themeSett.primary_color} hover:text-white`}
                    onClick={AddToFav}>
                    <FaHeartCirclePlus size={20} />
                </div>
            )
        }

    }
}

export default FavoriteButton