'use client';

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsArrowRight, BsGear } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { Helpers } from '@/_lib/helper';
import { BiRefresh, BiTrash } from 'react-icons/bi';

import { useSearchParams } from 'next/navigation';
import { BlogCardVar2 } from '../blog-cards/BlogCardVar-2';
import BlogCategoryLists from '../blog-cards/BlogCategoryLists';
import BlogSearch from '../blog-cards/BlogSearch';
import SideAds from '../ads/SideAds';
import { BlogPost } from '../types';
import ReactivePagination from '../ReactivePagination';

const helpers = new Helpers();
const BlogsVar2 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const searchParams = useSearchParams();
    const pageSize = size;
    const current_page = parseInt(searchParams?.get("page") ?? "1") || 1;
    const category = searchParams?.get("ref") ?? "";
    const keyword_params = searchParams?.get("keyword") as string || "";

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [featured, setFeatured] = useState<BlogPost | null>(null);
    const [blogsLoaded, setBlogsLoaded] = useState<boolean>(false);
    const [blogsError, setBlogsError] = useState("");
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [keyword, setKeyword] = useState(keyword_params);
    const [currPage, setCurrPage] = useState(current_page);
    const [first_comp_pt, setFirstCompPt] = useState("pt-25");

    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar2",
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
            setFirstCompPt("pt-40");
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
            <section className={`min-h-screen bg-background text-foreground relative ${first_comp_pt} pb-35`}>

                <div className=' container mx-auto max-w-[1280px] flex flex-col space-y-10 px-3'>
                    {/* Featured Section */}
                    <section className="w-full">
                        <div className="relative rounded-xl shadow-xl overflow-hidden h-96 sm:h-96 lg:h-96 !bg-cover !bg-center"
                            style={{ background: `url('${featured?.header_image_large}')` }}>

                            {/* Overlay and Content */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6 sm:p-8 lg:p-12">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4">
                                        Featured
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                        {featured?.title}
                                    </h1>
                                    <p className="text-sm sm:text-base text-white/90 max-w-2xl line-clamp-3">
                                        {featured?.summary}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <CustomLinkMain href={`/blog-post/${featured?.slug}`} is_theme={is_theme} className={`py-1.5 px-4.5 cursor-pointer rounded transition-colors flex items-center space-x-1.5 
                                       bg-${themeSett.primary_color} text-${themeSett.primary_button_text} 
                                       hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} hover:shadow-2xl`}>
                                        <span className='text-sm'>Read More</span> <BsArrowRight className="w-6 h-6" />
                                    </CustomLinkMain>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>
                        {/* Blog Posts Section */}
                        <div className='lg:col-span-4'>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-2">
                                Recent blog posts
                            </h2>

                            {loading && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                            </div>}

                            {/* Blog Grid */}
                            {(!loading && blogsError == "" && Array.isArray(blogs)) &&
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                                    {blogs.map((post) => (
                                        <BlogCardVar2 key={post.category_uid} is_theme={is_theme} blog_post={post} />
                                    ))}
                                </div>
                            }

                            {/* Pagination */}
                            {(!loading && blogsError == "" && totalPages > 0) &&
                                <ReactivePagination totalPage={totalPages} curr_page={current_page} is_theme={is_theme}
                                    changeTigger={setCurrPage} trigger_loader={setBlogsLoaded}
                                    url_path={`/blog-posts?${category ? `ref=${category}&` : ""}`} />
                            }

                            {/* Error message  */}
                            {!loading && blogsError != "" &&
                                <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                    {blogsError}
                                </div>
                            }
                        </div>

                        <div className='hidden lg:block lg:col-span-2'>

                            <BlogSearch keyword={keyword} setKeyword={setKeyword} setBlogPostLoaded={setBlogsLoaded} />

                            <div className='w-full'>
                                <BlogCategoryLists curr_cat={category} is_theme={is_theme} />
                            </div>

                            <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                <SideAds no_ads={2} />
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


export default BlogsVar2