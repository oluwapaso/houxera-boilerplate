"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiBuilding, BiHome, BiMessageSquare, BiPhoneIncoming, BiRefresh, BiSend, BiTrash } from 'react-icons/bi'
import FloatingInput from '@/components/FloatingInput'
import FloatingTextarea from '@/components/FloatingTextarea'
import { toast } from 'react-toastify'
import { Helpers } from '@/_lib/helper'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice'
import { BsGear } from 'react-icons/bs'
import { CgMail } from 'react-icons/cg'
import { FaLandmark } from 'react-icons/fa6'
import { FaQuestionCircle } from 'react-icons/fa'

const helpers = new Helpers();
const ContactUsFormVar5 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch();
    const brker_info = useSelector((state: RootState) => state.broker);
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [selectedInterest, setSelectedInterest] = useState("")
    const [first_comp_pt, setFirstCompPt] = useState("pt-36");

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
                    "component": "ContactUsFormVar5",
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
        setFormData(prevData => {
            return {
                ...prevData,
                "subject": selectedInterest
            }
        })
    }, [selectedInterest]);



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

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    const interests = [
        { id: "buying", icon: BiHome, label: "Buying", desc: "Looking to purchase" },
        { id: "selling", icon: BiBuilding, label: "Selling", desc: "List your property" },
        { id: "investing", icon: FaLandmark, label: "Investing", desc: "Investment opportunities" },
        { id: "general", icon: FaQuestionCircle, label: "Other", desc: "General Enquiries" },
    ]

    if (themeSett) {

        return (
            <section className={`${first_comp_pt} pb-15 px-3 xs:px-6 relative`}>
                <div className="container mx-auto max-w-3xl tab:max-w-[1280px] flex flex-col">
                    {/* Header Section */}
                    <div className=" order-1 text-center max-w-xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            {raw_data.header || "How can we help you today?"}
                        </h1>
                        <p className="text-slate-600 text-lg">
                            {raw_data.sub_header || "It's all about the humans behind a brand and those experiencing it, we're right there. In the middle."}
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="order-3 tab:!order-2 mx-auto max-tab:max-w-lg grid sm:grid-cols---2 tab:!grid-cols-3 gap-y-8 gap-x-4 xl:gap-x-8 tab:!mb-16">
                        <div className="bg-white rounded-2xl p-6 shadow-md sm:shadow-xl border border-slate-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex bg-green-50 text-green-600 items-center justify-center mb-4`}>
                                <BiPhoneIncoming className="h-5 w-5" />
                            </div>
                            <p className="text-slate-500 text-sm mb-1">Call us</p>
                            <p className="text-slate-900 font-medium flex flex-col space-y-1.5">
                                <a href={`tel:${brker_info?.contact_info?.phone_cell}`} className="text-[#3d3027] font-medium hover:text-sky-700 transition-colors">
                                    {brker_info?.contact_info?.phone_cell}
                                </a>
                                <a href={`tel:${brker_info?.contact_info?.phone_local}`} className="text-[#3d3027] font-medium hover:text-sky-700 transition-colors">
                                    {brker_info?.contact_info?.phone_local}
                                </a>
                                <a href={`tel:${brker_info?.contact_info?.phone_toll_free}`} className="text-[#3d3027] font-medium hover:text-sky-700 transition-colors">
                                    {brker_info?.contact_info?.phone_toll_free}
                                </a>
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex bg-blue-50 text-blue-600 items-center justify-center mb-4`}>
                                <BiPhoneIncoming className="h-5 w-5" />
                            </div>
                            <p className="text-slate-500 text-sm mb-1">Email us</p>
                            <p className="text-slate-900 font-medium flex flex-col space-y-1.5">
                                <a href={`mailto:${brker_info?.email}`} className="text-[#3d3027] font-medium hover:text-sky-700 transition-colors">
                                    {brker_info?.email}
                                </a>
                                <a href={`mailto:${brker_info?.departments_info?.support_email}`} className="text-[#3d3027] font-medium hover:text-sky-700 transition-colors">
                                    {brker_info?.departments_info?.support_email}
                                </a>
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex bg-orange-50 text-orange-600 items-center justify-center mb-4`}>
                                <CgMail className="h-5 w-5" />
                            </div>
                            <p className="text-slate-500 text-sm mb-1">Visit us</p>
                            <p className="text-slate-900 font-medium flex flex-col space-y-1.5">
                                <span>{brker_info?.contact_info?.address}, {brker_info?.contact_info?.address_2}</span>
                                <span>{brker_info?.contact_info?.city} {brker_info?.contact_info?.state}</span>
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="order-2 tab:!order-3 mx-auto max-w-3xl lg:max-w-[1280px] bg-white rounded-md tab:rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-tab:!mb-16">
                        <div className="grid lg:grid-cols-5">
                            {/* Left - Interest Selection */}
                            <div className="lg:col-span-2 bg-slate-50 px-3 xs:px-6 tab:px-8 py-4 tab:py-8 lg:p-12">
                                <h2 className="text-2xl font-semibold text-slate-900 mb-2">I'm interested in...</h2>
                                <p className="text-slate-500 mb-8">Select your primary interest to help us serve you better.</p>

                                <div className="space-y-3">
                                    {interests.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setSelectedInterest(item.id)}
                                            className={`w-full cursor-pointer flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedInterest === item.id
                                                ? `border-${themeSett.primary_color} bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -50)} `
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                                }`} >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                                            ${selectedInterest === item.id
                                                    ? `bg-${themeSett.primary_color} text-${themeSett.primary_button_text} `
                                                    : "bg-slate-100 text-slate-600"
                                                }`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className={`font-medium ${selectedInterest === item.id ? "text-blue-900" : "text-slate-900"}`}>
                                                    {item.label}
                                                </p>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right - Contact Form */}
                            <div className="lg:col-span-3 px-3 xs:px-6 tab:px-8 py-8 lg:p-12">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`w-10 h-10 rounded-full bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -38)} 
                                    flex items-center justify-center`}>
                                        <BiMessageSquare className={`h-5 w-5 text-${themeSett.primary_color} `} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">{raw_data.header_2 || "Send us a message"}</h2>
                                        <p className="text-slate-500 text-sm">{raw_data.sub_header_2 || "We'll respond within 24 hours"}</p>
                                    </div>
                                </div>

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

export default ContactUsFormVar5