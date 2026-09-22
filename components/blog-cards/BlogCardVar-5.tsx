'use client';

import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import moment from 'moment';
import CustomLinkMain from '../CustomLink';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function BlogCardVar5({ blog_post, is_theme }: { blog_post: BlogPost, is_theme: boolean }) {

    var { post_uid, company_uid, title, slug, category_uid, category_name, summary, post_body, header_image_large, header_image_small,
        clicks, views, comments, channels, date_added, } = blog_post

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    header_image_large = header_image_large ? header_image_large : "../no-image-found.jpg"

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme} className="bg-white rounded-lg 
            overflow-hidden drop-shadow-md hover:drop-shadow-xl transition-shadow duration-300 cursor-pointer">
                {/* Image Container */}
                <div className="w-full aspect-[5/4] sm:aspect-[4/2] md:aspect-[5/3] overflow-hidden bg-gray-200">
                    <div className="relative w-full h-full object-cover hover:scale-105 transition-transform duration-300 
                    !bg-cover !bg-center"
                        style={{ background: `url('${header_image_large}')` }}>
                    </div>
                </div>

                {/* Content Container */}
                <div className="px-3 sm:px-6 py-5">
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-gray-700 transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                        {summary}
                    </p>

                    <div className={`h-0.5 w-full my-6 bg-gradient-to-r rounded-full from-transparent 
                        via-${themeSett.primary_color} to-transparent transition-opacity duration-700 `} />

                    {/* Author and Date */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 ">
                        <span className="font-medium text-gray-700 flex items-center space-x-1.5">
                            <span className="font-medium">Views:</span> <span>{views}</span>
                        </span>
                        <span className="mx-1">•</span>
                        <span>{moment(date_added).format("Do MMM, YYYY")}</span>

                        <div className={`inline-flex justify-self-end ml-auto items-center gap-2 hover:gap-3 transition-all text-xs 
                            font-medium cursor-pointer px-2.5 py-1.5 rounded bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                            <span>Read</span>
                            <FaArrowRightLong size={14} />
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        );
    }
}