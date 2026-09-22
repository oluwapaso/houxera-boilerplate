'use client';

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsGear } from 'react-icons/bs';
import { Helpers } from '@/_lib/helper';
import { BiRefresh, BiTrash } from 'react-icons/bi';

import { useSearchParams } from 'next/navigation';
import { BlogCardVar4 } from '../blog-cards/BlogCardVar-4';
import BlogCategoryLists from '../blog-cards/BlogCategoryLists';
import SideAds from '../ads/SideAds';
import ReactivePagination from '../ReactivePagination';
import { BlogPost } from '../types';
import BlogSearch from '../blog-cards/BlogSearch';

const helpers = new Helpers();
const BlogsVar4 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

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
    const [currPage, setCurrPage] = useState(current_page);
    const [keyword, setKeyword] = useState(keyword_params);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [totalPages, setTotalPages] = useState(0)
    const [featured, setFeatured] = useState<BlogPost | null>(null);
    const [first_comp_pt, setFirstCompPt] = useState("pt-25");

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar4",
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
                setTotalPages(Math.ceil(response.data.total_records / pageSize))
            } else {
                setBlogsError(resp_message)
            }

        } catch {
            setError("Failed to load posts")
        } finally {
            setLoading(false);
            setBlogsLoaded(true);
        }
    }

    useEffect(() => {
        LoadBlogs();
    }, [window.MLS_Util]);

    useEffect(() => {
        if (blogsLoaded) {
            // Use it in your component
            const featuredPost = helpers.getFeaturedPost();
            setFeatured(() => featuredPost);
        }
    }, [blogsLoaded]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-25");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("NavVar7");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25" : "pt-40");
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
            <section className={`min-h-screen bg-gray-50 ${first_comp_pt} pb-15 relative`}>

                <main className="container mx-auto max-w-[1280px] px-4 sm:px-6">
                    {/* Hero Section */}
                    <section className="py-5">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                            {raw_data.header || "Latest Real Estate News"}
                        </h1>
                        <p className="text-gray-700">
                            {raw_data.sub_header || "Stay updated with market trends and property insights"}
                        </p>
                    </section>

                    <div className={`h-0.5 w-full my-3 bg-gradient-to-r rounded-full from-transparent 
                    via-${themeSett.primary_color} to-transparent transition-opacity duration-700 `} />

                    {/* Featured Article */}
                    {featured &&
                        <section className="py-8 ">
                            <BlogCardVar4 is_theme={is_theme} blog_post={featured} featured={true} />
                        </section>
                    }

                    <div className={`h-0.5 w-full my-3 bg-gradient-to-r rounded-full from-transparent 
                    via-${themeSett.primary_color} to-transparent transition-opacity duration-700 `} />

                    {/* Categories Sidebar & Articles Grid */}
                    <section className="pt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
                            {/* Categories */}
                            <div className="hidden lg:block lg:col-span-1">

                                <BlogSearch keyword={keyword} setKeyword={setKeyword} setBlogPostLoaded={setBlogsLoaded} />

                                <div className='w-full drop-shadow'>
                                    <BlogCategoryLists curr_cat={category} is_theme={is_theme} />
                                </div>

                                <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                    <SideAds no_ads={2} />
                                </div>
                            </div>

                            {/* Articles Grid */}
                            <div className="lg:col-span-3">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
                                    {blogs.map((post) => (
                                        <BlogCardVar4 key={post.category_uid} is_theme={is_theme} blog_post={post} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className='w-full'>
                                    {(!loading && blogsError == "" && totalPages > 0) &&
                                        <ReactivePagination totalPage={totalPages} curr_page={current_page} is_theme={is_theme}
                                            changeTigger={setCurrPage} trigger_loader={setBlogsLoaded}
                                            url_path={`/blog-posts?${category ? `ref=${category}&` : ""}`} />
                                    }
                                </div>
                            </div>
                        </div>
                    </section>

                </main>

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


export default BlogsVar4