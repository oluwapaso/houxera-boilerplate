
'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiLock, BiRefresh, BiTrash } from 'react-icons/bi';
import { BsGear, BsTwitterX, BsWhatsapp } from 'react-icons/bs';

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
import CustomLinkMain from '../CustomLink';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { LiaLinkedin } from 'react-icons/lia';

const helpers = new Helpers();
const ResetPasswordFormVar6 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const account_email = searchParams?.get("email") as string;
    const token = searchParams?.get("token") as string;

    const dispatch = useDispatch<AppDispatch>();
    const reset_params = {
        email: ""
    }

    const [ResetParams, setResetParams] = useState(reset_params);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [password, setPassword] = useState("");
    const [confirm_password, setConfPass] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const brker_info = useSelector((state: RootState) => state.broker);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetParams((prev_state) => {
            return {
                ...prev_state,
                [e.target.name]: e.target.value
            }
        })
    }

    const handlePasswordUpdate = async () => {

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

            toast.dismiss();
            if (!helpers.validateEmail(account_email) || token == "") {
                toast.error("Account email or token is missing", {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            let error_msg: string = ""
            if (password.length < 5) {
                error_msg = "Password can't be less that 5 characters"
            } else if (password != confirm_password) {
                error_msg = "Password must match"
            }

            if (error_msg != "") {
                toast.error(error_msg, {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "email": account_email,
                "reset_token": token,
                "password": password,
                "confirm_password": confirm_password,
            }

            try {

                setIsSubmitting(true);
                const response = await window.MLS_Util.UpdateUserPassword(payload);

                let resp_message = response.message;
                let status_code = response.status_code;
                if (status_code == 200) {

                    toast.success("Password successfully updated.", {
                        position: "top-center",
                        theme: "colored"
                    });

                    dispatch(updateUserInfo({} as UserInfo));
                    dispatch(updateUserWholeState({ isLogged: false }));
                    setPassword("");
                    setConfPass("");

                } else {
                    setIsSubmitting(false);
                    toast.error(`${resp_message || resp_message.message}`, {
                        position: "top-center",
                        theme: "colored"
                    });
                }

            } catch (error) {
                setIsSubmitting(false);
                toast.error(`${error}`, {
                    position: "top-center",
                    theme: "colored"
                });
            } finally {
                setIsSubmitting(false);
            }

        }
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "reset_password",
                    "type": "section",
                    "component": "ResetPasswordFormVar6",
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
                component_type: "Reset Password"
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

                    <div className={`w-full min-h-screen mx-auto flex items-stretch`}>

                        {/* Left Side - Image/Gradient */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-3 2xs:px-6 
                            max-lg:pt-36 pt-20 pb-20 relative">
                            <div className="absolute lg:hidden top-3.5 left-3.5">
                                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                    <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                                </CustomLinkMain>
                            </div>

                            {/* Main Card */}
                            <div className="w-full max-w-lg relative z-10">
                                {/* Header */}
                                <div className="mb-8">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br rounded-xl mb-4 shadow-lg
                                        from-${helpers.adjustColorShade(themeSett.primary_color, 1)} 
                                        to-${helpers.adjustColorShade(themeSett.primary_color, 3)} `}>
                                        <MdLockReset className={`text-${themeSett.primary_button_text} w-7 h-7`} />
                                    </div>
                                    <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">{raw_data.header || "Update Your Password"}</h1>
                                    <p className="text-gray-600">{raw_data.sub_header || "Set a new password to secure your account."}</p>
                                </div>

                                {/* Form */}
                                <div className="space-y-4">
                                    <div className='w-full'>
                                        <FloatingInput name='password' label='New Password' placeholder='New Password' type="password"
                                            handleChange={(e) => setPassword(e.target.value)} value={password} required />
                                    </div>

                                    <div className='w-full mt-4'>
                                        <FloatingInput name='confirm_password' label='Confirm New Password' type="password" required
                                            placeholder='onfirm New Password' handleChange={(e) => setConfPass(e.target.value)}
                                            value={confirm_password} />
                                    </div>

                                    <div className='w-full mt-2'>
                                        {!isSubmitting ?
                                            <button className={`w-full cursor-pointer bg-${themeSett.primary_color} 
                                                text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-4 rounded space-x-1.5 
                                                font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                                                onClick={handlePasswordUpdate}> <span>{raw_data.button_text || "Update Password"}</span> <BiLogIn size={16} /> </button> :
                                            <div className={`w-full border-2 border-${themeSett.primary_color} 
                                                text-${themeSett.primary_color} text-center py-4 px-4 rounded flex items-center 
                                                justify-center cursor-not-allowed font-medium`}>
                                                <span>Updating Password... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                                    className='animate-spin ml-2' />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className={`h-0.5 w-full lg:hidden mt-10 bg-gradient-to-r rounded-full from-transparent via-${themeSett.primary_color} to-transparent 
                                    transition-opacity duration-700 `} />

                            <div className="w-full flex flex-col lg:hidden items-center md:items-end mt-10">
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
                        </div>



                        {/* Right Side - Form */}
                        <div className={`hidden fixed right-0 h-full lg:flex lg:w-1/2 items-end justify-start p-8 bg-cover bg-center `}
                            style={{ backgroundImage: `url('../houxera-stock-image-3.jpg')` }}>

                            <div className="absolute top-3.5 left-3.5">
                                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                    <Image src={`${themeSett?.light_logo || "/Houxera-logo-white.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                                </CustomLinkMain>
                            </div>

                            <div className="w-full flex flex-col items-center md:items-end">
                                <h4 className="text-xs uppercase tracking-wider text-stone-300 mb-4">Get in Touch</h4>
                                <div className=' flex flex-col space-y-1 items-center md:items-end'>
                                    <span className="text-sm text-stone-300">
                                        <Link href={`tel:${brker_info?.contact_info?.phone_cell}`} className={`hover:text-${themeSett.primary_color}`}>
                                            {brker_info?.contact_info?.phone_cell}
                                        </Link>
                                    </span>
                                    <span className="text-sm text-stone-300">
                                        <Link href={`mailto:${brker_info?.email}`} className={`hover:text-${themeSett.primary_color}`}>
                                            {brker_info?.email}
                                        </Link>
                                    </span>
                                    <span className='text-sm text-stone-300'>
                                        <span> {brker_info?.contact_info?.address}</span>
                                        {(brker_info?.contact_info?.address_2 && brker_info?.contact_info?.address_2 != "")
                                            ? <span>{brker_info?.contact_info?.address_2}</span> : null}
                                    </span>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    {brker_info?.social_accounts?.facebook &&
                                        <Link href={`${brker_info?.social_accounts?.facebook}`}
                                            className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                            transition-colors text-stone-300 hover:text-${themeSett.primary_button_text}
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <FaFacebook size={20} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.twitter &&
                                        <Link href={`${brker_info?.social_accounts?.twitter}`}
                                            className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                            transition-colors text-stone-300 hover:text-${themeSett.primary_button_text}
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <BsTwitterX size={20} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.linkedin &&
                                        <Link href={`${brker_info?.social_accounts?.linkedin}`}
                                            className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                            transition-colors text-stone-300 hover:text-${themeSett.primary_button_text}
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <LiaLinkedin size={20} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.youtube &&
                                        <Link href={`${brker_info?.social_accounts?.youtube}`}
                                            className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                            transition-colors text-stone-300 hover:text-${themeSett.primary_button_text}
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank'>
                                            <FaYoutube size={20} />
                                        </Link>
                                    }

                                    {brker_info?.social_accounts?.whatsapp &&
                                        <Link href={`https://api.whatsapp.com/send/?phone=${brker_info?.social_accounts?.whatsapp}`}
                                            className={`w-9 h-9 bg-white/5 rounded-full flex items-center justify-center 
                                            transition-colors text-stone-300 hover:text-${themeSett.primary_button_text}
                                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`} target='_blank' >
                                            <BsWhatsapp size={20} />
                                        </Link>
                                    }
                                </div>
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

export default ResetPasswordFormVar6