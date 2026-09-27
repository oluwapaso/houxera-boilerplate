"use client"

import React, { useEffect, useState } from 'react'
import FloatingInput from '../FloatingInput'
import { Helpers } from '@/_lib/helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { BiSave } from 'react-icons/bi';
import FloatingOptions from '../FloatingOptions';
import { OptionsType } from '../types';

const helpers = new Helpers();
const SaveSearchComponent = ({ closeModal, formData, setFormData, is_theme = false }:
    { closeModal: () => void, formData: any, setFormData: React.Dispatch<any>, is_theme: boolean }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [submitting, setIsSubmitting] = useState(false);
    const [searchData, setSearchData] = useState<any>({
        "email_frequency": "Hourly",
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

    const buildQueryLink = (payload: any) => {

        var query_link = ""
        if (payload.location && payload.location != "undefined") {
            query_link += `location=${payload.location}&`;
        }

        if (payload.state && payload.state != "undefined") {
            query_link += `state=${payload.state}&`;
        }

        if (payload.min_price) {
            query_link += `min_price=${payload.min_price || ""}&`;
        }

        if (payload.max_price) {
            query_link += `max_price=${payload?.max_price || ""}&`;
        }

        if (payload.baths) {
            query_link += `baths=${payload.baths}&`;
        }

        if (payload.beds) {
            query_link += `beds=${payload.beds}&`;
        }

        if (payload.property_type) {
            query_link += `property_type=${payload.property_type}&`;
        }

        if (payload.property_sub_type) {
            query_link += `property_sub_type=${payload.property_sub_type}&`;
        }

        if (payload.sales_type) {
            query_link += `sales_type=${payload.sales_type}&`;
        }

        if (payload.min_lot_size) {
            query_link += `min_lot_size=${payload.min_lot_size || ""}&`;
        }

        if (payload.max_lot_size) {
            query_link += `max_lot_size=${payload?.max_lot_size || ""}&`;
        }

        if (payload.min_living_area) {
            query_link += `min_living_area=${payload.min_living_area || ""}&`;
        }

        if (payload.max_living_area) {
            query_link += `max_living_area=${payload?.max_living_area || ""}&`;
        }

        if (payload.must_have) {
            query_link += `must_have=${payload?.must_have}&`;
        }

        query_link += `sort_by=${payload?.sort_by || "Price"}&`;
        query_link += `sort_dir=${payload?.sort_dir || "DESC"}`;

        query_link = helpers.rTrim(query_link, "&");
        return query_link;
    }

    const saveSearch = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        const query_link = buildQueryLink({ ...formData, ...searchData })
        const payload = {
            ...formData,
            ...searchData,
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "user_uid": user.user_info?.user_uid,
            "query_link": query_link,
        }

        try {
            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.SaveMLSSearch(payload);

            let resp_message = response.message;
            let status_code = response.status_code;

            if (status_code == 200) {

                toast.success(`Search successfully saved.`, {
                    position: "top-center",
                    theme: "colored",
                });

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



    if (themeSett) {
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
                        <button className={`w-fit cursor-pointer justify-center py-3 px-6 bg-${themeSett.primary_color} 
                        text-${themeSett.primary_button_text} flex items-center rounded space-x-2 font-medium hover:shadow-2xl 
                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                            onClick={saveSearch}> <span>Save Search</span> <BiSave size={16} /> </button> :
                        <div className={`w-fit border-2 border-${themeSett.primary_color}-700 text-${themeSett.primary_color}-700 
                        text-center py-4 px-8 rounded flex items-center justify-center cursor-not-allowed font-medium`}>
                            <span>Saving... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                className='animate-spin ml-2' />
                        </div>
                    }
                </div>

            </div>
        )
    }
}

export default SaveSearchComponent