"use client"
import React, { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import CustomLinkMain from '../CustomLink';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { Helpers } from '@/_lib/helper';
import { useSearchParams } from 'next/navigation';

const helpers = new Helpers();
const BlogCategoryPills = ({ curr_cat, is_theme = false }: { curr_cat?: string, is_theme?: boolean }) => {

    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<any[]>([]);
    const [catsLoaded, setCatsLoaded] = useState<boolean>(false);
    const [catsError, setCatsError] = useState("");
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const FetchBlogPostsCats = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
        }

        const response = await window.MLS_Util.LoadBlogPostCategories(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setCategories(response.data.all_categories);
        } else {
            setCatsError(resp_message);
        }

        setCatsLoaded(true);

    }

    useEffect(() => {
        FetchBlogPostsCats();
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <div className='w-full mb-5'>
                <div className='w-full font-play-fair-display text-xl'>Categories</div>

                {!catsLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>}

                {(catsLoaded && categories) &&
                    <ul className={`w-full flex flex-wrap items-center gap-x-2.5 gap-y-3 *:rounded-full *:cursor-pointer *:px-3 *:py-2 *:text-sm *:w-fit 
                    *:font-medium *:shrink-0 *:border-${themeSett.primary_color}`}>
                        <CustomLinkMain href={`${themeSett.theme_prefix}/blog-posts?page=1`} is_theme={is_theme}
                            className={`w-fit flex items-center bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)} 
                            text-${themeSett.primary_color} hover:bg-${themeSett.primary_color} hover:text-${themeSett.primary_button_text}
                             hover:shadow-xl drop-shadow`}>
                            <span className='ml-1 flex-grow'>All Categories</span>
                        </CustomLinkMain>

                        {categories.map((cat) => (
                            <CustomLinkMain href={`${themeSett.theme_prefix}/blog-posts?ref=${cat.category_uid}&tag=${cat.name}&page=1`}
                                is_theme={is_theme} className={`w-full flex items-center drop-shadow
                                line-clamp-1 ${(curr_cat && curr_cat == cat.category_uid)
                                        ? `bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`
                                        : `bg-${helpers.adjustColorShadeByPercent(themeSett.primary_color, -40)} 
                                        text-${themeSett.primary_color} hover:bg-${themeSett.primary_color} 
                                        hover:text-${themeSett.primary_button_text} hover:shadow-xl `}`}>
                                <span className='ml-1 flex-grow line-clamp-1'>{cat.name}</span>
                            </CustomLinkMain>
                        ))
                        }
                    </ul>
                }

                {(catsLoaded && catsError != "") &&
                    <div className='col-span-full h-[250px] bg-white text-red-600 flex items-center justify-center'>
                        {catsError}
                    </div>
                }
            </div>
        )
    }
}

export default BlogCategoryPills