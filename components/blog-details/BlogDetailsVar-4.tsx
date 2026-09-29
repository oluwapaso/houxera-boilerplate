"use client"

import { Helpers } from '@/_lib/helper';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import CommentBox from '@/components/blog-cards/CommentBox';
import CommentCardVar2 from '@/components/blog-cards/CommentCardVar-2';
import RelatedBlogPosts from '@/components/blog-cards/RelatedBlogPosts';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
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
import BlogCategoryPills from '../blog-cards/BlogCategoryPills';
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { GiChatBubble, GiEggEye, GiFlame } from 'react-icons/gi';
import BlogSearch from '../blog-cards/BlogSearch';
import BlogCategoryLists from '../blog-cards/BlogCategoryLists';

const helpers = new Helpers();
const BlogDetailsVar4 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const slug = params?.slug as string || "rising-building-material-costs-threaten-real-estate-project-viability"; //Hard coaded part is for testing only
    const router = useRouter();

    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [page_url, setPageURL] = useState("");

    const [blogPost, setBlogPost] = useState<any>({});
    const [blogPostLoaded, setBlogPostLoaded] = useState<boolean>(false);
    const [blogPostError, setBlogPostError] = useState("");

    const [blogPostComm, setBlogPostComm] = useState<any[]>([]);
    const [blogPostCommLoaded, setBlogPostCommLoaded] = useState<boolean>(false);
    const [blogPostCommError, setBlogPostCommError] = useState("");

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
    const [is_menu_shown, setIsMenuShown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
                    "category": "blog_details",
                    "type": "section",
                    "component": "BlogDetailsVar3",
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
                component_type: "Blog Posts"
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
        setModalChildren(<ReplyComment closeModal={closeModal} item_type="Blog Post" item_uid={blogPost.post_uid} comment_uid={comment_uid}
            setRepToAppend={setRepToAppend} setNoComms={setNoComms} />);
        setShowModal(true);

        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "hidden";
        }
    }

    const LoadBlogsDetails = async () => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "slug": slug,
            "user_uid": user.user_info?.user_uid,
        }

        const response = await window.MLS_Util.LoadBlogPostDetails(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setBlogPost(response.data.blog_post);
            setNoComms(response.data?.blog_post?.comments);
        } else {
            setBlogPostError(resp_message)
        }

        setBlogPostLoaded(true);

    }

    const LoadBlogsComments = async (skip: number) => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "post_uid": blogPost.post_uid,
            "skip": skip || 0,
            "size": 20,
        }

        const response = await window.MLS_Util.LoadBlogPostComments(payload);
        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {

            setBlogPostComm((prev_comm: any[]) => [...prev_comm, ...response.data?.comments]);
            dispatch(hidePageLoader());
            setHasMore(response.data?.has_more);
            setSkip(skip);

        } else {
            setBlogPostCommError(resp_message);
            setHasMore("No");
        }

        setBlogPostCommLoaded(true);

    }

    const fetchMoreComments = async () => {
        const new_skip = skip + 1;
        LoadBlogsComments(new_skip);
    }

    useEffect(() => {
        LoadBlogsComments(0);
    }, [blogPost]);

    useEffect(() => {

        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadBlogsDetails();
        }

    }, [window.MLS_Util]);

    useEffect(() => {
        setPageURL(`${window.location.href}/blog-post/${slug}`);
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        if (rep_to_append) {
            setBlogPostCommLoaded(false);

            const to = setTimeout(() => {
                setBlogPostComm((prev_comm: any[]) => [rep_to_append, ...prev_comm]);
                setBlogPostCommLoaded(true);
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

    //Initialize Ads
    useEffect(() => {
        if (window.MLS_Util) {
            const to = setTimeout(() => {
                window.MLS_Util.InitializeSideAds();
            }, 1500);

            return () => clearTimeout(to);
        }
    }, [window.MLS_Util]);

    const crumb = <div className='font-play-fair-display text-4xl !text-white'>
        {
            blogPostLoaded ? (
                blogPost ? (
                    blogPost.title
                ) : ""
            ) : ""
        }
    </div>;

    const no_comm_added = <div className='p-10 mt-2 text-red-600 flex flex-col justify-center items-center min-h-6'>
        <div className='w-full text-center'>No comment added yet. Be the first to leave a comments.</div>
    </div>

    if (Array.isArray(blogPostComm)) {

        if (blogPostComm.length > 0) {

            all_comments = blogPostComm.map((comm) => {
                return (<CommentCardVar2 key={comm.comment_uid} comm={comm} handleReply={handleReply} />)
            })

        } else {

            //Making sure request has been sent
            if (blogPostCommLoaded) {
                all_comments[0] = no_comm_added
            } else {
                all_comments[0] = <div className='w-full flex justify-center items-center min-h-60'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>
            }

        }

    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const share_title = `Check out this article i found on ${process.env.NEXT_PUBLIC_CHANNEL_WEBSITE}`;

    if (themeSett && themeSett != null) {
        return (
            <div className="min-h-screen bg-gray-100 relative py-35">

                <div className='w-full h-[45dvh] grid grid-cols-2 gap-0 relative'>

                    {/* Empty space */}
                    <div></div>

                    {/* Hero image */}
                    <div className=" col-span-1 w-full mx-auto h-full flex flex-col justify-end object-cover"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(blogPost.header_image_large && blogPost.header_image_large != "")
                                ? `../../${blogPost?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>
                    </div>

                    <div className='w-full h-full absolute flex items-center justify-center'>
                        <div className='mx-auto w-[75%] flex flex-col items-start justify-center h-full'>
                            <h1 className=" w-full text-4xl font-semibold leading-snug text-gray-900 sm:text-3xl">
                                <span className="bg-white leading-13 px-2 py-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                                    {blogPost.title}
                                </span>
                            </h1>

                            <div className=' flex w-full space-x-3 *:bg-white *:px-4 *:py-2 *:rounded *:flex *:items-center'>
                                <div className='space-x-1.5'>
                                    <BiCalendarEvent size={15} />
                                    <span className='text-sm font-semibold'>{moment(blogPost.date_added).format("Do MMM, YYYY")}</span>
                                </div>

                                <div className='space-x-1.5'>
                                    <BsEye size={15} />
                                    <span className='text-sm font-semibold'>{blogPost.views}</span>
                                </div>

                                <div className='space-x-1.5'>
                                    <GiChatBubble size={15} />
                                    <span className='text-sm font-semibold'>{blogPost.comments}</span>
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
                            {blogPostError == "" &&
                                <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100 sm:p-8">
                                    <span className="inline-block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        <span>Category:</span> <span className={`text-${themeSett.primary_color}`}>{blogPost?.category_name}</span>
                                    </span>


                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">

                                        <div className="text-sm flex space-x-2">
                                            <p className="font-medium flex items-center space-x-1.5">
                                                <span className="font-medium text-gray-900">Posted On:</span>
                                                <span className=' text-gray-600'>{moment(blogPost.date_added).format("Do MMM, YYYY")}</span>
                                            </p>
                                            <span>•</span>
                                            <p className="font-medium flex items-center space-x-1.5">
                                                <span className="font-medium text-gray-900">Views:</span>
                                                <span className=' text-gray-600'>{blogPost.views}</span>
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
                                        <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: blogPost.post_body }} />
                                    </div>
                                </div>
                            }

                            {(blogPostLoaded && blogPostError == "") &&
                                <div className='w-full max-w-[900px] mt-16 flex flex-col'>

                                    <div className='w-full font-semibold text-2xl'>Leave a Comment </div>
                                    <CommentBox item_type="Blog Post" item_uid={blogPost?.post_uid} setRepToAppend={setRepToAppend}
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

                            {blogPostError != "" &&
                                <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                    {blogPostError}
                                </div>
                            }
                        </div>

                        <div className='hidden lg:block lg:col-span-2'>
                            <BlogSearch keyword={keyword} setKeyword={setKeyword} setBlogPostLoaded={setBlogPostLoaded} />

                            {(blogPostLoaded && blogPost) &&
                                <div className='w-full'>
                                    <BlogCategoryLists curr_cat={blogPost.category_name} />
                                </div>
                            }

                            {(blogPostLoaded && blogPost) &&
                                <div className='w-full mt-12'>
                                    <RelatedBlogPosts category_name={blogPost.category_name} post_uid={blogPost.post_uid} />
                                </div>
                            }

                            <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                <SideAds no_ads={4} />
                            </div>
                        </div>
                    </div>

                    {/* <div className='w-full'>
                        <BlogCategoryPills curr_cat={blogPost.category_name} />
                    </div>

                    {(blogPostLoaded && blogPost) &&
                        <div className='w-full mt-12'>
                            <RelatedBlogPosts variation='grid' is_theme={is_theme} category_name={blogPost.category_name} post_uid={blogPost.post_uid} />
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
