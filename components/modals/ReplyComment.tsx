"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import FloatingTextarea from '../FloatingTextarea'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Helpers } from '@/_lib/helper'
import { useSearchParams } from 'next/navigation'

const helpers = new Helpers();
const ReplyComment = ({ closeModal, item_type, item_uid, comment_uid, setRepToAppend, setNoComms, is_theme = false }:
    {
        closeModal: () => void, item_type: string, item_uid: string, comment_uid: string, setRepToAppend: React.Dispatch<any>,
        setNoComms: React.Dispatch<React.SetStateAction<number>>, is_theme?: boolean
    }) => {

    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const [formData, setFormData] = useState<any>({
        "post_uid": item_uid, //for blog post
        "neighborhood_uid": item_uid, //for neighborhood post
        "comment_uid": comment_uid,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {

        setFormData((prevData: any) => {
            const prevVal = { ...prevData }
            return {
                ...prevVal,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async () => {

        toast.dismiss();
        try {
            if (!comment_uid || !item_uid) {
                toast.error("Fatal error.", {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            if (!user.user_info?.firstname || user.user_info?.firstname == "" || !user.user_info?.email || user.user_info?.email == ""
                || !user.user_info?.user_uid || user.user_info?.user_uid == "") {
                toast.error("You need to login to leave a comment..", {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            if (!formData.comments) {
                toast.error("Provide a valid reply.", {
                    position: "top-center",
                    theme: "colored"
                });

                return false;
            }

            setRepToAppend(null)
            dispatch(showPageLoader());

            var payload = {
                "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
                "post_uid": item_uid, //for blog post
                "neighborhood_uid": item_uid, //for neighborhood post
                "email": user.user_info?.email,
                "firstname": user.user_info?.firstname,
                "lastname": user.user_info?.lastname,
                ...formData
            };

            let response: any
            if (item_type == "Blog Post") {
                response = await window.MLS_Util.AddBlogPostComment(payload);
            } else if (item_type == "Neighborhood") {
                response = await window.MLS_Util.AddNeighborhoodComment(payload);
            }

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                setRepToAppend(response.data);
                toast.success(`Reply successfully added.`, {
                    position: "top-center",
                    theme: "colored"
                });

                dispatch(hidePageLoader());
                closeModal();

                setNoComms((prev_val) => {
                    return ++prev_val
                })

            } else {
                if (Array.isArray(resp_message)) {
                    resp_message = resp_message.toString();
                }

                toast.error(resp_message, {
                    position: "top-center",
                    theme: "colored"
                });
            }

        } catch (e: any) {
            dispatch(hidePageLoader());
            toast.error(`${e}`, {
                position: "top-center",
                theme: "colored"
            });
        } finally {
            dispatch(hidePageLoader());
        }

    }

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {

        return (
            <div className='w-full'>
                <div >
                    <div className='w-full'>
                        <div className='w-full'>
                            <FloatingTextarea name="comments" height='180px' placeholder='Add your reply...'
                                label='Comments' handleChange={(e) => handleInputChange(e)} value={formData.message} required />
                        </div>

                        <div className='w-full mt-4'>
                            <button className={`bg-${themeSett?.primary_color} text-${themeSett.primary_button_text} py-3 px-5 
                            float-right space-x-2 hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} 
                            hover:drop-shadow-md flex items-center rounded cursor-pointer`}
                                onClick={() => handleSubmit()}>
                                <span>Add Reply</span> <FaArrowRightLong size={18} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )

    }

    return null
}

export default ReplyComment