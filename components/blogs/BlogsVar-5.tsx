'use client';

import React, { useEffect, useState, useTransition } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Helpers } from '@/_lib/helper';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogCardVar5 from '../blog-cards/BlogCardVar-5';
import ReactivePagination from '../ReactivePagination';
import { BlogPost } from '../types';
import CustomLinkMain from '../CustomLink';
import BlogCategoryPills from '../blog-cards/BlogCategoryPills';
import { BiSearch } from 'react-icons/bi';
import moment from 'moment';


const helpers = new Helpers();
const BlogsVar5 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

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

    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [blogsLoaded, setBlogsLoaded] = useState<boolean>(false);
    const [blogsError, setBlogsError] = useState("");
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState(current_page);
    const [keyword, setKeyword] = useState(keyword_params);

    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [featured, setFeatured] = useState<BlogPost | null>(null);
    const [isPending, startTransition] = useTransition();
    const [first_comp_pt, setFirstCompPt] = useState("pt-30");

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar5",
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
            setFirstCompPt("pt-25 md:pt-30");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("NavVar7");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25" : "pt-55");
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
            <section className={`w-full bg-gray-50 min-h-screen relative ${first_comp_pt} pb-25`}>

                <main className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                    {/* Featured Section */}
                    {featured &&
                        <section className="w-full mx-auto mb-10">
                            <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden
                            !bg-cover !bg-center"
                                style={{ background: `url('${featured?.header_image_large}')` }}>

                                {/* Content */}
                                <div className="relative z-20 px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
                                    <div className="max-w-2xl">
                                        <span className="inline-block text-white text-sm font-medium mb-4 px-3 py-1 bg-white/20 rounded-full">
                                            Featured
                                        </span>
                                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                            {featured.title}
                                        </h1>
                                        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl">
                                            {featured.summary}
                                        </p>
                                        <CustomLinkMain href={`/blog-post/${featured.slug}`} is_theme={is_theme}
                                            className={`inline-flex items-center gap-2 hover:gap-3 transition-all text-sm 
                                                font-medium cursor-pointer px-4 hover:px-5 py-2 rounded
                                                bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                                            <span>Read more</span>
                                            <FaArrowRightLong size={16} />
                                        </CustomLinkMain>
                                    </div>
                                </div>

                                <div className=' absolute top-0 w-full h-full bg-black/70 backdrop-blur--lg z-10'></div>
                            </div>
                        </section>
                    }

                    {/* Blog Posts Section */}
                    <section className="w-full mx-auto">
                        <div className=' flex flex-col md:flex-row md:justify-between items-start'>
                            <div className=' flex flex-col w-full'>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                                    {raw_data.header || "Latest Real Estate News"}
                                </h2>
                                <p className="text-gray-700 mb-2">
                                    {raw_data.sub_header || "Stay updated with market trends and property insights"}
                                </p>
                            </div>

                            <div className="max-md:w-full flex gap-0">
                                <input type="text" placeholder="Search posts..." value={keyword} name='keyword'
                                    className="px-4 py-2 h-[55px] text-gray-900 text-sm rounded-tl rounded-bl border-1 border-gray-300 
                                    bg-gray-100 outline-0 max-md:grow md:w-[355px]" onChange={(e) => handleChange(e)}
                                />
                                <button className={`bg-${themeSett.primary_color} text-${themeSett.primary_button_text} px-6 py-2 text-sm 
                                font-medium rounded-tr rounded-br hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} flex items-center 
                                justify-center space-x-1.5 shrink-0 cursor-pointer h-[55px]`} onClick={handleSearch}>
                                    <BiSearch size={17} /> <span>Search</span>
                                </button>
                            </div>
                        </div>

                        {/* Blog Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-md:mt-10 mb-12">
                            {blogs.map((post) => (
                                <BlogCardVar5 is_theme={is_theme} blog_post={post} />
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
                    </section>

                    <div className='w-full'>
                        <BlogCategoryPills curr_cat={category} is_theme={is_theme} />
                    </div>
                </main>
            </section>
        )
    }
}


export default BlogsVar5