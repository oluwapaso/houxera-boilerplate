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
import { BiRefresh, BiTrashAlt } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

import { BsGear, BsTwitterX } from 'react-icons/bs';
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
import BlogCategoryPills from '../blog-cards/BlogCategoryPills';
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { GiFlame } from 'react-icons/gi';
import Modal from '../modals/Modal';
import RecommendedNeighborhood from '../neighborhood-cards/RecommendedNeighborhood';

const helpers = new Helpers();
const NeighborhoodDetailsVar2 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string || "agric-ikorodu"; //Hardcoded part is for testing
    const router = useRouter();

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [page_url, setPageURL] = useState("");
    const [is_menu_shown, setIsMenuShown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-35");

    const [neighInfo, setNeighInfo] = useState<any>({});
    const [neighInsight, setNeighInsight] = useState<any>({});
    const [neighProperties, setNeighProperties] = useState<any[]>([]);
    const [neighInfoLoaded, setNeighInfoLoaded] = useState<boolean>(false);
    const [neighInfoError, setNeighInfoError] = useState("");

    const [neighInfoComm, setNeighborhoodComm] = useState<any[]>([]);
    const [neighInfoCommLoaded, setNeighborhoodCommLoaded] = useState<boolean>(false);
    const [neighInfoCommError, setNeighborhoodCommError] = useState("");

    const [skip, setSkip] = useState(0);
    const [comment_resp, setCommResp] = useState("");
    const [has_more, setHasMore] = useState("No");
    const [rep_to_append, setRepToAppend] = useState<any>(null);
    const [curr_no_comms, setNoComms] = useState(0);

    let all_comments: React.JSX.Element[] = [];

    const [showModal, setShowModal] = useState(false);
    const [modal_children, setModalChildren] = useState({} as React.ReactNode);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const closeModal = () => {
        setShowModal(false);

        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "auto";
        }
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "neighborhood_details",
                    "type": "section",
                    "component": "NeighborhoodDetailsVar2",
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "Neighborhood Posts"
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

    const handleReply = (comment_uid: string) => { //, quoted_comments: string
        setModalChildren(<ReplyComment closeModal={closeModal} item_type="Neighborhood" item_uid={neighInfo.neighborhood_uid}
            comment_uid={comment_uid} setRepToAppend={setRepToAppend} setNoComms={setNoComms} />);
        setShowModal(true);

        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "hidden";
        }
    }

    const LoadNeighsDetails = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "slug": slug,
            "user_uid": user.user_info?.user_uid,
        }


        const response = await window.MLS_Util.LoadNeighborhoodDetails(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setNeighInfo(response.data.neighborhood);
            setNoComms(response.data?.neighborhood?.comments);
            setNeighInsight(response.data.insights);
            setNeighProperties(response.data.properties);
        } else {
            setNeighInfoError(resp_message)
        }

        setNeighInfoLoaded(true);

    }

    const LoadNeighsComments = async (skip: number) => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "neighborhood_uid": neighInfo.neighborhood_uid,
            "skip": skip || 0,
            "size": 5,//20
        }

        const response = await window.MLS_Util.LoadNeighborhoodComments(payload);
        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {

            setNeighborhoodComm((prev_comm: any[]) => [...prev_comm, ...response.data?.comments]);
            dispatch(hidePageLoader());
            setHasMore(response.data?.has_more);
            setSkip(skip);

        } else {
            setNeighborhoodCommError(resp_message);
            setHasMore("No");
        }

        setNeighborhoodCommLoaded(true);

    }

    const fetchMoreComments = async () => {
        const new_skip = skip + 1;
        LoadNeighsComments(new_skip);
    }

    const BuildSearchLink = (neighInfo: any) => {
        var link = "";
        var prop_delv = neighInfo.property_delivery;

        if (prop_delv.city && prop_delv.city != "") {
            link += `location=${prop_delv.city}&`;
        }

        if (Array.isArray(prop_delv.listing_type) && prop_delv.listing_type.length > 0) {
            link += `sales_type=${prop_delv.listing_type[0]}&`;
        }

        link = helpers.rTrim(link, "&");
        return link;
    }

    useEffect(() => {
        LoadNeighsComments(0);
    }, [neighInfo]);

    useEffect(() => {

        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadNeighsDetails();
        }

    }, [window.MLS_Util]);

    useEffect(() => {
        setPageURL(`${window.location.href}/neigh-info/${slug}`);
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        if (rep_to_append) {
            setNeighborhoodCommLoaded(false);

            const to = setTimeout(() => {
                setNeighborhoodComm((prev_comm: any[]) => [rep_to_append, ...prev_comm]);
                setNeighborhoodCommLoaded(true);
            }, 250)

            const to2 = setTimeout(() => {
                const parentElement = document.getElementById('comment_area') as HTMLDivElement;
                if (parentElement) {
                    var top = parentElement.offsetTop - 10;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }, 550)

            return () => {
                clearTimeout(to);
                clearTimeout(to2);
            }

        }
    }, [rep_to_append]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-52");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("main-nav");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25 md:pt-35" : "pt-54");
            };

            updatePadding(); // initial

            // Watch for changes (forceMobile can change on resize)
            const observer = new MutationObserver(updatePadding);
            const nav = document.getElementById("main-nav");
            if (nav) {
                observer.observe(nav, {
                    attributes: true,
                    attributeFilter: ["data-is-mobile"],
                });
            }

            return () => observer.disconnect();
        }

    }, [themeSett?.nav_component?.type, raw_data?.component_index]);

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

    const share_title = `Check out this neighborhod guide i found on ${process.env.NEXT_PUBLIC_CHANNEL_WEBSITE}`;

    if (themeSett && themeSett != null) {
        return (
            <div className={`min-h-screen bg-gray-100 relative ${first_comp_pt} pb-20`}>

                {/* Hero image */}
                <header className="w-full h-[45dvh] relative z-1 overflow-hidden">
                    <div className=" w-[96%] max-w-[1450px] rounded-2xl mx-auto h-full flex flex-col justify-end object-cover"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(neighInfo.header_image_large && neighInfo.header_image_large != "")
                                ? `${neighInfo?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>
                    </div>
                </header>

                {/* Content wrapper with overlapping card */}
                <div className={`container mx-auto max-w-[1280px] relative px-3 sm:px-6 lg:px-8 z-2 -mt-14`}>
                    {/* Main article card */}
                    {neighInfoError == "" &&
                        <div className="rounded-2xl bg-white px-3 2xs:px-5 py-5 shadow-xl ring-1 ring-gray-100 sm:p-8">
                            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <span>Category:</span> <span className={`text-${themeSett.primary_color}`}>{neighInfo?.category_name}</span>
                            </span>

                            <h1 className="mt-3 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                                {neighInfo.title}
                            </h1>

                            <div className="mt-5 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-200 pb-5">

                                <div className="flex flex-col sm:flex-row space-x-3.5 text-sm *:shrink-0">
                                    <p className="font-medium flex items-center space-x-1.5">
                                        <span className="font-medium text-gray-900">Posted On:</span>
                                        <span className=' text-gray-600'>{moment(neighInfo.date_added).format("Do MMM, YYYY")}</span>
                                    </p>
                                    <span className='hidden md:flex items-center'>•</span>
                                    <p className="font-medium flex items-center space-x-1.5">
                                        <span className="font-medium text-gray-900">Views:</span>
                                        <span className=' text-gray-600'>{neighInfo.views}</span>
                                    </p>
                                    <span className='hidden md:flex items-center'>•</span>
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
                                        Share Post
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
                                <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: neighInfo.post_body }} />
                            </div>
                        </div>
                    }

                    {(neighInfoLoaded && neighInfoError == "") &&
                        <div className='w-full max-w-[900px] mt-16 flex flex-col'>

                            <div className='w-full font-semibold text-2xl'>Leave a Comment </div>
                            <CommentBox item_type="Blog Post" item_uid={neighInfo?.post_uid} setRepToAppend={setRepToAppend}
                                setNoComms={setNoComms} />

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


                    {(neighInfoLoaded && neighInfo) &&
                        <div className='w-full'>
                            <RecommendedNeighborhood neighborhood_uid={neighInfo?.neighborhood_uid} is_theme={is_theme} />
                        </div>
                    }

                    <div className='w-full mt-15'>
                        <div className='col-span-full text-xl flex items-center space-x-2.5'>
                            <GiFlame size={20} /> <span>Hot Properties</span>
                        </div>

                        <div className='w-full mt-1 grid grid-cols-3 gap-5 *:border *:border-gray-100 *:shadow-lg'>
                            <SideAds no_ads={4} />
                        </div>
                    </div>
                </div>

                <Modal show={showModal} children={modal_children} width={700} closeModal={closeModal} title=<div>Reply To Comment</div> />

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
                            <BiTrashAlt size={17} />

                            <span className='absolute hidden right-0 whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Remove Section Down
                            </span>
                        </div>

                    </div>
                )}
            </div>
        )
    }
}

export default NeighborhoodDetailsVar2
