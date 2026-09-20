
'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiEnvelope, BiLock, BiPhoneOutgoing, BiRefresh, BiTrash, BiUserPlus } from 'react-icons/bi';
import { BsDot, BsGear } from 'react-icons/bs';

import CustomLink from '@/components/CustomLink'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import { updateUserInfo, updateUserWholeState } from '@/app/GlobalRedux/user/userSlice'
import FloatingInput from '@/components/FloatingInput'
import { BiLogIn } from 'react-icons/bi'
import { Helpers } from '@/_lib/helper';
import { UserInfo } from "@/components/types";
import CustomLinkMain from '@/components/CustomLink';
import Image from 'next/image';
import Link from 'next/link';

const helpers = new Helpers();
const ForgotPasswordFormVar3 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const redirect = searchParams?.get("redirect") as string || "/home";

    const dispatch = useDispatch<AppDispatch>();
    const reset_params = {
        email: ""
    }

    const [ResetParams, setResetParams] = useState(reset_params);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const brker_info = useSelector((state: RootState) => state.broker);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetParams((prev_state) => {
            return {
                ...prev_state,
                [e.target.name]: e.target.value
            }
        })
    }

    const handlePasswordReset = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        if (window.MLS_Util) {

            window.MLS_Util.Init(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ACCOUNT_ID, process.env.NEXT_PUBLIC_MLS_NUMBER, process.env.NEXT_PUBLIC_PROPERTY_DETAILS_EP);

            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                ...ResetParams,
            }

            try {

                setIsResetting(true);
                const response = await window.MLS_Util.StartPasswordReset(payload);

                let resp_message = response.message;
                let status_code = response.status_code;
                if (status_code == 200) {

                    toast.success("Reset link successfully sent to your email address, follow the link to set new a password", {
                        position: "top-center",
                        theme: "colored"
                    });

                    dispatch(updateUserInfo({} as UserInfo));
                    dispatch(updateUserWholeState({ isLogged: false }));
                    setResetParams(reset_params);

                } else {
                    dispatch(updateUserWholeState({ isLogged: false }));
                    toast.error(`${resp_message || resp_message.message}`, {
                        position: "top-center",
                        theme: "colored"
                    });
                }

            } catch (error) {
                dispatch(updateUserWholeState({ isLogged: false }));
                toast.error(`${error}`, {
                    position: "top-center",
                    theme: "colored"
                });
            } finally {
                setIsResetting(false);
            }

        }
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "forgot_password",
                    "type": "section",
                    "component": "ForgotPasswordFormVar3",
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "Forget Password"
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleHover = () => {
        setSectionHover(true);
    }

    const handleMouseExist = () => {
        setSectionHover(false);
    }

    useEffect(() => {
        dispatch(hidePageLoader());
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (user.isLogged) {
        router.push(`${themeSett.channel_website}/home`);
    } else {

        if (themeSett) {
            return (
                <section className="min-h-screen bg-white relative p-0">

                    <div className={`w-full min-h-screen mx-auto flex justify-end items-stretch`}>
                        {/* Left Side - Image/Gradient */}
                        <div className={`hidden fixed h-full left-0 lg:flex lg:w-1/2 bg-gradient-to-br from-${themeSett.primary_color} 
                            to-${helpers.adjustColorShade(themeSett.primary_color, 2)} items-end justify-start p-8`}>

                            <div className="absolute top-3.5 left-3.5">
                                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                    <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                                </CustomLinkMain>
                            </div>

                            <div className={`text-${themeSett.primary_button_text} max-w-md`}>
                                <h2 className="text-4xl font-bold mb-4">{raw_data.service_header || "Get started"}</h2>
                                <p className={`text-${themeSett.primary_button_text} mb-8`}>
                                    {raw_data.service_sub_header || "Join our community and unlock amazing services"}
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full lg:w-1/2 flex items-center justify-center px-3 xs:px-6 py-25 relative">

                            <div className="absolute flex lg:hidden top-3.5 left-3.5">
                                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                    <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                                </CustomLinkMain>
                            </div>

                            <div className="w-full absolute bottom-3.5 right-3.5 flex justify-end items-center 
                                space-x-3 min-w-0 shrink text-gray-500 ">
                                <Link
                                    href={`tel:${brker_info?.contact_info?.phone_cell}`}
                                    className={`flex items-center space-x-1.5 min-w-0`}
                                >
                                    <BiPhoneOutgoing size={16} className="shrink-0" />
                                    <span className="truncate">{brker_info?.contact_info?.phone_cell}</span>
                                </Link>

                                <BsDot size={16} className="shrink-0" />

                                <Link
                                    href={`mailto:${brker_info?.email}`}
                                    className={`flex items-center space-x-1.5 min-w-0`}
                                >
                                    <BiEnvelope size={16} className="shrink-0" />
                                    <span className="truncate">{brker_info?.email}</span>
                                </Link>
                            </div>

                            <div className="w-full max-w-md">
                                {/* Header */}
                                <div className="mb-10">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-6  
                                        border border-${themeSett.primary_color}`}>
                                        <BiLock className={`w-7 h-7 text-${themeSett.primary_color}`} />
                                    </div>
                                    <h1 className="text-2xl xs:text-3xl font-bold mb-2">{raw_data.header || "Forgot Password?"}</h1>
                                    <p className="text-slate-400">{raw_data.sub_header || "Enter account email below. We will send you a link to reset your password."}</p>
                                </div>

                                {/* Form */}
                                <div className="space-y-4">

                                    <div className='w-full'>
                                        <FloatingInput name='email' label='Account Email' placeholder='Account Email'
                                            handleChange={(e) => handleChange(e)} value={ResetParams.email} required />
                                    </div>

                                    <div className='w-full mt-2'>
                                        {!isResetting ?
                                            <button className={`w-full cursor-pointer bg-${themeSett.primary_color} 
                                            text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-4 rounded space-x-1.5 
                                            font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                                                onClick={handlePasswordReset}> <span>{raw_data.button_text || "Send Reset Link"}</span> <BiLogIn size={16} /> </button> :
                                            <div className={`w-full border-2 border-${themeSett.primary_color} 
                                            text-${themeSett.primary_color} text-center py-4 px-4 rounded flex items-center 
                                            justify-center cursor-not-allowed font-medium`}>
                                                <span>Sending Link... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                                    className='animate-spin ml-2' />
                                            </div>
                                        }
                                    </div>
                                </div>

                                {/* Footer */}
                                <p className="text-left text-slate-400 text-sm mt-8">
                                    <CustomLink href={`${themeSett.channel_website}/login`} is_theme={is_theme}
                                        className='text-sky-700'>Back to login</CustomLink>
                                </p>
                            </div>

                        </div>
                    </div>

                    {is_theme && (
                        <div className=' absolute z-[1000] right-1.5 top-20 space-x-2 flex items-center justify-end *:bg-gray-800 
                        *:text-white *:flex *:items-center *:justify-center *:p-2 *:rounded *:cursor-pointer'>

                            <div id='editor_settings' className='hover:shadow-2xl relative group'
                                onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                                <BsGear size={17} />

                                <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                    Section settings
                                </span>
                            </div>

                            <div id='editor_settings' className='hover:shadow-2xl relative group'
                                onClick={() => handleCompPickerClick("CHANGE_LAYOUT")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                                <BiRefresh size={17} />

                                <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                    Replace Section
                                </span>
                            </div>

                            <div id='editor_settings' className='hover:shadow-2xl relative group'
                                onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                                <BiTrash size={17} />

                                <span className='absolute hidden right-0 whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                    Remove Section Down
                                </span>
                            </div>

                        </div>
                    )}
                </section>
            );
        }
    }
}

export default ForgotPasswordFormVar3