"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '@/app/GlobalRedux/store'

import { MdClose } from 'react-icons/md';
import { togglePropertyModal } from '@/app/GlobalRedux/user/userSlice';
import { BiEnvelopeOpen, BiShare, BiWalk } from 'react-icons/bi';
import EnquiryComponent from './EnquiryComponent';
import TourComponent from './TourComponent';
import ShareComponent from './ShareComponent';
import EmailShareComponent from './EmailShareComponent';

const PropertyModal = () => {

    const dispatch = useDispatch();
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);
    const [component, setComponent] = useState(<></>);

    useEffect(() => {
        const body = document.querySelector("body");
        if (prop_modal && prop_modal?.shown) {
            if (body) {
                body.style.overflow = "hidden";
            }
        } else {
            if (body) {
                body.style.overflow = "auto";
            }
        }
    }, [prop_modal]);

    const closeModal = () => {
        dispatch(togglePropertyModal({ shown: false, page: "", title: "", property_info: {} }));
        toast.dismiss();
        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "auto";
        }
    }

    const PageIcon = () => {
        if (prop_modal?.page == "Enquiry") {
            return <BiEnvelopeOpen size={18} />
        } else if (prop_modal?.page == "Tour") {
            return <BiWalk size={18} />
        } else if (prop_modal?.page == "Share") {
            return <BiShare size={18} />
        } else if (prop_modal?.page == "Email Share") {
            return <BiEnvelopeOpen size={18} />
        }
    }

    useEffect(() => {

        if (prop_modal?.page == "Enquiry") {
            setComponent(<EnquiryComponent is_theme={prop_modal?.is_theme} />)
        } else if (prop_modal?.page == "Tour") {
            setComponent(<TourComponent is_theme={prop_modal?.is_theme} />)
        } else if (prop_modal?.page == "Share") {
            setComponent(<ShareComponent is_theme={prop_modal?.is_theme} />)
        } else if (prop_modal?.page == "Email Share") {
            setComponent(<EmailShareComponent is_theme={prop_modal?.is_theme} />)
        }

    }, [prop_modal?.page]);

    return ((prop_modal && prop_modal?.shown) ?
        <dialog className="fixed left-0 top-0 w-full h-full bg-black/50 z-[50] overflow-auto backdrop-blur flex 
            justify-center items-center py-6">
            <div className={`w-[750px] rounded bg-white m-auto h-auto overflow-x overflow-x-hidden overflow-y-auto max-w-[95%]
                flex flex-col`}>
                <div className="w-full px-6 py-4 flex justify-between items-center relative bg-gray-50
                 border-b border-gray-300">
                    <h2 className="font-semibold text-md flex-grow flex items-center line-clamp-1">
                        <span className='w-full flex items-center space-x-2.5 line-clamp-1'>
                            <span className=' shrink-0'>{PageIcon()}</span>
                            <span className=' line-clamp-1'>{prop_modal?.title}</span>
                        </span>
                    </h2>

                    <div className="text-black flex justify-center items-center cursor-pointer self-start shrink-0
                    hover:drop-shadow-2xl hover:bg-gray-100 "
                        onClick={closeModal}>
                        <MdClose size={24} className="font-bold duration-300" />
                    </div>
                </div>

                <div className="flex flex-col items-center w-full mt-2-mb-2 cursor-pointer" id='lead_modal_scroll_area'>
                    {component}
                </div>
            </div>
        </dialog> : null
    )
}

export default PropertyModal
