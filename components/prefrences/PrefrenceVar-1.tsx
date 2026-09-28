"use client"

import { Helpers } from '@/_lib/helper';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import { updateUserInfo, updateUserWholeState } from '@/app/GlobalRedux/user/userSlice';
import FloatingInput from '@/components/FloatingInput';
import { UserInfo } from '@/components/types';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { BsArrowLeftShort, BsGear } from 'react-icons/bs';
import { FaCloudArrowUp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const helpers = new Helpers();
const PrefrenceVar1 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [userInfo, setUserInfo] = useState<any>({} as UserInfo);
    const [userLoaded, setUserLoaded] = useState<boolean>(false);
    const [userError, setUserError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reseting, setIsReseting] = useState(false);
    const [sub_to_updates, setSubToUpdates] = useState(false);
    const [sub_to_mailing_lists, setSubToMailingLists] = useState(false);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [first_comp_pt, setFirstCompPt] = useState("pt-35");

    const handleSettingsClick = () => {
        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "prefrences",
                    "type": "section",
                    "component": "PrefrenceVar1",
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
                component_type: "Prefrence Form"
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prev_state: any) => {
            return {
                ...prev_state,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value;
        const isCurrency = e.target.dataset.isCurrency === 'true';
        const isNumber = e.target.dataset.isNumber === 'true';
        const isPhone = e.target.dataset.isPhone === 'true';
        const maxLen = parseInt(e.target.dataset.maxLen as string);
        // const minNumber = parseInt(e.target.dataset.min as string); 

        setUserInfo((prev_val: any) => {
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

    const LoadUSerInfo = async () => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "user_uid": user.user_info?.user_uid,
            "fields": "*",
        }

        const response = await window.MLS_Util.LoadUserInfo(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setUserInfo(response.data.user_info);
            setSubToUpdates(response.data.user_info.sub_to_updates == "Yes" ? true : false);
            setSubToMailingLists(response.data.user_info.sub_to_mailing_lists == "Yes" ? true : false);
        } else {
            setUserError(resp_message);
        }

        setUserLoaded(true);

    }

    const handleUpdateInfo = async () => {

        toast.dismiss()
        var receive_updates = "No"
        var join_mailing_lists = "No"

        if (sub_to_updates) {
            receive_updates = "Yes"
        }

        if (sub_to_mailing_lists) {
            join_mailing_lists = "Yes"
        }

        try {
            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "user_uid": user.user_info?.user_uid,
                ...userInfo,
                "sub_to_updates": receive_updates,
                "sub_to_mailing_lists": join_mailing_lists,
                "birthday": moment(userInfo.birthday).format("YYYY-MM-DD")
            }

            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.UpdateUserInfo(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                toast.success(`Account info successfully updated`, {
                    position: "top-center",
                    theme: "colored",
                });

                dispatch(updateUserInfo(userInfo));

            } else {
                toast.error(`${resp_message}`, {
                    position: "top-center",
                    theme: "colored",
                });
            }

        } catch (error) {
            toast.error(`${error}`, {
                position: "top-center",
                theme: "colored",
            });
        } finally {
            setIsSubmitting(false);
            dispatch(hidePageLoader());
        }

    }

    const resetPassword = async () => {

        toast.dismiss()
        try {
            const payload = {
                "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                "email": user.user_info?.email,
            }

            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.StartPasswordReset(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                toast.success(`Password reset link successfully sent to your email address`, {
                    position: "top-center",
                    theme: "colored",
                });

                dispatch(updateUserWholeState({ isLogged: false, user_info: {} }));
                router.push(`${themeSett.theme_prefix}/home`);
                dispatch(showPageLoader());

            } else {
                dispatch(hidePageLoader());
                toast.error(`${resp_message}`, {
                    position: "top-center",
                    theme: "colored",
                });
            }

        } catch (error) {
            dispatch(hidePageLoader());
            toast.error(`${error}`, {
                position: "top-center",
                theme: "colored",
            });
        } finally {
            setIsSubmitting(false);
        }

    }

    const deleteAccount = async () => {
        const result = await Swal.fire({
            title: "This action will be permanent and data cannot be recovered after deletion.",
            text: "Are you sure you want to proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Proceed',
        });

        if (result.isConfirmed) {

            toast.dismiss()
            try {
                const payload = {
                    "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
                    "user_uid": user.user_info?.user_uid,
                    "email": user.user_info?.email,
                }

                setIsSubmitting(true);
                dispatch(showPageLoader());
                const response = await window.MLS_Util.DeleteUserAccount(payload);

                let resp_message = response.message;
                let status_code = response.status_code;
                if (status_code == 200) {

                    toast.success(`Account successfully deleted`, {
                        position: "top-center",
                        theme: "colored",
                    });

                    dispatch(updateUserWholeState({ isLogged: false, user_info: {} }));
                    router.push(`${themeSett.theme_prefix}/home`);
                    dispatch(showPageLoader());

                } else {
                    dispatch(hidePageLoader());
                    toast.error(`${resp_message}`, {
                        position: "top-center",
                        theme: "colored",
                    });
                }

            } catch (error) {
                dispatch(hidePageLoader());
                toast.error(`${error}`, {
                    position: "top-center",
                    theme: "colored",
                });
            } finally {
                setIsSubmitting(false);
            }

        } else {
            // Handle cancel action
            console.log('Canceled');
        }

    }

    useEffect(() => {

        dispatch(hidePageLoader());

        if (window.MLS_Util) {
            // window.MLS_Util.Init(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ACCOUNT_ID);
            LoadUSerInfo();
        }

    }, [window.MLS_Util]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-36");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("NavVar7");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-40" : "pt-55");
            };

            updatePadding(); // initial

            // Watch for changes (forceMobile can change on resize)
            const observer = new MutationObserver(updatePadding);
            const nav = document.getElementById("NavVar7");
            if (nav) {
                observer.observe(nav, {
                    attributes: true,
                    attributeFilter: ["data-is-mobile"],
                });
            }

            return () => observer.disconnect();
        }

    }, [themeSett?.nav_component?.type, raw_data?.component_index]);

    if (!themeSett) {
        return (<div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
        </div>)
    }

    if (themeSett) {
        return (
            <section className={`flex flex-col min-h-screen bg-gray-100 ${first_comp_pt} pb-15 relative`}>

                <div className='container mx-auto flex items-center justify-center max-w-[750px]'>
                    <div className=' flex flex-col w-full px-4 xs:px-6'>
                        <div className='w-full font-semibold text-xl xs:text-2xl'>{raw_data.header || "Personal Details"}</div>
                        <p className="text-gray-600 mb-2 text-sm">{raw_data.sub_header || "Manage your personal information"}</p>
                        <div className='w-full bg-white drop-shadow-2xl rounded py-8 px-4 2xs:px-6'>
                            <div className='w-full flex flex-col'>

                                <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4'>

                                    <div className='col-span-1 sm:col-span-1'>
                                        <FloatingInput name='firstname' label='First Name' placeholder='First Name'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.firstname}
                                            handleBlur={(e) => handleInputBlur(e)} required />
                                    </div>

                                    <div className='col-span-1 sm:col-span-1'>
                                        <FloatingInput name='lastname' label='Last Name' placeholder='Last Name'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.lastname}
                                            handleBlur={(e) => handleInputBlur(e)} required />
                                    </div>

                                    <div className='col-span-1 sm:col-span-2'>
                                        <FloatingInput name='email' label='Primary Email' placeholder='Primary Email'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.email}
                                            handleBlur={(e) => handleInputBlur(e)} required />
                                    </div>

                                    <div className='col-span-1 sm:col-span-2'>
                                        <FloatingInput name='secondary_email' label='Secondary Email' placeholder='Secondary Email'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.secondary_email}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='phone_1' label='Phone 1' placeholder='Phone 1'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.phone_1}
                                            handleBlur={(e) => handleInputBlur(e)} required data-is-phone />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='phone_2' label='Phone 2' placeholder='Phone 2'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.phone_2}
                                            handleBlur={(e) => handleInputBlur(e)} data-is-phone />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='work_phone' label='Work Phone' placeholder='Work Phone'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.work_phone}
                                            handleBlur={(e) => handleInputBlur(e)} data-is-phone />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='birthday' label='Birthday' placeholder='Birthday'
                                            handleChange={(e) => handleInputChange(e)} value={moment(userInfo.birthday).format("DD-MM-YYYY")}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1 sm:col-span-2'>
                                        <FloatingInput name='street_address' label='Street Address' placeholder='Street Address'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.street_address}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='city' label='City' placeholder='City'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.city}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='state' label='State' placeholder='State'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.state}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='facebook' label='Facebook' placeholder='Facebook'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.facebook}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='linkedin' label='Linkedin' placeholder='Linkedin'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.linkedin}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='twitter' label='X(Twitter)' placeholder='X(Twitter)'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.twitter}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='tiktok' label='TikTok' placeholder='TikTok'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.tiktok}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='whatsapp' label='Whatsapp' placeholder='Whatsapp'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.whatsapp}
                                            handleBlur={(e) => handleInputBlur(e)} data-is-phone />
                                    </div>

                                    <div className='col-span-1'>
                                        <FloatingInput name='profession' label='Profession' placeholder='Profession'
                                            handleChange={(e) => handleInputChange(e)} value={userInfo.profession}
                                            handleBlur={(e) => handleInputBlur(e)} />
                                    </div>
                                </div>

                                <div className='w-full flex flex-col mt-10'>

                                    <h1 className='w-full font-play-fair-display text-xl xs:text-2xl'>Subscription Information</h1>
                                    <div className='w-full mt-2'>

                                        <div className='w-full mt-2 mb-2 flex items-center select-none -ml-[10px]'>
                                            <input type='checkbox' className='styled-checkbox menu_cb' name={`sub_to_updates`} id={`sub_to_updates`}
                                                onChange={(e) => setSubToUpdates(e.target.checked)} checked={sub_to_updates} />
                                            <label htmlFor='sub_to_updates' className='flex w-full'>
                                                <span>Yes, I would like to receive listing updates matching my saved search criteria.</span>
                                            </label>
                                        </div>

                                        <div className='w-full mt-2 mb-2 flex items-center select-none -ml-[10px]'>
                                            <input type='checkbox' className='styled-checkbox menu_cb' name={`sub_to_mailing_lists`} id={`sub_to_mailing_lists`}
                                                onChange={(e) => setSubToMailingLists(e.target.checked)} checked={sub_to_mailing_lists} />
                                            <label htmlFor='sub_to_mailing_lists' className='flex w-full'>
                                                <div className=' flex flex-col'>
                                                    <span>I consent to receiving emails containing real estate related information from this site.</span>
                                                    <span>I understand that I can unsubscribe at any time.</span>
                                                </div>
                                            </label>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='w-full border-b border-gray-200 dark:border-gray-600 my-10'></div>

                        <div className={` w-full flex justify-end`}>
                            <div className={`bg-${themeSett.secondary_color} text-white flex items-center justify-center py-3 
                                px-4 2xs:px-6 font-medium mr-2 hover:bg-${helpers.adjustColorShade(themeSett.secondary_color, 1)} 
                                hover:drop-shadow-xl rounded cursor-pointer`}
                                onClick={() => { dispatch(showPageLoader()); router.back(); }}>
                                <BsArrowLeftShort className='mr-1 !text-2xl' /> <span>Back</span> </div>

                            {!isSubmitting ?
                                <div className={`bg-${themeSett.primary_color} text-${themeSett.primary_button_text} py-3 px-6 text-white float-right 
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} hover:drop-shadow-md 
                                    rounded cursor-pointer flex items-center`} onClick={handleUpdateInfo}>
                                    <FaCloudArrowUp size={20} className='mr-2' /> <span>{raw_data.button_text || "Update Info"}</span>
                                </div>
                                : <div className={`border-2 border-${themeSett.primary_color} 
                                        text-${themeSett.primary_button_text} text-center py-4 px-4 rounded flex items-center 
                                        justify-center cursor-not-allowed font-medium`}>
                                    <span>Updating... Please Wait</span>
                                    <AiOutlineLoading3Quarters size={16} className='animate-spin ml-2' />
                                </div>
                            }
                        </div>


                        <div className='spacer mt-16'></div>
                        <div className='w-full font-semibold text-xl xs:text-2xl mb-2'>Advanced Settings</div>
                        <div className='w-full bg-white drop-shadow-2xl rounded py-8 px-4 2xs:px-6'>
                            <div className='w-full flex flex-col'>

                                <h1 className='w-full font-play-fair-display text-xl xs:text-2xl'>Reset Password</h1>
                                <div className='w-full'>
                                    <p className='mt-2 w-full'>
                                        If you would still like to send a request to have your account deleted you
                                        can click the "Delete My Account" button below.
                                    </p>
                                    <div className='w-full mt-4'>
                                        {!reseting
                                            ? <div className={`w-[200px] flex justify-center items-center py-3 px-4 bg-${themeSett.secondary_color} 
                                                text-${themeSett.secondary_button_text}  cursor-pointer hover:shadow-xl uppercase text-sm rounded`}
                                                onClick={resetPassword}>Reset Password</div>
                                            : <div className='w-[200px] flex justify-center items-center py-3 px-4 bg-red-400 
                                                    text-white cursor-not-allowed uppercase text-sm'>
                                                <AiOutlineLoading3Quarters size={17} className='mr-2' /> <span>Please wait...</span>
                                            </div>
                                        }

                                    </div>

                                </div>

                                <h1 className='w-full font-play-fair-display text-xl xs:text-2xl mt-10'>Delete Account</h1>
                                <div className='w-full mt-2 font-normal'>
                                    <p className='w-full'>If you do not want to use this website anymore and you would like your account to be deleted, we're here to help.
                                        Please note: You will not be able to reactivate your account to access any data added to your account including
                                        saved searches, listings and messages.
                                    </p>
                                    <p className='mt-4 w-full'>If you would still like to send a request to have your account deleted you can click the "Delete My Account"
                                        button below.
                                    </p>

                                    <div className='w-full mt-4'>
                                        {!isDeleting
                                            ? <div className='w-[200px] flex justify-center items-center py-3 px-4 bg-red-600 text-white 
                                                    cursor-pointer hover:shadow-xl uppercase text-sm rounded' onClick={deleteAccount}>Delete My Account</div>
                                            : <div className='w-[200px] flex justify-center items-center py-3 px-4 bg-red-400 text-white 
                                                    cursor-not-allowed uppercase text-sm' onClick={deleteAccount}>
                                                <AiOutlineLoading3Quarters size={17} className='mr-2' /> <span>Please wait...</span>
                                            </div>
                                        }

                                    </div>
                                </div>

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
                                Change Layout
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
        )
    }
}

export default PrefrenceVar1
