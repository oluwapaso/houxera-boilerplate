"use client"

import React, { useEffect, useState } from 'react'
import FloatingInput from '../FloatingInput'
import { Helpers } from '@/_lib/helper';
import FloatingTextarea from '../FloatingTextarea';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaArrowRightLong } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { togglePropertyModal } from '@/app/GlobalRedux/user/userSlice';
import { OptionsType } from '../types';
import FloatingOptions from '../FloatingOptions';
import { FiUploadCloud } from 'react-icons/fi';

const helpers = new Helpers();
const EditSavedSearch = ({ closeModal, search_info }: { closeModal: () => void, search_info: any }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [submitting, setIsSubmitting] = useState(false);
    const [searchData, setSearchData] = useState<any>({
        "email_frequency": search_info.email_frequency || "Hourly",
        "search_title": search_info.search_title || "",
        "search_uid": search_info.search_uid,
    });

    const emailFrequency: OptionsType[] = [
        { name: 'No Alert', code: 'Never' },
        { name: 'Hourly', code: 'Hourly' },
        { name: 'Daily', code: 'Daily' },
        { name: 'Weekly', code: 'Weekly' },
        { name: 'Monthly', code: 'Monthly' }
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSearchData((prev_state: any) => {
            return {
                ...prev_state,
                [e.target.name]: e.target.value
            }
        })
    }

    const updateSearch = async () => {

        toast.dismiss();
        const payload = {
            ...searchData,
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "user_uid": user.user_info?.user_uid,
        }

        try {

            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.UpdateSavedMLSSearch(payload);

            let resp_message = response.message;
            let status_code = response.status_code;

            if (status_code == 200) {

                toast.success(`Search successfully updated.`, {
                    position: "top-center",
                    theme: "colored",
                });

                const search_title_elem = document.getElementById(`search_title_${search_info.search_uid}`) as HTMLDivElement;
                if (search_title_elem) {
                    search_title_elem.innerHTML = searchData.search_title;
                }

                const email_frequency_elem = document.getElementById(`email_frequency_${search_info.search_uid}`) as HTMLDivElement;
                if (email_frequency_elem) {
                    email_frequency_elem.innerHTML = searchData.email_frequency;
                }

                closeModal();

            } else {

                var msg_out = resp_message;
                if (resp_message == "Missing required field (user_uid)") {
                    msg_out = "You need to login to save a search"
                }

                toast.error(`${msg_out}`, {
                    position: "top-center",
                    theme: "colored",
                });
            }


            dispatch(hidePageLoader());

        } catch (error) {
            toast.error(`${error}`, {
                position: "top-center",
                theme: "colored",
            });
            dispatch(hidePageLoader());
        } finally {
            dispatch(hidePageLoader());
            setIsSubmitting(false);
        }

    }

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {

        return (
            <div className='w-full grid py-1 px-1 grid-cols-1 sm:grid-cols-1 gap-4'>

                <div className=''>
                    <FloatingInput name='search_title' label='Search Title' placeholder='Search Title'
                        handleChange={(e) => handleInputChange(e)} value={searchData?.search_title} required />
                </div>

                <div className=''>
                    <FloatingOptions options={emailFrequency} name='email_frequency' label='Alert Frequency'
                        handleSelectChange={(e) => handleInputChange(e)} value={searchData.email_frequency || "Hourly"} required />
                </div>

                <div className='col-span-full flex justify-end mt-2'>
                    {!submitting ?
                        <button className={`w-fit cursor-pointer bg-${themeSett.primary_color} text-${themeSett.primary_button_text} 
                        flex items-center justify-center py-3 px-6 rounded space-x-2 font-medium hover:shadow-2xl 
                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                            onClick={updateSearch}> <span>Update Search</span> <FiUploadCloud size={16} /> </button> :
                        <div className={`w-fit border-2 border-${themeSett.primary_color} text-${themeSett.primary_color} 
                        text-center py-4 px-8 rounded flex items-center justify-center cursor-not-allowed font-medium`}>
                            <span>Updating... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                className='animate-spin ml-2' />
                        </div>
                    }
                </div>

            </div>
        )

    }
}

export default EditSavedSearch