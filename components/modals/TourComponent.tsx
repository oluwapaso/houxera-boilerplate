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
import { togglePropertyModal, updateDataCounts } from '@/app/GlobalRedux/user/userSlice';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file 
import moment from 'moment';
import { TbCalendarExclamation } from 'react-icons/tb';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import FloatingOptions from '../FloatingOptions';
import { TourTimeFilters } from '@/_lib/data';

const helpers = new Helpers();
const TourComponent = ({ is_theme = false }: { is_theme: boolean }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [tourInfo, setTourInfo] = useState<any>({
        "start_time": "10:00 AM",
        "end_time": "11:00 AM",
        "message": `I would like to schedule a tour for this property with MLS #${prop_modal?.property_info?.mls_number}.`
    });
    const [submitting, setIsSubmitting] = useState(false);
    const [tour_date, setTourDate] = useState<Date | null>(null);
    const dateBoxRef = useRef<HTMLDivElement>(null);
    const [date_picker_shown, setDatePickerShown] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setTourInfo((prev_state: any) => {
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

        setTourInfo((prev_val: any) => {
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

    const handleTour = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        const email = tourInfo.email;
        if (!helpers.validateEmail(email)) {
            toast.error("Provide a valid email address", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        if (!tourInfo.firstname || !tourInfo.lastname || !tourInfo.phone || !tourInfo.message) {
            toast.error("All fields are required.", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        try {

            var payload = {
                "firstname": tourInfo.firstname,
                "lastname": tourInfo.lastname,
                "email": tourInfo.email,
                "phone": helpers.format_Nigeria_PhoneNumber(tourInfo.phone),
                "message": tourInfo.message,
                "tour_date": tour_date,
                "start_time": tourInfo.start_time,
                "end_time": tourInfo.end_time,
                "user_uid": user.user_info?.user_uid,
                "property_uid": prop_modal?.property_info?.property_uid,
            };

            setIsSubmitting(true);
            dispatch(showPageLoader());
            const response = await window.MLS_Util.SendTourRequestMessage(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {

                toast.success(`Tour request succesfully sent, we'll get back to you as soon as possible.`, {
                    position: "top-center",
                    theme: "colored",
                });

                setTourInfo({
                    "start_time": "10:00 AM",
                    "end_time": "11:00 AM",
                    "message": `I would like to schedule a tour for this property with MLS #${prop_modal?.property_info?.mls_number}.`
                });

                dispatch(updateDataCounts({ "upcoming_tours": response.data.upcoming_tours }));
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

    const handleDelvQuickSelect = (offset: number) => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        setTourDate(date);
        setDatePickerShown(false);
    };

    useEffect(() => {
        if (user.user_info?.user_uid) {
            setTourInfo((prev_state: any) => {
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dateBoxRef.current && !dateBoxRef.current.contains(e.target as Node)) {
                setDatePickerShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dateBoxRef]);

    if (themeSett) {
        return (
            <div className='w-full grid py-5 px-5 grid-cols-2 sm:grid-cols-2 gap-4'>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingInput name='firstname' label='First Name' placeholder='First Name'
                        handleChange={(e) => handleInputChange(e)} value={tourInfo.firstname}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingInput name='lastname' label='Last Name' placeholder='Last Name'
                        handleChange={(e) => handleInputChange(e)} value={tourInfo.lastname}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingInput name='email' label='Email Address' placeholder='Email Address'
                        handleChange={(e) => handleInputChange(e)} value={tourInfo.email}
                        handleBlur={(e) => handleInputBlur(e)} required />
                </div>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingInput name='phone' label='Phone Number' placeholder='Phone Number'
                        handleChange={(e) => handleInputChange(e)} value={tourInfo.phone}
                        handleBlur={(e) => handleInputBlur(e)} required data-is-phone />
                </div>

                <div className='col-span-full'>
                    <div ref={dateBoxRef} className='relative' onClick={() => { setDatePickerShown(true); }}>
                        <FloatingInput name='tour_date' value={tour_date ? moment(tour_date).format("MM/DD/YYYY") : ""}
                            label={`Tour Date`} placeholder={`Tour Date`} handleChange={() => null} required />

                        {date_picker_shown && (
                            <div className="absolute z-[110] left-0 top-full border border-gray-300 shadow-xl 
                            bg-white flex flex-col ">
                                <Calendar
                                    className="border-b border-gray-300 -mt-0"
                                    onChange={(item: any) => {
                                        setTourDate(item);
                                        setDatePickerShown(false);
                                    }}
                                    date={tour_date as Date}
                                    minDate={new Date()}
                                />

                                <div className="flex justify-end space-x-2 px-2 py-2 *:cursor-pointer">
                                    <button
                                        className="px-3 py-1 text-sm bg-sky-600 text-white rounded shadow-md hover:bg-sky-700 
                                        flex items-center space-x-1"
                                        onClick={() => handleDelvQuickSelect(0)} >
                                        <TbCalendarExclamation size={15} /> <span>Today</span>
                                    </button>

                                    <button
                                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded shadow-md hover:bg-orange-700
                                        flex items-center space-x-1"
                                        onClick={() => setTourDate(null)}>
                                        <BsFillTrash3Fill size={15} /> <span>Clear</span>
                                    </button>

                                    <button
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded shadow-md hover:bg-red-700
                                        flex items-center space-x-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDatePickerShown(false);
                                        }}>
                                        <IoClose size={15} /> <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingOptions name='start_time' label='Start Time' options={TourTimeFilters}
                        handleSelectChange={(e) => handleInputChange(e)} value={tourInfo.start_time} required />
                </div>

                <div className='col-span-1 sm:col-span-1'>
                    <FloatingOptions name='end_time' label='End Time' options={TourTimeFilters}
                        handleSelectChange={(e) => handleInputChange(e)} value={tourInfo.end_time} required />
                </div>

                <div className='col-span-full'>
                    <FloatingTextarea height='240px' name='message' label='Message' placeholder='Message'
                        handleChange={(e) => handleInputChange(e)} value={tourInfo.message} required />
                </div>

                <div className='col-span-full flex justify-end mt-2'>
                    {!submitting ?
                        <button className={`w-fit cursor-pointer bg-${themeSett.primary_color} 
                        text-${themeSett.primary_button_text} flex items-center justify-center py-4 px-8 rounded space-x-2 
                        font-medium hover:shadow-2xl hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}
                            onClick={handleTour}> <span>Submit Request</span> <FaArrowRightLong size={16} /> </button> :
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

export default TourComponent