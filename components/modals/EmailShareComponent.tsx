"use client"

import React, { useEffect, useRef, useState } from 'react'
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
import { TagsInput } from 'react-tag-input-component';

const helpers = new Helpers();
const EmailShareComponent = ({ is_theme = false }: { is_theme: boolean }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [shareInfo, setShareInfo] = useState<any>({
        "start_time": "10:00 AM",
        "end_time": "11:00 AM",
        "message": `I would like to schedule a share for this property with MLS #${prop_modal?.property_info?.mls_number}.`
    });
    const [submitting, setIsSubmitting] = useState(false);
    const [rcpntAddr, setRcpntAddr] = useState<any[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setShareInfo((prev_state: any) => {
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

        setShareInfo((prev_val: any) => {
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

    const handleIBlur = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            const validAddr: any[] = [];
            let err = false;
            for (let ccEml of rcpntAddr) {
                ccEml = ccEml.trim();
                if (ccEml && ccEml !== "") {
                    if (!helpers.validateEmail(ccEml)) {
                        err = true;
                    } else {
                        validAddr.push(ccEml);
                    }
                }
            }

            setRcpntAddr(validAddr);
            if (err) {
                toast.error("Provide a valid email address.", {
                    position: "top-center",
                    theme: "colored"
                });
                return false;
            }
        }
    }

    const handleShare = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        const email = shareInfo.sender_email;

        if (!helpers.validateEmail(email)) {
            toast.error("Provide a valid email address", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        if (!shareInfo.firstname || !shareInfo.lastname || !shareInfo.message) {
            toast.error("All fields are required.", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        try {

            var payload = {
                "firstname": shareInfo.firstname,
                "lastname": shareInfo.lastname,
                "sender_email": shareInfo.sender_email,
                "message": shareInfo.message,
                "user_uid": user.user_info?.user_uid,
                "property_uid": prop_modal?.property_info?.property_uid,
                "recipient_addresses": rcpntAddr.join(","), /** email seperated with comma **/
            };

            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.ShareViaEmail(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                toast.success(`Propert succesfully shared with the recipient(s)`, {
                    position: "top-center",
                    theme: "colored",
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
            setShareInfo((prev_state: any) => {
                return {
                    ...prev_state,
                    "firstname": user.user_info?.firstname,
                    "lastname": user.user_info?.lastname,
                    "sender_email": user.user_info?.email
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

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingInput name='firstname' label='First Name' placeholder='First Name'
                        handleChange={(e) => handleInputChange(e)} value={shareInfo.firstname}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingInput name='lastname' label='Last Name' placeholder='Last Name'
                        handleChange={(e) => handleInputChange(e)} value={shareInfo.lastname}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-1 sm:col-span-2'>
                    <FloatingInput name='sender_email' label='Sender Email Address' placeholder='Sender Email Address'
                        handleChange={(e) => handleInputChange(e)} value={shareInfo.sender_email}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-1 sm:col-span-2'>
                    <label htmlFor="recipient_addresses" className='form-label'>Recipient Email Addresses</label>
                    <TagsInput value={rcpntAddr} onChange={setRcpntAddr} name="recipient_addresses" onKeyUp={(e) => handleIBlur(e)}
                        placeHolder="Enter email address and press Enter or Comma to add"
                        classNames={{ input: "!rounded-none border-0 !w-full !min-h-[50px]", tag: 'bg-red-500' }}
                        separators={["Enter", ","]} />
                    <small className='w-full text-red-600 dark:text-dark-text'>Press <strong>Enter</strong> or <strong>Comma </strong> to
                        add email address.</small>
                </div>

                <div className='col-span-full'>
                    <FloatingTextarea height='240px' name='message' label='Message' placeholder='Message'
                        handleChange={(e) => handleInputChange(e)} value={shareInfo.message} required />
                </div>

                <div className='col-span-full flex justify-end mt-2'>
                    {!submitting ?
                        <button className={`w-fit cursor-pointer bg-${themeSett.primary_color} 
                        text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-8 rounded space-x-2 
                        font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                            onClick={handleShare}> <span>Submit Request</span> <FaArrowRightLong size={16} /> </button> :
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

export default EmailShareComponent