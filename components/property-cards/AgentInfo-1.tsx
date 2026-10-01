"use client"

import usePropertyModal from '@/_hooks/usePropertyModal';
import { RootState } from '@/app/GlobalRedux/store';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { BiAngry, BiEnvelopeOpen, BiLink, BiMenu, BiPhoneOutgoing, BiShare, BiWalk } from 'react-icons/bi';
import { BsShieldCheck } from 'react-icons/bs';
import { CgCopy } from 'react-icons/cg';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AgentInfo1 = ({ primary_photo, prop }: { primary_photo: string, prop: any }) => {

    const agent_info = useSelector((state: RootState) => state.agent);
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [modal_page, setModalPage] = useState<"Enquiry" | "Tour" | "Share" | null>(null);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    usePropertyModal({ page: modal_page, property_info: prop });

    const copyToClipboard = () => {
        const text = document.getElementById("text_to_copy")?.innerText;
        if (text) {
            toast.dismiss();
            navigator.clipboard.writeText(text).then(() => {
                toast.success('Copied to clipboard!', {
                    position: "top-center",
                    theme: "colored"
                });
            }).catch((err) => {
                toast.error(`Failed to copy: ${err}`, {
                    position: "top-center",
                    theme: "colored"
                });
            });
        }
    };

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpened(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    useEffect(() => {
        if (!prop_modal.shown) {
            setModalPage(null);
        }
    }, [prop_modal.shown]);

    return (
        <div className='w-full relative h-full mx-auto max-w-[650px] lg:max-w-[100%]'>
            <div className='w-full bg-white rounded-md drop-shadow-xl border border-gray-300 lg:sticky 
            lg:top-24 lg:z-[2] overflow-hidden'>

                <div className='w-full p-4 relative'>
                    <div className='w-full flex justify-center items-center z-30 relative'>
                        <div className='size-40 flex justify-center items-center rounded-full border border-gray-400 
                        dark:border-white p-1 relative'>
                            <div className='w-full h-full rounded-full overflow-hidden'>
                                <img src={`${agent_info?.dp_thumb || "../../no-image-found.jpg"}`} alt='agent dp'
                                    width={50} height={50} className='w-full h-auto rounded-full' onError={(e) => {
                                        (e.target as HTMLImageElement).src = "../../no-image-found.jpg";
                                    }} />
                            </div>

                            <div className=' absolute size-14 rounded-full flex items-center justify-center 
                            bg-amber-200 shadow-2xl text-gray-900 -bottom-[0px] -right-[20px] text-base'>
                                <span className='mr-[2px]'>{parseFloat(agent_info?.ratings || 0).toFixed(1)}</span>
                                <FaStar size={15} />
                            </div>
                        </div>
                    </div>

                    <div className='w-full mt-4 flex flex-col justify-center items-center z-30 *:flex *:items-center 
                    *:justify-center space-y-3 relative'>
                        <div className='font-medium w-full text-lg text-white bg-black/50 p-3 rounded'>
                            {agent_info?.company_name}
                        </div>
                    </div>

                    <div className='absolute h-full w-full top-0 bottom-0 left-0 bg-black/30 z-20'></div>
                    <div className='absolute h-full w-full top-0 bottom-0 left-0 bg-cover object-contain cursor-pointer z-10'
                        style={{ backgroundImage: `url(${primary_photo})`, backgroundPosition: "center", }}>
                    </div>

                    <div className='absolute p-2 rounded z-40 cursor-pointer bg-gray-100 shadow-2xl text-gray-900 top-[10px] 
                        right-[10px]' ref={menuRef} >
                        <div className=' flex items-center justify-center space-x-1.5 text-sm'
                            onClick={() => setIsMenuOpened(!isMenuOpened)}>
                            <BiMenu size={20} /> <span>Menu</span>
                        </div>

                        <div className={`${isMenuOpened ? "block" : "hidden"} w-[260px] absolute top-[104%] right-0 shadow-2xl 
                            rounded bg-gray-50 z-30`}>
                            <div className='w-full flex flex-col max-h-[400px] overflow-y-auto font-normal text-base
                             *:flex *:items-center *:space-x-1.5 *:px-6 *:py-4 divide-y divide-gray-200'>

                                <div className=' hover:bg-gray-200' onClick={() => setModalPage("Enquiry")}>
                                    <BiEnvelopeOpen size={20} />
                                    <div>Make Enquiry</div>
                                </div>

                                <div className=' hover:bg-gray-200' onClick={() => setModalPage("Tour")}>
                                    <BiWalk size={20} />
                                    <div>Schedule a Tour</div>
                                </div>

                                <div className=' hover:bg-gray-200' onClick={() => setModalPage("Share")}>
                                    <BiShare size={20} />
                                    <div>Share Listing</div>
                                </div>

                                <Link href={`${agent_info?.review_link}`} target='_blank' className=' hover:bg-gray-200'>
                                    <BiLink size={17} /> <span>View reviews on RaR</span>
                                </Link>

                                <Link href={`${agent_info?.report_link}`} target='_blank' className=' text-red-600 hover:bg-gray-200'>
                                    <BiAngry size={17} /> <span>Report Agent</span>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full p-4 lg:p-6 grid grid-cols-1 gap-x-6 *:py-4 *:border-b *:border-gray-300'>

                    <div className='flex justify-between'>
                        <div className='font-semibold text-base'>MLS #:</div>
                        <div className=' deep-blue-dashed-undies cursor-pointer flex items-center group relative text-sky-800 
                        dark:text-sky-500 font-normal text-base text-right' onClick={copyToClipboard}>
                            <span id='text_to_copy'>{agent_info?.mls_number}</span>
                            <CgCopy className='ml-1' size={16} />
                            <div className='text-xs font-medium absolute hidden right-0 bottom-full px-3 py-2 rounded-md 
                            group-hover:block w-fit whitespace-nowrap bg-black text-white'>
                                Click to copy
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-between'>
                        <div className='font-semibold text-base flex items-center space-x-1.5'>
                            <FaMapMarkerAlt size={16} /> <span>Address</span>
                        </div>
                        <div className='text-base'>
                            {agent_info?.address_1}
                            {agent_info?.address_2 && <>, {agent_info?.address_2}</>}
                            <>, {agent_info?.city} {agent_info?.state}</>
                        </div>
                    </div>

                    <div className='flex flex-col justify-between'>
                        <div className='font-semibold text-base flex items-center space-x-1.5'>
                            <BiPhoneOutgoing size={16} /> <span>Phone</span>
                        </div>
                        <div className='text-base'>
                            <Link href={`tel:${agent_info?.phone_1}`} className='text-sky-700'>{agent_info?.phone_1}</Link>
                            {agent_info?.phone_2 && <>, <Link href={`tel:${agent_info?.phone_2}`} className='text-sky-700'>{agent_info?.phone_2}</Link></>}
                        </div>
                    </div>

                    <div className='flex flex-col justify-between'>
                        <div className='font-semibold text-base flex items-center space-x-1.5'>
                            <BiEnvelopeOpen size={16} /> <span>Email</span>
                        </div>
                        <div className='text-base'>
                            <Link href={`mail:${agent_info?.email}`} className='text-sky-700'>{agent_info?.email}</Link>
                        </div>
                    </div>

                    <div className='text-green-700 flex flex-col !border-b-0'>
                        <div className=' flex items-center'>
                            <BsShieldCheck size={16} className='mr-2' />
                            <span className='font-semibold'>Verified</span>
                        </div>
                        <div>This agent info is verified
                            by <Link href={`${process.env.NEXT_PUBLIC_REVIEW_WEBSITE}`} target='_balnk'
                                className='text-sky-700'>Rate a Reator<sup>&copy;</sup></Link>
                        </div>
                    </div>

                </div>
                {/**
                "agent_info": {
                    "address_1": "Quarters oke odo iwo",
                "address_2": "suite 54",
                "agent_id": "1",
                "agent_uid": "ssis-9833di8930-92090hdk0933",
                "city": "Iwo",
                "company_id": "1",
                "company_name": "Lagos Realty",
                "company_uid": "1BUPSJZ67YZ",
                "dp_large": "",
                "dp_thumb": "",
                "email": "epaso@gmai.com",
                "facebook": "http://fcebook.com/epaso",
                "firstname": "Adebayo",
                "instagram": "http://instagram.com/epaso",
                "lastname": "Ishola",
                "legal_business_name": "Elpaso Worldwide Realty",
                "linkedin": "http://linkedin.com/epaso",
                "mls_number": "MLS-HJ29AHj20289UWT",
                "phone_1": "(094) 0904-9340",
                "phone_2": "(499) 4944-4445",
                "positive_feedback": "86",
                "ratings": "4.13",
                "state": "Adamawa",
                "tiktok": "http://tiktok.com/epaso",
                "total_recommendation": "4.3",
                "total_reviews": "7",
                "twitter": "http://twitter.com/epaso",
                "websites": null,
                "whatsapp": "(499) 4944-4445",
                "youtube": "http://youtube.com/epaso"
        }, **/}
            </div>
        </div>

    )
}

export default AgentInfo1
