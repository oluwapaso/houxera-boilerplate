'use client';

import React, { useEffect, useState, useTransition } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsArrowDown, BsArrowUp, BsGear } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Helpers } from '@/_lib/helper';
import BlogCardVar1 from '../blog-cards/BlogCardVar-1';
import { BiLayerPlus, BiRefresh, BiSearch, BiTrash } from 'react-icons/bi';

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogCardVar3 } from '../blog-cards/BlogCardVar-3';
import ReactivePagination from '../ReactivePagination';
import BlogSearch from '../blog-cards/BlogSearch';
import BlogCategoryLists from '../blog-cards/BlogCategoryLists';
import SideAds from '../ads/SideAds';
import moment from 'moment';

const helpers = new Helpers();
const BlogsVar3 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const router = useRouter();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const searchParams = useSearchParams()
    const pageSize = size
    const current_page = parseInt(searchParams?.get("page") ?? "1") || 1;
    const category = searchParams?.get("ref") ?? ""
    const keyword_params = searchParams?.get("keyword") as string || "";

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const [blogs, setBlogs] = useState<any[]>([]);
    const [blogsLoaded, setBlogsLoaded] = useState<boolean>(false);
    const [blogsError, setBlogsError] = useState("");
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [keyword, setKeyword] = useState(keyword_params);
    const [currPage, setCurrPage] = useState(current_page);
    const [isPending, startTransition] = useTransition();

    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [first_comp_pt, setFirstCompPt] = useState("pt-25 md:pt-35");

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar3",
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

    const LoadBlogs = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "size": pageSize,
            "category_uid": category,
            "keyword": keyword,
            "skip": "0",
            "fields": "*"
        }

        try {

            const response = await window.MLS_Util.LoadBlogPosts(payload);
            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {
                setBlogs(response.data.all_posts);
                setTotalPages(Math.ceil(response.data.total_records / pageSize));

                // Set featured post only on page 1
                if (currPage === 1 && response.data.all_posts.length > 0) {
                    localStorage.setItem('featuredPost', JSON.stringify(response.data.all_posts[0]));
                }

            } else {
                setBlogsError(resp_message)
            }

        } catch (e: any) {
            setBlogsError(e)
        } finally {
            setLoading(false);
            setBlogsLoaded(true);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    }

    const handleSearch = () => {
        if (keyword && keyword != "") {
            // setBlogPostLoaded(false);
            startTransition(() => {
                // dispatch(showPageLoader());
                router.push(`${themeSett.theme_prefix}/search-posts?keyword=${keyword}&version=${moment().unix()}&page=1`);
            })
        }
    }

    useEffect(() => {
        LoadBlogs();
    }, [window.MLS_Util]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-35 md:pt-52");
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

    if (themeSett) {
        return (
            <section className="min-h-screen bg-gray-100 relative">
                {/* Header */}
                <header className={`bg-${themeSett.primary_color} relative !bg-cover !bg-center ${first_comp_pt} pb-25 `}
                    style={{ background: `url('https://cdn.prod.website-files.com/65b037d6e4e7f59136c20121/66a3398f56e80252b006489a_The%20Golden%20Rule%20of%20Selling.jpg')` }}>
                    <div className="container mx-auto max-w-[1200px] px-4 relative z-20">
                        <h1 className="text-3xl md:text-4xl font-bold mb-1 text-gray-100">
                            {raw_data.header || "Latest Real Estate News"}
                        </h1>
                        <h2 className="text-2xl md:text-xl mb-6 text-gray-100">
                            {raw_data.sub_header || "Stay updated with market trends and property insights"}
                        </h2>
                        <div className="flex gap-0">
                            <input type="text" placeholder="Search posts..." value={keyword} name='keyword'
                                className="px-4 py-2 h-[55px] text-gray-900 text-sm rounded-tl rounded-bl border-2 border-r-0 border-gray-50 
                                bg-gray-100 outline-0 w-[355px]" onChange={(e) => handleChange(e)}
                            />
                            <button className={`bg-${themeSett.primary_color} text-${themeSett.primary_button_text} px-6 py-2 text-sm 
                            font-medium rounded-tr rounded-br hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} flex items-center 
                            justify-center space-x-1.5 cursor-pointer h-[55px]`} onClick={handleSearch}>
                                <BiSearch size={17} /> <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div className=' absolute top-0 w-full h-full bg-black/50 backdrop-blur-xs z-10'></div>
                </header>

                {/* Resources Grid */}
                <section className="container mx-auto max-w-[1280px] px-4 py-12">
                    <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>

                        <div className="lg:col-span-4">

                            {loading && <div className='w-full h-[250px] bg-white flex items-center justify-center'>
                                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                            </div>}

                            {/* Blog Grid */}
                            {(!loading && blogsError == "" && Array.isArray(blogs)) &&
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {blogs.map((post) => (
                                        <BlogCardVar3 key={post.category_uid} is_theme={is_theme} blog_post={post} />
                                    ))}
                                </div>
                            }

                            {/* Pagination */}
                            <div className='w-full'>
                                {(!loading && blogsError == "" && totalPages > 0) &&
                                    <ReactivePagination totalPage={totalPages} curr_page={current_page} is_theme={is_theme}
                                        changeTigger={setCurrPage} trigger_loader={setBlogsLoaded}
                                        url_path={`/blog-posts?${category ? `ref=${category}&` : ""}`} />
                                }
                            </div>
                        </div>

                        <div className='hidden lg:block lg:col-span-2'>

                            <div className='w-full drop-shadow '>
                                <BlogCategoryLists />
                            </div>

                            <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                <SideAds no_ads={2} />
                            </div>
                        </div>
                    </div>
                </section>

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


export default BlogsVar3