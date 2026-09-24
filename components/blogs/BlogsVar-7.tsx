'use client';

import React, { useEffect, useState, useTransition } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsArrowRight, BsGear } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { Helpers } from '@/_lib/helper';
import { BiRefresh, BiSearch, BiTrash } from 'react-icons/bi';

import { useRouter, useSearchParams } from 'next/navigation';
import BlogCardVar7 from '../blog-cards/BlogCardVar-7';
import { BlogPost } from '../types';
import moment from 'moment';
import ReactivePagination from '../ReactivePagination';
import BlogCategoryPills from '../blog-cards/BlogCategoryPills';

const helpers = new Helpers();
const BlogsVar7 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

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

    const [blogs, setBlogs] = useState<any[]>([]);
    const [blogsLoaded, setBlogsLoaded] = useState<boolean>(false);
    const [blogsError, setBlogsError] = useState("");
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState(current_page);
    const [keyword, setKeyword] = useState(keyword_params);
    const [featured, setFeatured] = useState<BlogPost | null>(null);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [totalPages, setTotalPages] = useState(0)
    const [email, setEmail] = useState('')
    const [isPending, startTransition] = useTransition();

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "blogs",
                    "type": "section",
                    "component": "BlogsVar7",
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
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);


    if (themeSett) {
        return (
            <div className="min-h-screen bg-white relative">

                {/* Hero Section */}
                <section className="relative h-80 md:h-110 overflow-hidden py-35">
                    <div className="absolute top-0 w-full h-full object-cover transition-transform duration-300 !bg-cover !bg-center"
                        style={{ background: `url('${featured?.header_image_large}')` }}>
                    </div>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur--xs" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12">
                        <div className="flex items-center gap-2 mt-16 md:mt-7">
                            <span className="bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-2 w-fit rounded">Featured</span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <h1 className="text-white text-2xl md:text-4xl font-bold mb-2">{featured?.title}</h1>
                                <p className="text-gray-200 text-sm md:text-base max-w-md">
                                    {featured?.summary}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <CustomLinkMain href={`/blog-post/${featured?.slug}`} is_theme={is_theme} className={`py-1.5 px-4.5 cursor-pointer rounded transition-colors flex items-center space-x-1.5 
                                    bg-${themeSett.primary_color} text-${themeSett.primary_button_text} 
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} hover:shadow-2xl`}>
                                    <span className='text-sm'>Read More</span> <BsArrowRight className="w-6 h-6" />
                                </CustomLinkMain>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="container mx-auto max-w-[1280px] px-6 md:px-12">
                    {/* Blog Section */}
                    <section className="w-full py-12 md:py-16">
                        <div className="max-w-7xl mx-auto">
                            {/* Header */}
                            <div className='w-full flex flex-col md:flex-row justify-between items-start mb-8'>
                                <div className=' flex flex-col max-md:w-full'>
                                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                                        {raw_data.header || "Latest Real Estate News"}
                                    </h2>
                                    <p className="text-gray-700 mb-2">
                                        {raw_data.sub_header || "Stay updated with market trends and property insights"}
                                    </p>
                                </div>

                                <div className="flex gap-0 max-md:w-full">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 xl:gap-x-8 mb-12">
                                {blogs.map(post => (
                                    <BlogCardVar7 key={post.id} blog_post={post} is_theme={is_theme} />
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
                    </section>

                    <div className='w-full'>
                        <BlogCategoryPills curr_cat={category} is_theme={is_theme} />
                    </div>
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
            </div>
        )
    }
}


export default BlogsVar7