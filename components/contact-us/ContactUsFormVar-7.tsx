"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiBuilding, BiEnvelope, BiHome, BiLayerPlus, BiMapPin, BiMessageSquare, BiPhoneCall, BiPhoneIncoming, BiRefresh, BiSend, BiStar, BiTrash } from 'react-icons/bi'
import FloatingInput from '@/components/FloatingInput'
import FloatingTextarea from '@/components/FloatingTextarea'
import { toast } from 'react-toastify'
import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice'
import { BsArrowDown, BsArrowRight, BsArrowUp, BsArrowUpRight, BsGear } from 'react-icons/bs'
import { Button } from '../Button'
import { CgLock, CgMail } from 'react-icons/cg'
import { FaLandmark } from 'react-icons/fa6'

const helpers = new Helpers();
const ContactUsFormVar7 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch();
    const brker_info = useSelector((state: RootState) => state.broker);
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [selectedInterest, setSelectedInterest] = useState("")
    const [first_comp_pt, setFirstCompPt] = useState("pt-8 xs:pt-16");

    const init_val = {
        firstname: "",
        lastname: "",
        company_name: "",
        phone: "",
        user_uid: "",
        email: "",
        subject: "",
        message: ""
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "contact_us_form",
                    "type": "section",
                    "component": "ContactUsVarForm7",
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleMoveClick = (direction: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'MOVE_SECTION',
                direction: direction,
                component_index: raw_data?.component_index
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "Contact Form"
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

    const [formData, setFormData] = useState(init_val);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {

        const value = e.target.value;
        const isCurrency = e.target.dataset.isCurrency === 'true';
        const isNumber = e.target.dataset.isNumber === 'true';

        setFormData(prevData => {
            const prevVal = { ...prevData }

            let newValue = value;
            if (isCurrency) {
                //newValue = helpers.formatCurrency(value);
            } else if (isNumber) {
                newValue = helpers.formatNumber(value);
            }

            return {
                ...prevVal,
                [e.target.name]: newValue
            }
        })
    }

    const handleSubmitClick = async () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        const email = formData.email;

        if (!helpers.validateEmail(email)) {
            toast.error("Provide a valid email address", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        if (!formData.firstname || !formData.lastname || !formData.message || !formData.subject) {
            toast.error("Required fields can not be empty.", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        try {

            var payload = {
                "firstname": formData.firstname,
                "lastname": formData.lastname,
                "email": formData.email,
                "phone": formData.phone,
                "subject": formData.subject,
                "message": formData.message,
                "user_uid": user.user_info?.user_uid,
            };

            dispatch(showPageLoader());
            const response = await window.MLS_Util.SendContactMessage(payload);

            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {
                toast.success(`Message succesfully sent, we'll get back to you as soon as possible.`, {
                    position: "top-center",
                    theme: "colored",
                });
                setFormData(init_val);
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
        }

    }

    useEffect(() => {
        if (user.user_info?.user_uid) {
            setFormData((prev_state: any) => {
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
        dispatch(hidePageLoader());
    }, []);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-18 xs:pt-25");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("NavVar7");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-22" : "pt-32");
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


    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {

        return (
            <div className="min-h-screen bg-gray-50 overflow-hidden">

                {/* Main Content */}
                <section className="relative pt-24">
                    {/* Giant Text Background */}
                    <div className="absolute top-0 left-0 right-0 pointer-events-none select-none overflow-hidden">
                        <div className="text-[20vw] text-gray-200 font-black leading-none /[0.03] tracking-tighter whitespace-nowrap">
                            {raw_data.header_3 || "CONTACT"}
                        </div>
                    </div>

                    <div className={`relative max-w-2xl lg:max-w-7xl mx-auto px-3 xs:px-6 ${first_comp_pt} pb-15`}>
                        <div className="grid lg:grid-cols-2 gap-8 2xl:gap-16 items-start">
                            {/* Left - Info */}
                            <div className="space-y-10 sm:space-y-16">
                                <div>
                                    <p className={`text-${themeSett.primary_color} text-sm font-medium mb-4 tracking-wider`}>
                                        {raw_data.header_2 || "GET IN TOUCH"}
                                    </p>
                                    <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
                                        {raw_data.header || "LET&apos;S TALK"}<br />
                                        <span className={`text-${themeSett.primary_color}`}>
                                            {raw_data.header_2 || "REAL ESTATE"}
                                        </span>
                                    </h1>
                                    <p className=" text-lg max-w-md">
                                        {raw_data.sub_header || `Ready to make your next move? Our team of experts is standing by
                                        to turn your property dreams into reality.`}
                                    </p>
                                </div>

                                <div className="grid gap-2 xs:gap4 sm:gap-6">
                                    <div className="group flex items-center justify-between py-6 border-t border-white/10 hover:border-white/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all
                                            bg-${themeSett.primary_color} text-${themeSett.primary_button_text} `}>
                                                <BiPhoneCall className="h-5 w-5" />
                                            </div>
                                            <div className='flex flex-col space-y-1.5'>
                                                <p className=" text-xs uppercase tracking-wider">Phone</p>
                                                <a href={`tel:${brker_info?.contact_info?.phone_cell}`} className=" font-medium hover:text-sky-700 transition-colors">
                                                    {brker_info?.contact_info?.phone_cell}
                                                </a>
                                                <a href={`tel:${brker_info?.contact_info?.phone_local}`} className="font-medium hover:text-sky-700 transition-colors">
                                                    {brker_info?.contact_info?.phone_local}
                                                </a>
                                                <a href={`tel:${brker_info?.contact_info?.phone_toll_free}`} className=" font-medium hover:text-sky-700 transition-colors">
                                                    {brker_info?.contact_info?.phone_toll_free}
                                                </a>
                                            </div>
                                        </div>
                                        <BsArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="group flex items-center justify-between py-6 border-t border-white/10 hover:border-white/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all
                                            bg-${themeSett.primary_color} text-${themeSett.primary_button_text} `}>
                                                <CgMail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className=" text-xs uppercase tracking-wider">Email</p>
                                                <p className="text-[#1a1a1a]   flex flex-col space-y-1.5">
                                                    <a href={`mailto:${brker_info?.email}`} className=" font-medium hover:text-sky-700 transition-colors">
                                                        {brker_info?.email}
                                                    </a>
                                                    <a href={`mailto:${brker_info?.departments_info?.support_email}`} className=" font-medium hover:text-sky-700 transition-colors">
                                                        {brker_info?.departments_info?.support_email}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                        <BsArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="group flex items-center justify-between py-6 border-t border-b border-white/10">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all
                                            bg-${themeSett.primary_color} text-${themeSett.primary_button_text} `}>
                                                <BiMapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className=" text-xs uppercase tracking-wider">Address</p>
                                                <p className="text-[#1a1a1a]  flex flex-col space-y-1.5">
                                                    <span>{brker_info?.contact_info?.address}, {brker_info?.contact_info?.address_2}</span>
                                                    <span>{brker_info?.contact_info?.city} {brker_info?.contact_info?.state}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Form */}
                            {/* <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12"> */}
                            <div className={` bg-white shadow-xl px-4 py-5 xs:px-8 xs:py-8 flex items-center rounded-md`}>
                                <div className='w-full flex flex-col space-y-5'>
                                    <div className='grid grid-cols-1 xs:grid-cols-2 gap-4'>
                                        <div>
                                            <FloatingInput name='firstname' label='First Name' placeholder='Enter your first name'
                                                handleChange={(e) => handleInputChange(e)} value={formData.firstname} required />
                                        </div>

                                        <div>
                                            <FloatingInput name='lastname' label='Last Name' placeholder='Enter your last name'
                                                handleChange={(e) => handleInputChange(e)} value={formData.lastname} required />
                                        </div>
                                    </div>

                                    <div>
                                        <FloatingInput name='email' label='Email' placeholder='Enter your email'
                                            handleChange={(e) => handleInputChange(e)} value={formData.email} required />
                                    </div>
                                    <div>
                                        <FloatingInput name='phone' label='Phone Number' placeholder='Enter your phone number'
                                            handleChange={(e) => handleInputChange(e)} value={formData.phone} required />
                                    </div>
                                    <div>
                                        <FloatingInput name='subject' label='Subject' placeholder='Message subject'
                                            handleChange={(e) => handleInputChange(e)} value={formData.subject} required />
                                    </div>
                                    <div>
                                        <FloatingTextarea name='message' label='Message' placeholder='Enter your message' height='160px'
                                            handleChange={(e) => handleInputChange(e)} value={formData.message} required />
                                    </div>

                                    <div className='flex justify-end w-full'>
                                        <div className='px-7 py-4 text-white bg-buttons-primary rounded hover:shadow-2xl cursor-pointer
                                            flex items-center justify-center space-x-2 ' onClick={handleSubmitClick}>
                                            <span>{raw_data.button_text || "Send Message"}</span>
                                            <BiSend size={25} className='' />
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
                                 text-xs'>
                                    Section settings
                                </span>
                            </div>

                            <div id='editor_settings' className='hover:shadow-2xl relative group'
                                onClick={() => handleCompPickerClick("CHANGE_LAYOUT")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                                <BiRefresh size={17} />
                                <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                 text-xs'>
                                    Change Layout
                                </span>
                            </div>

                            <div id='editor_settings' className='hover:shadow-2xl relative group'
                                onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                                <BiTrash size={17} />

                                <span className='absolute hidden right-0 whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                 text-xs'>
                                    Remove Section Down
                                </span>
                            </div>

                        </div>
                    )}
                </section>
            </div>
        )
    }

}

export default ContactUsFormVar7