'use client';

import React, { useEffect, useState } from 'react'
import { BiEnvelopeOpen, BiLock, BiLogIn, BiRefresh, BiStar, BiTrash } from 'react-icons/bi';

import { useDispatch, useSelector } from 'react-redux'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice';
import { BsGear } from 'react-icons/bs';

import CustomLink from '@/components/CustomLink'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/app/GlobalRedux/store'
import { updateDataCounts, updateFavorites, updateTours, updateUserInfo, updateUserWholeState } from '@/app/GlobalRedux/user/userSlice'
import FloatingInput from '@/components/FloatingInput'
import { Helpers } from '@/_lib/helper';
import FloatingPasswordInput from '../FloatingPasswordInput';

const helpers = new Helpers();
const LoginFormVar6 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
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
        if (window.MLS_Util) {

            toast.dismiss();
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
                    "component": "LoginFormVar6",
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
                <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br 
                    from-${themeSett.primary_color} to-${helpers.adjustColorShade(themeSett.primary_color, 2)} 
                    px-6 py-35 overflow-hidden relative`}>
                    {/* Floating decorative cards */}
                    <div className={`absolute top-10 right-20 w-32 h-32 bg-${helpers.adjustColorShade(themeSett.primary_color, 2)} 
                    rounded-3xl transform rotate-45 animate-pulse`}></div>

                    <div className={`absolute bottom-20 left-10 w-40 h-40 bg-${helpers.adjustColorShade(themeSett.primary_color, 2)} 
                    rounded-3xl transform -rotate-12 animate-pulse`} style={{ animationDelay: '1s' }}></div>

                    <div className={`absolute bottom-20 left-[50%] top-[50%] w-[600px] h-[600px]
                    -translate-x-[300px] -translate-y-[300px] bg-${helpers.adjustColorShade(themeSett.primary_color, 2)} 
                    rounded-3xl transform -rotate-12 animate-pulse`} style={{ animationDelay: '1.5s' }}></div>

                    <div className="w-full max-w-md relative z-10">
                        {/* Main Card */}
                        <div className={`bg-gradient-to-br rounded-2xl p-8 shadow-2xl from-${themeSett.secondary_color} 
                        to-${helpers.adjustColorShade(themeSett.secondary_color, 2)} 
                        border border-${helpers.adjustColorShade(themeSett.secondary_color, 1)} `}>

                            {/* Header */}
                            <div className="mb-8">
                                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br rounded-xl mb-4 shadow-lg
                                    from-${helpers.adjustColorShade(themeSett.primary_color, 1)} 
                                    to-${helpers.adjustColorShade(themeSett.primary_color, 3)} `}>
                                    <BiLock className={`text-${themeSett.primary_button_text} w-7 h-7`} />
                                </div>
                                <h1 className={`text-${themeSett.secondary_button_text} text-3xl font-bold mb-2`}>{raw_data.header || "Welcome Back"}</h1>
                                <p className={`text-${themeSett.secondary_button_text}`}>{raw_data.sub_header || "Sign in with your credentials"}</p>
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
                                    <label className="flex items-center cursor-pointer" htmlFor='remember_me'>
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300" id='remember_me' />
                                        <span className={`text-${themeSett.secondary_button_text} ml-2 text-sm`}> Keep me signed in</span>
                                    </label>
                                    <CustomLink href={`${themeSett.channel_website}/forgot-password`}
                                        className={`text-${themeSett.secondary_button_text} text-sm`}>Forgot password?</CustomLink>
                                </div>

                                <div className='w-full mt-2'>
                                    {!user.isLogginIn ?
                                        <button className={`w-full cursor-pointer bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} 
                                            text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-4 rounded space-x-1.5 
                                            font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                                            onClick={handleLogin}> <span>{raw_data.button_text || "Sign In"}</span> <BiLogIn size={16} /> </button> :
                                        <div className={`w-full border-2 border-${helpers.adjustColorShade(themeSett.primary_color, 1)}
                                            text-${themeSett.primary_color} text-center py-4 px-4 rounded flex items-center 
                                            justify-center cursor-not-allowed font-medium`}>
                                            <span>Signing In... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                                className='animate-spin ml-2' />
                                        </div>
                                    }
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-slate-700"></div>
                                <span className="text-slate-500 text-xs uppercase">Or</span>
                                <div className="flex-1 h-px bg-slate-700"></div>
                            </div>

                            {/* Footer */}
                            <p className={`text-${themeSett.secondary_button_text} text-center text-sm mt-6`}>
                                Don't have an account
                                yet? <CustomLink href={`${themeSett.channel_website}/register`}
                                    className='font-semibold'>Click here to sign up</CustomLink>
                            </p>
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

export default LoginFormVar6
