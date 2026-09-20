
'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiLock, BiRefresh, BiTrash } from 'react-icons/bi';
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
const ForgotPasswordFormVar5 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const redirect = searchParams?.get("redirect") as string || "/home";
    const brker_info = useSelector((state: RootState) => state.broker);

    const dispatch = useDispatch<AppDispatch>();
    const reset_params = {
        email: ""
    }

    const [ResetParams, setResetParams] = useState(reset_params);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);

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
                    "component": "ForgotPasswordFormVar5",
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
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-br 
                    from-${themeSett.primary_color} to-${themeSett.primary_color} pt-35 pb-54 relative bg-cover bg-center "
                    style={{ backgroundImage: `url('../houxera-stock-image-3.jpg')` }}>

                    <div className=' w-full flex items-center max-md:justify-center px-3 2xs:px-4 xs:px-6 md:px-20 '>
                        <div className="w-full max-w-lg">
                            {/* Card */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                                {/* Bold Header Bar */}
                                <div className={`h-1 bg-gradient-to-r from-${helpers.adjustColorShade(themeSett.primary_color, -2)} 
                                via-${helpers.adjustColorShade(themeSett.primary_color, -1)} 
                                to-${themeSett.primary_color}`}></div>

                                <div className="px-3 2xs:px-6 xs:px-8 py-8">
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br rounded-full mb-4
                                        from-${helpers.adjustColorShade(themeSett.primary_color, -1)} 
                                        to-${helpers.adjustColorShade(themeSett.primary_color, 2)}`}>
                                            <MdLockReset className={`w-8 h-8 text-${themeSett.primary_button_text}`} />
                                        </div>
                                        <h1 className="text-2xl xs:text-3xl font-black text-gray-900 mb-1">{raw_data.header || "Forgot Password?"}</h1>
                                        <p className="text-gray-700 font-medium">{raw_data.sub_header || "Enter account email below. We will send you a link to reset your password."}</p>
                                    </div>

                                    {/* Form */}
                                    <div className="space-4-5">
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

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-6">
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                        <span className="text-gray-500 text-sm">OR</span>
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                    </div>

                                    {/* Footer */}
                                    <p className="text-center text-gray-700 text-sm mt-6 font-medium">
                                        <CustomLink href={`${themeSett.channel_website}/login`} is_theme={is_theme}
                                            className='text-sky-700'>Back to login</CustomLink>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-3.5 max-md:left-3.5 right-3.5">
                        <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                            <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                        </CustomLinkMain>
                    </div>

                    <div className="w-full absolute bottom-3.5 right-3.5 flex flex-col items-center justify-center md:justify-end md:items-end">
                        <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-4">Get in Touch</h4>
                        <div className=' flex flex-col space-y-1 items-center md:items-end'>
                            <span className="text-sm text-stone-400">
                                <Link href={`tel:${brker_info?.contact_info?.phone_cell}`} className={`hover:text-${themeSett.primary_color}`}>
                                    {brker_info?.contact_info?.phone_cell}
                                </Link>
                            </span>
                            <span className="text-sm text-stone-400">
                                <Link href={`mailto:${brker_info?.email}`} className={`hover:text-${themeSett.primary_color}`}>
                                    {brker_info?.email}
                                </Link>
                            </span>
                            <span className='text-sm text-stone-400'>
                                <span> {brker_info?.contact_info?.address}</span>
                                {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                    ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                            </span>
                        </div>

                        <div className="flex gap-4 mt-6">
                            {brker_info?.social_accounts?.facebook &&
                                <Link href={`${brker_info?.social_accounts?.facebook}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                    transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <FaFacebook size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.twitter &&
                                <Link href={`${brker_info?.social_accounts?.twitter}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                    transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <BsTwitterX size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.linkedin &&
                                <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                    transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <LiaLinkedin size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.youtube &&
                                <Link href={`${brker_info?.social_accounts?.youtube}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                    transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                    <FaYoutube size={20} />
                                </Link>
                            }

                            {brker_info?.social_accounts?.whatsapp &&
                                <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                    className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                    transition-colors text-stone-400 hover:text-${themeSett.primary_button_text}
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

export default ForgotPasswordFormVar5