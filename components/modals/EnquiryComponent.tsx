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

const helpers = new Helpers();
const EnquiryComponent = ({ is_theme = false }: { is_theme: boolean }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [enquiryInfo, setEnqInfo] = useState<any>({
        "message": `I would like to make an enquiry about this property with MLS #${prop_modal?.property_info?.mls_number}.`
    });
    const [submitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEnqInfo((prev_state: any) => {
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

        setEnqInfo((prev_val: any) => {
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

    const handleEnquiry = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        const email = enquiryInfo.email;

        // if (!user.user_info?.user_uid || user.user_info?.user_uid == "") {
        //     toast.error("You need to login to make an enquiry about a property.", {
        //         position: "top-center",
        //         theme: "colored",
        //     });
        //     return false;
        // }

        if (!helpers.validateEmail(email)) {
            toast.error("Provide a valid email address", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        if (!enquiryInfo.firstname || !enquiryInfo.lastname || !enquiryInfo.phone || !enquiryInfo.message) {
            toast.error("All fields are required.", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        try {

            var payload = {
                "firstname": enquiryInfo.firstname,
                "lastname": enquiryInfo.lastname,
                "email": enquiryInfo.email,
                "phone": helpers.format_Nigeria_PhoneNumber(enquiryInfo.phone),
                "message": enquiryInfo.message,
                "user_uid": user.user_info?.user_uid,
                "property_uid": prop_modal?.property_info?.property_uid,
            };

            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.SendPropertyInquiryMessage(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                toast.success(`Inquiry succesfully sent, we'll get back to you as soon as possible.`, {
                    position: "top-center",
                    theme: "colored",
                });

                setEnqInfo({
                    "message": `I would like to make an enquiry about this property with MLS #${prop_modal?.property_info?.mls_number}.`
                });
                dispatch(togglePropertyModal({ shown: false, page: "", title: "", property_info: {} }));

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
            dispatch(hidePageLoader());
            setIsSubmitting(false);
        }

    }

    useEffect(() => {
        if (user.user_info?.user_uid) {
            setEnqInfo((prev_state: any) => {
                return {
                    ...prev_state,
                    "firstname": user.user_info?.firstname,
                    "lastname": user.user_info?.lastname,
                    "email": user.user_info?.email,
                    "phone": helpers.format_Nigeria_PhoneNumber(user.user_info?.phone_1) ||
                        helpers.format_Nigeria_PhoneNumber(user.user_info?.phone_2)
                }
            })
        }
    }, [user.user_info?.user_uid]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <div className='w-full grid py-5 px-5 grid-cols-2 sm:grid-cols-2 gap-4'>

                <div className='col-span-full xs:col-span-1'>
                    <FloatingInput name='firstname' label='First Name' placeholder='First Name'
                        handleChange={(e) => handleInputChange(e)} value={enquiryInfo.firstname}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-full xs:col-span-1'>
                    <FloatingInput name='lastname' label='Last Name' placeholder='Last Name'
                        handleChange={(e) => handleInputChange(e)} value={enquiryInfo.lastname}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-full xs:col-span-1'>
                    <FloatingInput name='email' label='Email Address' placeholder='Email Address'
                        handleChange={(e) => handleInputChange(e)} value={enquiryInfo.email}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-full xs:col-span-1'>
                    <FloatingInput name='phone' label='Phone Number' placeholder='Phone Number'
                        handleChange={(e) => handleInputChange(e)} value={enquiryInfo.phone}
                        handleBlur={(e) => handleInputBlur(e)} required data-is-phone />
                </div>

                <div className='col-span-full'>
                    <FloatingTextarea height='240px' name='message' label='Message' placeholder='Message'
                        handleChange={(e) => handleInputChange(e)} value={enquiryInfo.message} required />
                </div>

                <div className='col-span-full flex justify-end mt-2'>
                    {!submitting ?
                        <button className={`w-fit cursor-pointer bg-${themeSett.primary_color} 
                        text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-8 rounded space-x-2 
                        font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                            onClick={handleEnquiry}> <span>Submit Enquiry</span> <FaArrowRightLong size={16} /> </button> :
                        <div className={`w-fit border-2 border-${themeSett.primary_color}-700 text-${themeSett.primary_color}-700 
                        text-center py-4 px-8 rounded flex items-center justify-center cursor-not-allowed font-medium`}>
                            <span>Submitting... Please Wait</span> <AiOutlineLoading3Quarters size={16}
                                className='animate-spin ml-2' />
                        </div>
                    }
                </div>

            </div>
        )
    }
}

export default EnquiryComponent