"use client"

import { Helpers } from '@/_lib/helper';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import CommentBox from '@/components/blog-cards/CommentBox';
import CommentCardVar2 from '@/components/blog-cards/CommentCardVar-2';
import moment from 'moment';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCalendarEvent, BiRefresh } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

import { BsEye, BsTwitterX } from 'react-icons/bs';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import ReplyComment from '@/components/modals/ReplyComment';
import SideAds from '@/components/ads/SideAds';
import { CiShare2 } from 'react-icons/ci';
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { GiChatBubble, GiEggEye, GiFlame } from 'react-icons/gi';
import BlogSearch from '../blog-cards/BlogSearch';
import BlogCategoryLists from '../blog-cards/BlogCategoryLists';
import { useNeighborhoodDetails } from '@/_hooks/useNeighborhoodDetails';
import RecommendedNeighborhood from '../neighborhood-cards/RecommendedNeighborhood';

const helpers = new Helpers();
const BlogDetailsVar4 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    var {
        slug,
        company_unique_id,
        channel_uid,
        neighInfo,
        neighInsight,
        neighProperties,
        neighInfoLoaded,
        neighInfoError,
        neighInfoComm,
        neighInfoCommLoaded,
        neighInfoCommError,
        skip,
        has_more,
        curr_no_comms,
        page_url,
        first_comp_pt,
        sectionHover,
        themeSett,
        menuRef,
        is_menu_shown,
        all_comments,
        share_title,
        router,

        // handlers
        dispatch,
        handleSettingsClick,
        handleCompPickerClick,
        handleHover,
        handleMouseExist,
        fetchMoreComments,
        BuildSearchLink,
        setIsMenuShown,
        setRepToAppend,
        setNoComms
    } = useNeighborhoodDetails({ is_theme, raw_data, component: "NeighborhoodDetailsVar3" });

    const [showModal, setShowModal] = useState(false);
    const [modal_children, setModalChildren] = useState({} as React.ReactNode);

    const closeModal = () => {
        setShowModal(false);

        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "auto";
        }
    }

    const handleReply = (comment_uid: string) => { //, quoted_comments: string
        setModalChildren(<ReplyComment closeModal={closeModal} item_type="Neighborhood" item_uid={neighInfo.neighborhood_uid}
            comment_uid={comment_uid} setRepToAppend={setRepToAppend} setNoComms={setNoComms} />);
        setShowModal(true);

        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "hidden";
        }
    }

    const crumb = <div className='font-play-fair-display text-4xl !text-white'>
        {
            neighInfoLoaded ? (
                neighInfo ? (
                    neighInfo.title
                ) : ""
            ) : ""
        }
    </div>;

    const no_comm_added = <div className='p-10 mt-2 text-red-600 flex flex-col justify-center items-center min-h-6'>
        <div className='w-full text-center'>No comment added yet. Be the first to leave a comments.</div>
    </div>

    if (Array.isArray(neighInfoComm)) {

        if (neighInfoComm.length > 0) {

            all_comments = neighInfoComm.map((comm) => {
                return (<CommentCardVar2 key={comm.comment_uid} comm={comm} handleReply={handleReply} />)
            })

        } else {

            //Making sure request has been sent
            if (neighInfoCommLoaded) {
                all_comments[0] = no_comm_added
            } else {
                all_comments[0] = <div className='w-full flex justify-center items-center min-h-60'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>
            }

        }

    }

    if (themeSett && themeSett != null) {
        return (
            <div className={`min-h-screen bg-gray-100 relative ${first_comp_pt} pb-20 px-3`}>

                <div className='w-full h-[45dvh] grid grid-cols-1 tab:grid-cols-2 gap-0 relative'>

                    {/* Empty space */}
                    <div className='hidden tab:block'></div>

                    {/* Hero image */}
                    <div className=" col-span-1 w-full mx-auto h-full flex flex-col justify-end object-cover rounded-2xl overflow-hidden"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(neighInfo.header_image_large && neighInfo.header_image_large != "")
                                ? `${neighInfo?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>
                    </div>

                    <div className='w-full h-full absolute flex items-center justify-center'>
                        <div className='mx-auto w-[95%] tab:w-[75%] flex flex-col items-start justify-center h-full'>
                            <h1 className=" w-full text-2xl xs:text-3xl sm:text-4xl font-semibold sm:leading-snug text-gray-900">
                                <span className="bg-white leading-10 xs:leading-14 sm:leading-16 px-2 py-0.5 xs:py-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                                    {neighInfo.title}
                                </span>
                            </h1>

                            <div className=' flex w-full space-x-1.5 2xs:space-x-3 *:bg-white *:px-3 2xs:*:px-4 *:py-2 *:rounded *:flex *:items-center'>
                                <div className='space-x-1.5'>
                                    <BiCalendarEvent size={15} />
                                    <span className='text-sm font-semibold'>{moment(neighInfo.date_added).format("Do MMM, YYYY")}</span>
                                </div>

                                <div className='space-x-1.5'>
                                    <BsEye size={15} />
                                    <span className='text-sm font-semibold'>{neighInfo.views || "0"}</span>
                                </div>

                                <div className='space-x-1.5'>
                                    <GiChatBubble size={15} />
                                    <span className='text-sm font-semibold'>{neighInfo.comments || "0"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Content wrapper with overlapping card */}
                <div className={`container mx-auto max-w-[1280px] mt-8`}>

                    <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>
                        <div className='lg:col-span-4'>
                            {/* Main article card */}
                            {neighInfoError == "" &&
                                <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100 sm:p-8">

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">

                                        <div className="text-sm flex space-x-2">
                                            <p className="font-medium flex items-center space-x-1.5">
                                                <span className="font-medium text-gray-900">Posted On:</span>
                                                <span className=' text-gray-600'>{moment(neighInfo.date_added).format("Do MMM, YYYY")}</span>
                                            </p>
                                            <span>•</span>
                                            <p className="font-medium flex items-center space-x-1.5">
                                                <span className="font-medium text-gray-900">Views:</span>
                                                <span className=' text-gray-600'>{neighInfo.views}</span>
                                            </p>
                                            <span>•</span>
                                            <p className="font-medium flex items-center space-x-1.5">
                                                <span className="font-medium text-gray-900">Comments:</span>
                                                <span className=' text-gray-600'>{curr_no_comms}</span>
                                            </p>
                                        </div>

                                        <div className=' relative' ref={menuRef} onClick={() => setIsMenuShown(true)}>
                                            <button className={`flex items-center gap-2 rounded-full cursor-pointer border border-${themeSett.primary_color} 
                                            px-4 py-1.5 text-sm font-medium text-${themeSett.primary_color} transition-colors
                                            hover:bg-${themeSett.primary_color} hover:text-${themeSett.primary_button_text} `}>
                                                <CiShare2 className="h-4 w-4" />
                                                Share Guide
                                            </button>
                                            {is_menu_shown &&
                                                <div className=' absolute right-0 bg-white rounded shadow-2xl flex flex-col w-[220px] '>

                                                    <div className='w-full p-3 border-b border-gray-200 pb-2 text-sm font-semibold'>Share This Page:</div>
                                                    <div className={`w-full flex flex-col items-center *:flex *:items-center *:justify-start 
                                                    !divide-y !divide-gray-200`}>

                                                        <FacebookShareButton url={page_url} title={share_title}
                                                            className='w-full *:p-4 *:rounded-md *:cursor-pointer *:flex *:items-center *:space-x-2.5'>
                                                            <div className={`w-full hover:bg-gray-50`}>
                                                                <FaFacebook size={18} className={`text-${themeSett.primary_color}`} /> <span>Facebook</span>
                                                            </div>
                                                        </FacebookShareButton>

                                                        <TwitterShareButton url={page_url} title={share_title}
                                                            className='w-full *:p-4 *:rounded-md *:cursor-pointer *:flex *:items-center *:space-x-2.5'>
                                                            <div className={`w-full hover:bg-gray-50`}>
                                                                <BsTwitterX size={18} className={`text-${themeSett.primary_color}`} /> <span>X/Twitter</span>
                                                            </div>
                                                        </TwitterShareButton>

                                                        <LinkedinShareButton url={page_url} title={share_title}
                                                            className='w-full *:p-4 *:rounded-md *:cursor-pointer *:flex *:items-center *:space-x-2.5'>
                                                            <div className={`w-full hover:bg-gray-50`}>
                                                                <FaLinkedin size={18} className={`text-${themeSett.primary_color}`} /> <span>Linkedin</span>
                                                            </div>
                                                        </LinkedinShareButton>

                                                        <WhatsappShareButton url={page_url} title={share_title}
                                                            className='w-full *:p-4 *:rounded-md *:cursor-pointer *:flex *:items-center *:space-x-2.5'>
                                                            <div className={`w-full hover:bg-gray-50`}>
                                                                <FaWhatsapp size={18} className={`text-${themeSett.primary_color}`} /> <span>Whatsapp</span>
                                                            </div>
                                                        </WhatsappShareButton>

                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    <div className="w-full font-normal mt-8 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base overflow-x-hidden">
                                        <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: neighInfo.descriptions }} />
                                    </div>
                                </div>
                            }

                            {(neighInfoLoaded && neighInfoError == "") &&
                                <div className='w-full max-w-[900px] mt-16 flex flex-col'>

                                    <div className='w-full font-semibold text-2xl'>Leave a Comment </div>
                                    <CommentBox item_type="Neighborhood" item_uid={neighInfo?.neighborhood_uid} setRepToAppend={setRepToAppend}
                                        setNoComms={setNoComms} is_theme={is_theme} />

                                    <div className='w-full font-semibold text-2xl mt-14'>
                                        {curr_no_comms} Comment{curr_no_comms > 1 ? "s" : ""}
                                    </div>
                                    <div className='w-full' id='comment_area'>{all_comments}</div>
                                </div>
                            }

                            {has_more == "Yes" &&
                                <div className={`w-full flex items-center justify-center mt-4`}>
                                    <div className={`flex items-center justify-center px-4 py-3 cursor-pointer rounded 
                                    bg-${themeSett?.primary_color} text-${themeSett.primary_button_text} hover:shadow-2xl hover:opacity-90`}
                                        onClick={fetchMoreComments}>
                                        <BiRefresh size={18} className='mr-2' /> <span>Load More Comments</span>
                                    </div>
                                </div>
                            }

                            {neighInfoError != "" &&
                                <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                    {neighInfoError}
                                </div>
                            }
                        </div>

                        <div className='hidden lg:block lg:col-span-2'>

                            {(neighInfoLoaded && neighInfo) &&
                                <div className='w-full'>
                                    <RecommendedNeighborhood neighborhood_uid={neighInfo?.neighborhood_uid} is_theme={is_theme} />
                                </div>
                            }

                            <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                <SideAds no_ads={4} />
                            </div>
                        </div>
                    </div>

                    {/* <div className='w-full'>
                        <BlogCategoryPills curr_cat={neighInfo.category_name} />
                    </div>

                    {(neighInfoLoaded && neighInfo) &&
                        <div className='w-full mt-12'>
                            <RelatedneighInfos variation='grid' is_theme={is_theme} category_name={neighInfo.category_name} post_uid={neighInfo.post_uid} />
                        </div>
                    }

                    <div className='w-full mt-15'>
                        <div className='col-span-full text-xl flex items-center space-x-2.5'>
                            <GiFlame size={20} /> <span>Hot Properties</span>
                        </div>

                        <div className='w-full mt-1 grid grid-cols-3 gap-5 *:border *:border-gray-100 *:shadow-lg'>
                            <SideAds no_ads={4} />
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default BlogDetailsVar4
