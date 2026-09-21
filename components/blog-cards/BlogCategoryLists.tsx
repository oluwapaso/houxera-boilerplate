"use client"
import React, { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import CustomLinkMain from '../CustomLink';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { BsArrowRight } from 'react-icons/bs';
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
const BlogCategoryLists = ({ curr_cat, is_theme = false }: { curr_cat?: string, is_theme?: boolean }) => {

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

    return (
        <div className='w-full mb-5 p-4 rounded bg-white'>
            <div className='w-full font-play-fair-display text-xl pb-2 border-b border-gray-200'>Categories</div>

            {!catsLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
            </div>}

            {(catsLoaded && categories) &&
                <ul className='w-full *:border-b *:border-gray-300 *:cursor-pointer *:px-1 *:py-3'>
                    <CustomLinkMain href={`${themeSett.theme_prefix}/blog-posts?page=1`} is_theme={is_theme}
                        className={`w-full flex items-center text-base font-normal hover:text-${themeSett.primary_button_text}  
                        hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                        <BsArrowRight size={15} /> <span className='ml-2 flex-grow'>All Categories</span>
                    </CustomLinkMain>

                    {categories.map((cat) => (
                        <CustomLinkMain href={`${themeSett.theme_prefix}/blog-posts?ref=${cat.category_uid}&tag=${cat.name}&page=1`}
                            className={`w-full flex items-center text-base font-normal hover:text-${themeSett.primary_button_text}  
                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} line-clamp-1
                            ${(curr_cat && curr_cat == cat.category_uid)
                                    ? `text-${themeSett.primary_button_text} bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`
                                    : ""}`} is_theme={is_theme}>
                            <BsArrowRight size={15} className='shrin-0' />
                            <span className='ml-2 flex-grow line-clamp-1'>{cat.name}</span>
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

export default BlogCategoryLists