'use client';

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsArrowDown, BsArrowUp, BsGear } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Helpers } from '@/_lib/helper';
import BlogCardVar1 from '../blog-cards/BlogCardVar-1';
import { BiLayerPlus, BiRefresh, BiTrash } from 'react-icons/bi';
import { useSearchParams } from 'next/navigation';
import ReactivePagination from '../ReactivePagination';

const helpers = new Helpers();
const BlogsVar1 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const searchParams = useSearchParams();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const pageSize = size;
    const current_page = parseInt(searchParams?.get("page") ?? "1") || 1;
    const category = searchParams?.get("ref") ?? "";
    const keyword_params = searchParams?.get("keyword") as string || "";

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const [keyword, setKeyword] = useState(keyword_params);
    const [currPage, setCurrPage] = useState(current_page);

    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const [blogs, setBlogs] = useState<any[]>([]);
    const [blogsLoaded, setBlogsLoaded] = useState<boolean>(false);
    const [blogsError, setBlogsError] = useState("");
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [first_comp_pt, setFirstCompPt] = useState("pt-25 md:35");

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar1",
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
            "category_uid": category,
            "keyword": keyword,
            "size": pageSize,
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
            setBlogsError("Failed to load posts")
        } finally {
            setBlogsLoaded(true);
            setLoading(false);
        }

    }

    useEffect(() => {
        LoadBlogs();
    }, [window.MLS_Util]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-52");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("NavVar7");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25 md:35" : "pt-54");
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
            <section className={`w-full ${first_comp_pt} pb-15 px-3 md:px-0 flex justify-center bg-gray-100 relative`}>
                <div className={`container flex flex-col `}>

                    <div className=' flex flex-col'>
                        <div className='font-semibold text-2xl md:text-3xl flex items-center justify-between'>
                            <div>{raw_data.header || "Latest Real Estate News"}</div>
                            {raw_data?.show_more == "Yes" &&
                                <CustomLinkMain href={`${themeSett.theme_prefix}/blog-posts?page=1`} is_theme={is_theme}
                                    className={`hidden target:block px-3 py-2 md:px-7 md:py-4 text-sm bg-white border-2 border-${themeSett.primary_color} flex 
                                    items-center justify-center hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} 
                                    text-${themeSett.primary_color} hover:text-white cursor-pointer rounded space-x-2.5 
                                    hover:shadow-2xl`}>
                                    <span>{raw_data?.show_more_text || 'Read Our Blog'}</span>
                                    <FaArrowRightLong size={18} />
                                </CustomLinkMain>
                            }
                        </div>
                        <div className='font-medium text-lg'>
                            {raw_data.sub_header || "Stay up to date with the latest happenings in the real estate market."}
                        </div>
                    </div>

                    <div className='w-full'>
                        {!blogsLoaded && <div className='col-span-full h-[250px] flex items-center justify-center'>
                            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                        </div>}

                        {(blogsLoaded && blogsError != "") &&
                            <div className='col-span-full h-[250px text-red-600 flex items-center justify-center'>
                                {blogsError}
                            </div>
                        }

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 
                        lg:gap-x-6 xl:gap-x-6 mt-6 mb-10'>
                            {(blogsLoaded && Array.isArray(blogs) && blogs.length > 0) &&
                                (blogs.map((blog_post, index) => {
                                    return <BlogCardVar1 key={index} blog_post={blog_post} is_theme={is_theme} />
                                }))
                            }
                        </div>

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
                </div>

                {is_theme && (
                    <div className='absolute z-[1000] right-1.5 top-2 space-x-2 flex items-center justify-end 
                    *:bg-gray-800 *:text-white *:flex *:items-center *:justify-center *:p-2 *:rounded *:cursor-pointer'>

                        <div id='editor_settings' className='hover:shadow-2xl relative group' onClick={() => handleCompPickerClick("APPEND_SECTION")}
                            onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiLayerPlus size={17} />

                            <span className='absolute hidden group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Add new section after
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsGear size={17} />

                            <span className='absolute hidden group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Section settings
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REPLACE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiRefresh size={17} />

                            <span className='absolute hidden group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Replace Section
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiTrash size={17} />

                            <span className='absolute hidden right-0 w-fit group-hover:inline-block whitespace-nowrap bottom-full px-2 
                                py-2 rounded bg-gray-800 text-white text-xs'>
                                Remove Section Down
                            </span>
                        </div>

                    </div>
                )}
            </section>
        )
    }
}


export default BlogsVar1