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
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogCardVar6 } from '../blog-cards/BlogCardVar-6';
import moment from 'moment';
import ReactivePagination from '../ReactivePagination';
import { BlogPost } from '../types';
import BlogCategoryPills from '../blog-cards/BlogCategoryPills';

const helpers = new Helpers();
const BlogsVar6 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const router = useRouter();
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const searchParams = useSearchParams();
    const pageSize = size;
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
    const [featured, setFeatured] = useState<BlogPost[] | null>(null);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [totalPages, setTotalPages] = useState(0)
    const [email, setEmail] = useState('')
    const [isPending, startTransition] = useTransition();
    const [first_comp_pt, setFirstCompPt] = useState("pt-30");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Subscribed:', email)
        setEmail('')
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar6",
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
                    const featuredPosts = response.data.all_posts.slice(0, 4);
                    localStorage.setItem('featuredPost', JSON.stringify(featuredPosts));
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
            <section className={`bg-white text-black min-h-screen relative ${first_comp_pt} pb-25`}>
                <main className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="w-full mx-auto">
                        <div className="text-center flex flex-col">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
                                {raw_data.header || "Latest Real Estate News"}
                            </h1>
                            <p className="text-gray-600 text-base sm:text-lg mb-8 text-balance">
                                {raw_data.sub_header || "Stay updated with market trends and property insights"}
                            </p>

                            {/* Search Input */}
                            <div className="flex w-full gap-0 items-center justify-center">
                                <input type="text" placeholder="Search posts..." value={keyword} name='keyword'
                                    className="px-4 py-2 h-[55px] text-gray-900 text-sm rounded-tl rounded-bl border-1 border-gray-300 
                                bg-white outline-0 w-[355px]" onChange={(e) => handleChange(e)}
                                />
                                <button className={`bg-${themeSett.primary_color} text-${themeSett.primary_button_text} px-6 py-2 text-sm 
                                    font-medium rounded-tr rounded-br hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} flex items-center 
                                    justify-center space-x-1.5 cursor-pointer h-[55px]`} onClick={handleSearch}>
                                    <BiSearch size={17} /> <span>Search</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Blog Posts */}
                    {(Array.isArray(featured) && featured.length > 0) &&
                        <section className="w-full mx-auto py-12 md:py-16">
                            <h2 className="text-2xl font-bold mb-4">Recent blog posts</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tab:gap-8">
                                {/* Featured Post - Large on Left */}
                                <div className="md:col-span-1">
                                    <BlogCardVar6 blog_post={featured[0]} is_theme={is_theme} variant="featured" />
                                </div>

                                {/* Side Posts - Stack on Right */}
                                <div className="md:col-span-2 flex flex-col gap-6">
                                    {featured.slice(1, 4).map((post) => (
                                        <BlogCardVar6 blog_post={post} is_theme={is_theme} variant="side" />
                                    ))}
                                </div>
                            </div>
                        </section>
                    }

                    {/* All Blog Posts Grid */}
                    <section className="w-full mx-auto py-12 md:py-16">
                        <h2 className="text-2xl font-bold mb-4">All blog posts</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {blogs.map((post) => (
                                <BlogCardVar6 key={post.post_uid} is_theme={is_theme} variant="grid" blog_post={post} />
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


export default BlogsVar6