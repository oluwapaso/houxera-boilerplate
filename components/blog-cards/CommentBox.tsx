"use client"

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { Helpers } from '@/_lib/helper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/GlobalRedux/store'
import { BiCommentAdd } from 'react-icons/bi'
import FloatingInput from '../FloatingInput'
import FloatingTextarea from '../FloatingTextarea'
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice'
import { useSearchParams } from 'next/navigation'

const helpers = new Helpers();
const CommentBox = ({ item_type, item_uid, setRepToAppend, setNoComms, is_theme = false }:
    {
        item_type: string, item_uid: string, setRepToAppend: React.Dispatch<any>,
        setNoComms: React.Dispatch<React.SetStateAction<number>>, is_theme?: boolean
    }) => {

    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const [values, setValues] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setValues((prevVals: any) => {
            return {
                ...prevVals,
                [e.target.name]: e.target.value,
            }
        });
    }

    const handleSubmit = async () => {

        toast.dismiss();
        try {

            if (!helpers.validateEmail(values.email)) {

                toast.error("Provide a valid email address", {
                    position: "top-center",
                    theme: "colored"
                });

                return false;
            }

            if (!values.firstname || !values.lastname || !values.comments) {

                toast.error("All fields are required.", {
                    position: "top-center",
                    theme: "colored"
                });

                return false;
            }

            setSubmitting(true);
            dispatch(showPageLoader());

            var payload = {
                ...values,
                "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
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

                toast.success("Comments successfully added.", {
                    position: "top-center",
                    theme: "colored"
                });

                setValues((prevVals: any) => {
                    return {
                        ...prevVals,
                        "comments": "",
                    }
                });

                setRepToAppend(response.data);
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
            setSubmitting(false);
            dispatch(hidePageLoader());
        }

    }

    useEffect(() => {
        setValues((prevVals: any) => {
            return {
                ...prevVals,
                "post_uid": `${item_uid}`, //for blog posts
                "neighborhood_uid": `${item_uid}`, //for neighborhood insight
                "firstname": `${user.user_info?.firstname || ""}`,
                "lastname": `${user.user_info?.lastname || ""}`,
                "email": `${user.user_info?.email || ""}`,
            }
        });
    }, [user.user_info]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);


    if (themeSett && themeSett != null) {
        return (
            <div className='w-full mt-2 bg-white border border-gray-300 px-6 py-4 shadow-xl rounded-lg'>

                <div className='grid grid-cols-2 gap-5'>
                    <div className=''>
                        <div className='mt-5 flex flex-col'>
                            <FloatingInput label='First Name' placeholder='Full Name' value={values.firstname} name='firstname'
                                handleChange={(e) => handleChange(e)} required />
                        </div>
                    </div>

                    <div className=''>
                        <div className='mt-5 flex flex-col'>
                            <FloatingInput label='Last Name' placeholder='Last Name' value={values.lastname} name='lastname'
                                handleChange={(e) => handleChange(e)} required />
                        </div>
                    </div>
                </div>

                <div className='mt-5 flex flex-col'>
                    <FloatingInput label='Email Address' placeholder='Email' value={values.email} name='email'
                        handleChange={(e) => handleChange(e)} required />
                    <small className='w-full mt-1 text-red-600'>
                        Note: your email is secure and we will never share your email with any third party.
                    </small>
                </div>

                <div className='mt-5'>
                    <FloatingTextarea label='Comments' placeholder='Comments' value={values.comments} name='comments' height='256px'
                        handleChange={(e) => handleChange(e)} required />
                </div>

                <div className='my-5 flex justify-end'>
                    {
                        !submitting ? (
                            <button className={`bg-${themeSett?.primary_color} text-${themeSett.primary_button_text} font-normal 
                            px-6 py-3 hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} rounded 
                            flex items-center space-x-2 cursor-pointer`}
                                onClick={handleSubmit}>
                                <BiCommentAdd size={18} />
                                <span>Leave a Comment</span>
                            </button>
                        ) : <button className={`bg-${themeSett?.primary_color} text-${themeSett.primary_button_text} px-6 py-3 flex 
                            opacity-45 font-normal items-center cursor-not-allowed rounded`}>
                            <AiOutlineLoading3Quarters size={14} className='animate-spin' />  <span className='ml-2'>Please wait...</span>
                        </button>
                    }

                </div>

                {/** <ToastContainer /> **/}
            </div>
        )
    }
}

export default CommentBox