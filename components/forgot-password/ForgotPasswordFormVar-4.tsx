
'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { BsGear, BsTwitterX, BsWhatsapp } from 'react-icons/bs';

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
import { MdLockReset } from 'react-icons/md';
import Link from 'next/link';
import { FaFacebook, FaYoutube } from 'react-icons/fa6';
import { LiaLinkedin } from 'react-icons/lia';
import CustomLinkMain from '@/components/CustomLink';
import Image from 'next/image';

const helpers = new Helpers();
const ForgotPasswordFormVar4 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
                    "component": "ForgotPasswordFormVar4",
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
                <section className="min-h-screen bg-white relative py-15">

                    <div className={`w-full lg:min-h-[calc(100dvh-100px)] max-w-7xl px-3 xs:px-6 mx-auto flex justify-end items-stretch`}>

                        {/* Left Side - Image/Gradient */}
                        <div className={`hidden lg:flex lg:w-1/2 items-center relative`}>
                            <div className={` w-full h-[90dvh] rounded-2xl shadow-2xl lg:flex bg-gradient-to-br from-${themeSett.primary_color} 
                                to-${helpers.adjustColorShade(themeSett.primary_color, 2)} flex-col items-center justify-center px-8 py-16`}>

                                <div className={`text-${themeSett.primary_button_text} max-w-md grow flex flex-col justify-center`}>
                                    <h2 className="text-4xl font-bold mb-4">{raw_data.service_header || "Get started"}</h2>
                                    <p className="  mb-8">
                                        {raw_data.service_sub_header || "Join our community and unlock amazing services"}
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 bg-${themeSett.primary_button_text} text-${themeSett.primary_color} rounded-full flex items-center justify-center mt-1`}>
                                                <span className=" text-sm font-bold">✓</span>
                                            </div>
                                            <p> {raw_data.top_service_1 || "Secure and encrypted"}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 bg-${themeSett.primary_button_text} text-${themeSett.primary_color} rounded-full flex items-center justify-center mt-1`}>
                                                <span className=" text-sm font-bold">✓</span>
                                            </div>
                                            <p>{raw_data.top_service_2 || "24/7 customer support"}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 bg-${themeSett.primary_button_text} text-${themeSett.primary_color} rounded-full flex items-center justify-center mt-1`}>
                                                <span className=" text-sm font-bold">✓</span>
                                            </div>
                                            <p>{raw_data.top_service_3 || "Lightning fast experience"}</p>
                                        </div>


                                        {(raw_data.top_service_4 && raw_data.top_service_4 != "") &&
                                            <div className="flex items-center gap-3">
                                                <div className={`flex-shrink-0 w-6 h-6 bg-${themeSett.primary_button_text} text-${themeSett.primary_color} rounded-full flex items-center justify-center mt-1`}>
                                                    <span className=" text-sm font-bold">✓</span>
                                                </div>
                                                <p>{raw_data.top_service_4}</p>
                                            </div>
                                        }

                                        {(raw_data.top_service_5 && raw_data.top_service_5 != "") &&
                                            <div className="flex items-center gap-3">
                                                <div className={`flex-shrink-0 w-6 h-6 bg-${themeSett.primary_button_text} text-${themeSett.primary_color} rounded-full flex items-center justify-center mt-1`}>
                                                    <span className=" text-sm font-bold">✓</span>
                                                </div>
                                                <p>{raw_data.top_service_5}</p>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className=' w-full flex flex-col shrink-0'>
                                    <div className={`h-0.5 w-full mt-16 bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent 
                                        transition-opacity duration-700 `} />

                                    <div className="w-full flex flex-col items-center md:items-end mt-10">
                                        <div className="w-full flex items-center justify-center gap-4">
                                            {brker_info?.social_accounts?.facebook &&
                                                <Link href={`${brker_info?.social_accounts?.facebook}`}
                                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                                    transition-colors text-stone-200 hover:text-${themeSett.primary_button_text}
                                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                                    <FaFacebook size={20} />
                                                </Link>
                                            }

                                            {brker_info?.social_accounts?.twitter &&
                                                <Link href={`${brker_info?.social_accounts?.twitter}`}
                                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                                    transition-colors text-stone-200 hover:text-${themeSett.primary_button_text}
                                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                                    <BsTwitterX size={20} />
                                                </Link>
                                            }

                                            {brker_info?.social_accounts?.linkedin &&
                                                <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                                    transition-colors text-stone-200 hover:text-${themeSett.primary_button_text}
                                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                                    <LiaLinkedin size={20} />
                                                </Link>
                                            }

                                            {brker_info?.social_accounts?.youtube &&
                                                <Link href={`${brker_info?.social_accounts?.youtube}`}
                                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                                    transition-colors text-stone-200 hover:text-${themeSett.primary_button_text}
                                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                                    <FaYoutube size={20} />
                                                </Link>
                                            }

                                            {brker_info?.social_accounts?.whatsapp &&
                                                <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                                    transition-colors text-stone-200 hover:text-${themeSett.primary_button_text}
                                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank' >
                                                    <BsWhatsapp size={20} />
                                                </Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full lg:w-1/2 flex  items-center justify-center px-6 py-15">
                            <div className="absolute flex lg:hidden top-3.5 left-3.5">
                                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                    <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                                </CustomLinkMain>
                            </div>

                            <div className="w-full max-w-md">
                                {/* Header */}
                                <div className="mb-10">
                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4
                                    bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)}`}>
                                        <MdLockReset className={`w-7 h-7 text-${themeSett.primary_color}`} />
                                    </div>
                                    <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">{raw_data.header || "Forgot Password?"}</h1>
                                    <p className="text-gray-600">{raw_data.sub_header || "Enter account email below. We will send you a link to reset your password."}</p>
                                </div>

                                {/* Form */}
                                <div className="space-y-4 w-full flex flex-col">
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
                                <div className="text-left text-gray-600 text-sm mt-6">
                                    <CustomLink href={`${themeSett.channel_website}/login`} is_theme={is_theme}
                                        className='text-sky-700'>Back to login</CustomLink>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={` block lg:hidden h-0.5 w-full mt-10 bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent 
                        transition-opacity duration-700 `} />

                    <div className="w-full flex lg:hidden flex-col items-center md:items-end mt-10">
                        <div className="w-full flex items-center justify-center gap-4">
                            {brker_info?.social_accounts?.facebook &&
                                <Link href={`${brker_info?.social_accounts?.facebook}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-500 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <FaFacebook size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.twitter &&
                                <Link href={`${brker_info?.social_accounts?.twitter}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-500 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <BsTwitterX size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.linkedin &&
                                <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-500 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <LiaLinkedin size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.youtube &&
                                <Link href={`${brker_info?.social_accounts?.youtube}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-500 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <FaYoutube size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.whatsapp &&
                                <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                        transition-colors text-stone-500 hover:text-${themeSett.primary_button_text}
                                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank' >
                                    <BsWhatsapp size={20} />
                                </Link>
                            }
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

export default ForgotPasswordFormVar4