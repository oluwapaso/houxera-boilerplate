"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Helpers } from '@/_lib/helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { toast } from 'react-toastify';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { togglePropertyModal } from '@/app/GlobalRedux/user/userSlice';
import { FaFacebook, FaLinkedin, FaLinkedinIn, FaSquareFacebook, FaWhatsapp } from 'react-icons/fa6'
import { BiEnvelopeOpen } from 'react-icons/bi';
import { BsTwitterX } from 'react-icons/bs';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import { MdOutlineMarkEmailUnread } from 'react-icons/md';

const helpers = new Helpers();
const ShareComponent = ({ is_theme = false }: { is_theme: boolean }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [page_url, setPageURL] = useState("");

    const shareViaEmail = () => {
        dispatch(togglePropertyModal({ ...prop_modal, page: "Email Share" }));
    }

    useEffect(() => {
        setPageURL(`${window.location.href}/property-details?uid=${prop_modal?.property_info?.property_uid}`);
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    const share_title = `Check out this property i found on ${process.env.NEXT_PUBLIC_CHANNEL_WEBSITE}`;

    if (themeSett) {
        return (
            <div className={`w-full flex items-center justify-evenly py-10 px-10 *:flex *:items-center *:justify-center space-x-2 
                flex-wrap *:mb-2`}>

                <FacebookShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                    <button className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                        <FaFacebook size={30} />
                    </button>
                </FacebookShareButton>

                <TwitterShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                    <button className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                        <BsTwitterX size={30} />
                    </button>
                </TwitterShareButton>

                <LinkedinShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                    <button className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                        <FaLinkedin size={30} />
                    </button>
                </LinkedinShareButton>

                <WhatsappShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                    <button className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                        <FaWhatsapp size={30} />
                    </button>
                </WhatsappShareButton>

                <div className='*:p-4 *:rounded-md *:cursor-pointer' onClick={shareViaEmail}>
                    <button className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                        <MdOutlineMarkEmailUnread size={30} />
                    </button>
                </div>

            </div>
        )
    }
}

export default ShareComponent