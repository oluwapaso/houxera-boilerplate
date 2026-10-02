"use client"

import { Helpers } from '@/_lib/helper';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import ImageWithFallback from '@/components/ImageWithFallback';
import Modal from '@/components/modals/Modal';
import moment from 'moment';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCalendar, BiRefresh, BiTrashAlt } from 'react-icons/bi';
import { BsEyeFill, BsGear } from 'react-icons/bs';
import { FaArrowLeftLong, FaComments, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';

import { BsTwitterX } from 'react-icons/bs';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import ReplyComment from '@/components/modals/ReplyComment';
import SideAds from '@/components/ads/SideAds';
import CommentCardVar2 from '../blog-cards/CommentCardVar-2';
import CommentBox from '../blog-cards/CommentBox';
import RecommendedNeighborhood from '../neighborhood-cards/RecommendedNeighborhood';

const helpers = new Helpers();
const NeighborhoodDetailsVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string || "rising-building-material-costs-threaten-real-estate-project-viability"; //Hardcoded part is for testing
    const router = useRouter();

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [page_url, setPageURL] = useState("");

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

    const [keyword, setKeyword] = useState("");
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
                    "component": "NeighborhoodDetailsVar1",
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
            <div className="flex flex-col min-h-screen relative" >

                {/**  ======================= Header Area Starts ====================== **/}
                <header className="w-full h-[85dvh] sm:h-[55dvh] bg-gray-100 relative">

                    <div data-has-bg="yes" className=" h-full flex flex-col justify-end pb-6 relative"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(neighInfo.header_image_large && neighInfo.header_image_large != "")
                                ? `${neighInfo?.header_image_large}` : "../no-neighborhood-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>

                        <div className={`container mx-auto max-w-[1200px] px-3 xl:px-0 text-left z-20 flex flex-col`}>
                            <div className={`w-full font-medium *:text-white xl:text-shadow-primary`}>{crumb}</div>
                            <div className={`w-full text-white line-clamp-2 `}>{neighInfo?.summary}</div>

                            <div className=' mt-8 flex flex-col md:flex-row space-y-2 justify-between'>
                                <div className=' flex flex-col sm:flex-row space-x-3.5 text-white *:flex *:items-center *:space-x-1.5 
                                *:shrink-0 flex--wrap'>
                                    <div className=''>
                                        <span className='font-semibold flex items-center space-x-2'>
                                            <BiCalendar size={18} />
                                            <span>Posted On:</span>
                                        </span>
                                        <time>{moment(neighInfo.date_added).format("MMMM DD, YYYY")}</time>
                                    </div>

                                    <div className=''>
                                        <span className='font-semibold flex items-center space-x-2'>
                                            <BsEyeFill size={18} />
                                            <span>Views:</span>
                                        </span>
                                        <span>{neighInfo.views}</span>
                                    </div>

                                    <div className=''>
                                        <span className='font-semibold flex items-center space-x-2'>
                                            <FaComments size={18} />
                                            <span>Comments:</span>
                                        </span>
                                        <span>{curr_no_comms}</span>
                                    </div>
                                </div>

                                <div className='justify-self-end ml-auto'>
                                    <div className={`bg-${themeSett?.primary_color} text-${themeSett.primary_button_text} w-fit px-5 
                                    py-2 flex items-center space-x-2 rounded cursor-pointer`}
                                        onClick={() => { dispatch(showPageLoader()); router.back(); }}>
                                        <FaArrowLeftLong size={18} />
                                        <span>Go Back</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="absolute w-full h-full bottom-0 z-10 bg-gradient-to-b from-transparent to-black from-20%"></div>
                    </div>

                    <div className="absolute top-0 w-full h-full z-10 bg-gradient-to-b from-transparent to-black/80 from-10%"></div>
                </header>
                {/**  ======================= Header Area Ends ====================== **/}

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Content Area Starts ====================== **/}
                    <div className="w-full relative py-8 xl:py-16 px-4">
                        <div className="container mx-auto max-w-[1200px]">

                            {!neighInfoLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                            </div>}

                            {(neighInfoLoaded && neighInfo) &&
                                <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>
                                    <div className='lg:col-span-4'>
                                        {neighInfoError == "" &&
                                            <div className='w-full'>

                                                <div className='w-full'>
                                                    <ImageWithFallback key={neighInfo.post_id} width={1250} height={400}
                                                        src={`${(neighInfo.header_image_large && neighInfo.header_image_large != "")
                                                            ? `${neighInfo?.header_image_large}` : "../no-neighborhood-image-added.png"}`}
                                                        fallbackSrc={`../no-neighborhood-image-added.png`} alt={neighInfo.post_title} />
                                                </div>

                                                <div className='w-full font-normal mt-3 overflow-x-hidden'>
                                                    <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: neighInfo.post_body }} />
                                                </div>

                                                <div className='w-full my-1 py-2 border-b border-gray-200 text-gray-600 font-normal'>
                                                    Posted On <time>{moment(neighInfo.date_added).format("MMMM DD, YYYY")}</time>
                                                </div>

                                                <div className='mt-4 w-full font-medium'>Share This Page:</div>
                                                <div className={`w-full flex items-center *:flex *:items-center *:justify-center 
                                                space-x-2 flex-wrap *:mb-2`}>

                                                    <FacebookShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <FaFacebook size={30} />
                                                        </div>
                                                    </FacebookShareButton>

                                                    <TwitterShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <BsTwitterX size={30} />
                                                        </div>
                                                    </TwitterShareButton>

                                                    <LinkedinShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <FaLinkedin size={30} />
                                                        </div>
                                                    </LinkedinShareButton>

                                                    <WhatsappShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <FaWhatsapp size={30} />
                                                        </div>
                                                    </WhatsappShareButton>

                                                </div>

                                                <div className='w-full mt-10 flex flex-col'>

                                                    <div className='w-full font-semibold text-2xl'>Leave a Comment </div>
                                                    <CommentBox item_type="Neighborhood Post" item_uid={neighInfo?.post_uid} setRepToAppend={setRepToAppend}
                                                        setNoComms={setNoComms} is_theme={is_theme} />

                                                    <div className='w-full font-semibold text-2xl mt-14'>
                                                        {curr_no_comms} Comment{curr_no_comms > 1 ? "s" : ""}
                                                    </div>

                                                    <div className='w-full' id='comment_area'>{all_comments}</div>
                                                </div>

                                                {has_more == "Yes" &&
                                                    <div className={`w-full flex items-center justify-center mt-4`}>
                                                        <div className={`flex items-center justify-center px-4 py-3 cursor-pointer rounded 
                                                        bg-${themeSett?.secondary_color}-700 text-white hover:shadow-2xl hover:opacity-90`}
                                                            onClick={fetchMoreComments}>
                                                            <BiRefresh size={18} className='mr-2' /> <span>Load More Comments</span>
                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        }

                                        {neighInfoError != "" &&
                                            <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                                {neighInfoError}
                                            </div>
                                        }
                                    </div>

                                    <div className='hidden-lg:block lg:col-span-2'>

                                        <div className='w-full mt-12 '>
                                            <RecommendedNeighborhood neighborhood_uid={neighInfo?.neighborhood_uid} />
                                        </div>

                                        <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                            <SideAds no_ads={4} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </main>

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

export default NeighborhoodDetailsVar1
