
'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiEnvelope, BiPhoneOutgoing, BiRefresh, BiTrash, BiUserPlus } from 'react-icons/bi';
import { BsDot, BsGear } from 'react-icons/bs';

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
import useRequiredFields from '@/_hooks/useReqiredFields';
import CustomLink from '@/components/CustomLink'
import CustomLinkMain from '@/components/CustomLink';
import Image from 'next/image';
import Link from 'next/link';

const helpers = new Helpers();
const RegisterAccountFormVar3 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const brker_info = useSelector((state: RootState) => state.broker);

    const reg_params = {
        firstname: "",
        lastname: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: ""
    }

    const [RegParams, setRegParams] = useState(reg_params);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegParams((prev_state) => {
            return {
                ...prev_state,
                [e.target.name]: e.target.value
            }
        })
    }


    const handleBlur = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value;
        const isCurrency = e.target.dataset.isCurrency === 'true';
        const isNumber = e.target.dataset.isNumber === 'true';
        const isPhone = e.target.dataset.isPhone === 'true';
        const maxLen = parseInt(e.target.dataset.maxLen as string);
        // const minNumber = parseInt(e.target.dataset.min as string); 

        setRegParams((prev_val: any) => {
            const prevVal = { ...prev_val }

            let newValue = value;
            if (isNumber) {
                newValue = helpers.formatWholeNumber(value); ///minNumber.toString() 
            } else if (isPhone && value != "") {
                newValue = helpers.format_Nigeria_PhoneNumber(value);
            }

            if (maxLen && maxLen > 0) {
                newValue = newValue.substring(0, maxLen);
            }

            return {
                ...prevVal,
                [e.target.name]: newValue,
            }
        })
    }

    const handleRegister = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        if (window.MLS_Util) {

            const { validateFields, errorFields } = useRequiredFields();
            window.MLS_Util.Init(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ACCOUNT_ID, process.env.NEXT_PUBLIC_MLS_NUMBER, process.env.NEXT_PUBLIC_PROPERTY_DETAILS_EP);

            toast.dismiss();
            if (!helpers.validateEmail(RegParams.email)) {
                errorFields(["email"]);
                toast.error("Provide a valid email address", {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            let error_msg: string = ""
            if (RegParams.password.length < 5) {
                error_msg = "Password can't be less that 5 characters"
                errorFields(["password"]);
            } else if (RegParams.password != RegParams.confirm_password) {
                error_msg = "Password must match"
                errorFields(["password", "confirm_password"]);
            }

            if (error_msg != "") {
                toast.error(error_msg, {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            var fields = ['firstname', 'lastname', 'phone_number'];
            const isValid = validateFields(fields);

            if (!isValid) {
                toast.error("Required field can't be empty", {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }

            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "firstname": RegParams.firstname,
                "lastname": RegParams.lastname,
                "email": RegParams.email,
                "phone_number": RegParams.phone_number,
                "password": RegParams.password,
                "confirm_password": RegParams.confirm_password,
            }

            try {

                setIsSubmitting(true);
                const response = await window.MLS_Util.RegisterUser(payload);

                let resp_message = response.message;
                let status_code = response.status_code;
                if (status_code == 200) {

                    toast.success("Account registered successfully, you can now login with your credentials.", {
                        position: "top-center",
                        theme: "colored"
                    });

                    dispatch(updateUserInfo({} as UserInfo));
                    dispatch(updateUserWholeState({ isLogged: false }));
                    setRegParams(reg_params);

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
                    "category": "register",
                    "type": "section",
                    "component": "RegisterAccountFormVar3",
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
                component_type: "Register"
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
                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4
                                    bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)}`}>
                                        <BiUserPlus className={`w-7 h-7 text-${themeSett.primary_color}`} />
                                    </div>
                                    <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">{raw_data.header || "Create a New Account"}</h1>
                                    <p className="text-slate-400">{raw_data.sub_header || "Provide your info to register a new account."}</p>
                                </div>

                                {/* Form */}
                                <div className="space-y-4 w-full flex flex-col">

                                    <div className="w-full grid grid-cols-1 xs:grid-cols-2 max-xs:space-y-4 xs:gap-4">
                                        <div className=''>
                                            <FloatingInput name='firstname' label='Firstname' placeholder='Firstname'
                                                handleChange={(e) => handleChange(e)} value={RegParams.firstname} required />
                                        </div>

                                        <div className=''>
                                            <FloatingInput name='lastname' label='Lastname' placeholder='Lastname'
                                                handleChange={(e) => handleChange(e)} value={RegParams.lastname} required />
                                        </div>
                                    </div>

                                    <div className='w-full'>
                                        <FloatingInput name='email' label='Email Adddress' placeholder='Email Adddress'
                                            handleChange={(e) => handleChange(e)} value={RegParams.email} required />
                                    </div>

                                    <div className='w-full'>
                                        <FloatingInput name='phone_number' label='Phone Number' placeholder='Phone Number'
                                            handleChange={(e) => handleChange(e)} value={RegParams.phone_number}
                                            handleBlur={(e) => handleBlur(e)} required data-is-phone />
                                    </div>

                                    <div className='w-full'>
                                        <FloatingInput name='password' label='Password' placeholder='Password' type="password"
                                            handleChange={(e) => handleChange(e)} value={RegParams.password} required />
                                    </div>

                                    <div className='w-full'>
                                        <FloatingInput name='confirm_password' label='Confirm Password' type="password" required
                                            placeholder='Confirm Password' handleChange={(e) => handleChange(e)}
                                            value={RegParams.confirm_password} />
                                    </div>


                                    <div className='w-full mt-2'>
                                        {!isSubmitting ?
                                            <button className={`w-full cursor-pointer bg-${themeSett.primary_color} 
                                            text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-4 rounded space-x-1.5 
                                            font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                                                onClick={handleRegister}> <span>{raw_data.button_text || "Register"}</span> <BiLogIn size={16} /> </button> :
                                            <div className={`w-full border-2 border-${themeSett.primary_color} 
                                            text-${themeSett.primary_color} text-center py-4 px-4 rounded flex items-center 
                                            justify-center cursor-not-allowed font-medium`}>
                                                <span>Registering Account... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                                    className='animate-spin ml-2' />
                                            </div>
                                        }
                                    </div>
                                </div>

                                {/* Footer */}
                                <p className="text-center text-slate-400 text-sm mt-8">
                                    Already have an account? <CustomLink href={`${themeSett.channel_website}/login`}
                                        className='text-sky-700'>Click here to login</CustomLink>
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

export default RegisterAccountFormVar3