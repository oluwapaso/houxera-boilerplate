'use client';

import React from 'react';
import { BlogPost } from '../types';
import moment from 'moment';
import CustomLinkMain from '../CustomLink';

export default function BlogCardVar7({ blog_post, is_theme }: { blog_post: BlogPost, is_theme: boolean }) {

    var { post_uid, company_uid, title, slug, category_uid, category_name, summary, post_body, header_image_large, header_image_small,
        clicks, views, comments, channels, date_added, } = blog_post

    header_image_large = header_image_large ? header_image_large : "../no-image-found.jpg"

    return (
        <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme} className="flex flex-col">
            {/* Image Container */}
            <div className="relative mb-4 overflow-hidden">
                <div className="w-full aspect-[5/4] sm:aspect-[4/2] md:aspect-[5/3] object-cover transition-transform duration-300 !bg-cover !bg-center"
                    style={{ background: `url('${header_image_large}')` }}>
                </div>
                {/* Category Tag */}
                <div className="absolute top-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm rounded text-white text-xs px-2.5 py-1">
                        {category_name}
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1">
                {/* Meta Info */}
                <div className="text-xs text-gray-600 mb-2 flex items-center space-x-1.5">
                    <span>{moment(date_added).format("Do MMM, YYYY")}</span>
                    <span>•</span>
                    <span className=' flex items-center space-x-1.5'>
                        <span className='font-medium'>Views:</span>
                        <span>{views}</span>
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-gray-700 cursor-pointer transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                    {summary}
                </p>
            </div>
        </CustomLinkMain>
    );
}