'use client';

import React, { useEffect, useState } from 'react'
import { BiEnvelope, BiLock, BiPhoneOutgoing } from 'react-icons/bi';

import { useDispatch, useSelector } from 'react-redux'
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { BsDot, BsGear, BsTwitterX, BsWhatsapp } from 'react-icons/bs';

import CustomLink from '@/components/CustomLink'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import { updateDataCounts, updateFavorites, updateTours, updateUserInfo, updateUserWholeState } from '@/app/GlobalRedux/user/userSlice'
import FloatingInput from '@/components/FloatingInput'
import { BiLogIn } from 'react-icons/bi'
import { Helpers } from '@/_lib/helper';
import FloatingPasswordInput from '../FloatingPasswordInput';
import CustomLinkMain from '@/components/CustomLink';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaYoutube } from 'react-icons/fa6';
import { LiaLinkedin } from 'react-icons/lia';

const helpers = new Helpers();
const LoginFormVar7 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const brker_info = useSelector((state: RootState) => state.broker);
    const redirect = searchParams?.get("redirect") as string || "/home";

    const dispatch = useDispatch<AppDispatch>();
    const auth_params = {
        username: "",
        password: ""
    }

    const [AuthParams, setAuthParams] = useState(auth_params);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthParams((prev_state) => {
            return {
                ...prev_state,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleLogin = async () => {

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
                ...AuthParams,
            }

            try {

                dispatch(updateUserWholeState({ isLogginIn: true }));
                const response = await window.MLS_Util.UserLogin(payload);

                let resp_message = response.message;
                let status_code = response.status_code;
                if (status_code == 200) {

                    dispatch(updateUserInfo(response.data.user_info));
                    dispatch(updateFavorites(response.data.user_favorites || []));
                    dispatch(updateTours(response.data.user_tours || []));

                    dispatch(updateDataCounts({
                        "favorites": response.data.total_favorites,
                        "upcoming_tours": response.data.upcoming_tours
                    }));

                    dispatch(updateUserWholeState({ isLogged: true }));
                    router.push(`${themeSett.channel_website}/${redirect}`);

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
                dispatch(updateUserWholeState({ isLogginIn: false }));
            }

        }
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "login",
                    "type": "section",
                    "component": "LoginFormVar4",
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
                component_type: "Login Form"
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
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 max-lg:pt-40 max-lg:pb-20 relative">

                            <div className="absolute top-3.5 left-3.5">
                                <CustomLinkMain href={`/home`} is_theme={is_theme} className="font-medium text-2xl cursor-pointer">
                                    <Image src={`${themeSett?.dark_logo || "/Houxera-logo-black.png"}`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                                </CustomLinkMain>
                            </div>

                            <div className="w-full max-w-md">
                                {/* Header */}
                                <div className="mb-10">
                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4
                                    bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)}`}>
                                        <BiLock className={`w-7 h-7 text-${themeSett.primary_color}`} />
                                    </div>
                                    <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">{raw_data.header || "Welcome Back"}</h1>
                                    <p className="text-gray-600">{raw_data.sub_header || "Sign in with your credentials"}</p>
                                </div>

                                {/* Form */}
                                <div className="space-y-5">
                                    <div className='w-full'>
                                        <FloatingInput name='username' label='Email' placeholder='Email'
                                            handleChange={(e) => handleChange(e)} value={AuthParams.username} required />
                                    </div>

                                    <div className='w-full mt-4'>
                                        <FloatingPasswordInput type='password' name='password' label='Password' placeholder='••••••••'
                                            handleChange={(e) => handleChange(e)} value={AuthParams.password} required />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative">
                                                <input type="checkbox" className="peer sr-only" id='remember_me' />
                                                <div className={`w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-${themeSett.primary_color} transition-colors duration-300`}></div>
                                                <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5`}></div>
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                                Remember me
                                            </span>
                                        </label>
                                        <CustomLink href={`${themeSett.channel_website}/forgot-password`} is_theme={is_theme}
                                            className='text-sky-700 text-sm cursor-pointer'>Forgot password?</CustomLink>
                                    </div>

                                    <div className='w-full mt-2'>
                                        {!user.isLogginIn ?
                                            <button className={`w-full cursor-pointer bg-${themeSett.primary_color} 
                                                text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-4 rounded space-x-1.5 
                                                font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                                                onClick={handleLogin}> <span>{raw_data.button_text || "Sign In"}</span> <BiLogIn size={16} /> </button> :
                                            <div className={`w-full border-2 border-${themeSett.primary_color} 
                                                text-${themeSett.primary_color} text-center py-4 px-4 rounded flex items-center 
                                                justify-center cursor-not-allowed font-medium`}>
                                                <span>Signing In... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                                    className='animate-spin ml-2' />
                                            </div>
                                        }
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-left text-gray-600 text-sm mt-6 flex flex-col space-y-1.5">
                                    <span>Don't have an account yet?</span>
                                    <CustomLink href={`${themeSett.channel_website}/register`} is_theme={is_theme}
                                        className='text-sky-700 cursor-pointer'>Click here to sign up
                                    </CustomLink>
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
                        <div className={`hidden relative lg:flex lg:w-1/2 flex-col p-8 bg-cover bg-center `}
                            style={{ backgroundImage: `url('../houxera-stock-image-3.jpg')` }}>

                            <div className='grow flex items-center justify-center'>
                                <div className='w-full max-w-xl p-8 flex flex-col rounded-xl 
                                bg-white/10 backdrop-blur-xs text-gray-200'>
                                    <h3 className='text-3xl font-medium'>{raw_data.header_2 || "Get started"}</h3>
                                    <div className=''>
                                        {raw_data.sub_header_2 || "Join our community and unlock amazing services"}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex flex-col items-center md:items-end">
                                <div className="w-full flex items-center justify-center gap-4">
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

export default LoginFormVar7