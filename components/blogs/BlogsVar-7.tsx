'use client';

import React, { useEffect, useState, useTransition } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsArrowDown, BsArrowRight, BsArrowUp, BsGear } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Helpers } from '@/_lib/helper';
import BlogCardVar1 from '../blog-cards/BlogCardVar-1';
import { BiLayerPlus, BiRefresh, BiSearch, BiTrash } from 'react-icons/bi';

import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation';
import BlogCardVar7 from '../blog-cards/BlogCardVar-7';
import { BlogPost } from '../types';
import moment from 'moment';
import ReactivePagination from '../ReactivePagination';
import BlogCategoryPills from '../blog-cards/BlogCategoryPills';

const BLOG_POSTS = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'Destination',
        title: 'Unveiling the Secrets Beyond the Tourist Trails',
        date: '30 Jan 2024',
        readTime: '10 mins read',
        author: 'Seraphina Isabella',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seraphina',
        description: 'Dive into the local culture, discover hidden spots, and experience the authentic charm that often...'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
        category: 'Lifestyle',
        title: 'A Fashionista\'s Guide to Wanderlust',
        date: '29 Jan 2024',
        readTime: '6 mins read',
        author: 'Maximilian Blackthorpe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maximilian',
        description: 'Explore the intersection of fashion and travel as we uncover the essentials, fresh...'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=400&fit=crop',
        category: 'Tips & Hacks',
        title: 'Top 5 Apps and Gadgets That Will Transform Your Journeys',
        date: '26 Jan 2024',
        readTime: '15 mins read',
        author: 'Anastasia Evangeline',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia',
        description: 'Explore the latest in travel technology with our guide to must-have apps & gadgets...'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1495576066178-9349aa8aa663?w=600&h=400&fit=crop',
        category: 'Culinary',
        title: 'Savoring the World: Gastronomic Delights',
        date: '24 Jan 2024',
        readTime: '10 mins read',
        author: 'Nathaniel Regnald',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathaniel',
        description: 'Street food is often the best in dining, uncover the diverse and delectable world of...'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'Destination',
        title: 'Journey Through Time',
        date: '20 Jan 2024',
        readTime: '8 mins read',
        author: 'Percival Thaddeus',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Percival',
        description: 'Wander through ancient streets, with iconic landmarks, and immerse yourself in the tales...'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop',
        category: 'Culinary',
        title: 'Experiencing Sustainable Culinary Tourism',
        date: '18 Jan 2024',
        readTime: '8 mins read',
        author: 'Sebastian Montgomery',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sebastian',
        description: 'Join us on a sustainable culinary voyage, exploring destinations that prioritize farm-to-table...'
    },
    {
        id: 7,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
        category: 'Lifestyle',
        title: 'Navigating the Nomad\'s Lifestyle',
        date: '17 Jan 2024',
        readTime: '5 mins read',
        author: 'Arabella Serenity',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arabella',
        description: 'Dive into the world of balancing a vibrant travel lifestyle - from managing work...'
    },
    {
        id: 8,
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe3e?w=600&h=400&fit=crop',
        category: 'Tips & Hacks',
        title: '10 Essential Packing Hacks for Stress-Free Travel',
        date: '12 Jan 2024',
        readTime: '6 mins read',
        author: 'Benjamin Augustus',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin',
        description: 'Uncover the secrets to efficient packing strategies that revolutionized your travel experience...'
    },
    {
        id: 9,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'Destination',
        title: 'Adrenaline-Pumping Adventures',
        date: '10 Jan 2024',
        readTime: '10 mins read',
        author: 'Callista Gwendolyn',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Callista',
        description: 'Join us on an exploration of Adventure Destinations, where heart-pounding activities are...'
    }
];

const CATEGORIES = ['All', 'Destination', 'Culinary', 'Lifestyle', 'Tips & Hacks'];

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

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    const filteredPosts = selectedCategory === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === selectedCategory);

    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            </div>
        )
    }
}


export default BlogsVar7