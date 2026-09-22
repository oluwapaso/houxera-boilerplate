'use client';

import { BsArrowUpRight } from 'react-icons/bs'
import { BlogPost } from '../types'
import moment from 'moment';
import CustomLinkMain from '../CustomLink';

export function BlogCardVar6({ blog_post, is_theme, variant }: { blog_post: BlogPost, is_theme: boolean, variant: string }) {

    var { post_uid, company_uid, title, slug, category_uid, category_name, summary, post_body, header_image_large, header_image_small,
        clicks, views, comments, channels, date_added, } = blog_post

    header_image_large = header_image_large ? header_image_large : "../no-image-found.jpg"

    const tags = ["Abuja", "Rentals", "Short-let"]
    if (variant === 'featured') {
        return (
            <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme} className="group cursor-pointer">
                <div className="space-y-4">
                    <div className="relative aspect-[1/1] sm:aspect-[4/2] md:aspect-[1/1] w-full overflow-hidden rounded-lg bg-gray-200">
                        <div className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 !bg-cover !bg-center"
                            style={{ background: `url('${header_image_large}')` }}>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600 flex items-center space-x-1.5">
                            <span>{moment(date_added).format("Do MMM, YYYY")}</span>
                            <span>•</span>
                            <span className=' flex items-center space-x-1.5'>
                                <span className='font-medium'>Views:</span>
                                <span>{views}</span>
                            </span>
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold text-black group-hover:underline group-hover:text-sky-700">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-700">{summary}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 text-xs border border-gray-300 rounded-full text-gray-700
                                 hover:bg-gray-100 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        )
    }

    if (variant === 'side') {
        return (
            <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme} className="group flex flex-col gap-3 cursor-pointer">
                <div className="flex gap-3 flex-col xs:flex-row">
                    <div className="relative w-full xs:w-32 h-44 xs:h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                        <div className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 !bg-cover !bg-center"
                            style={{ background: `url('${header_image_large}')` }}>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-600 flex items-center space-x-1.5">
                                <span>{moment(date_added).format("Do MMM, YYYY")}</span>
                                <span>•</span>
                                <span className=' flex items-center space-x-1.5'>
                                    <span className='font-medium'>Views:</span>
                                    <span>{views}</span>
                                </span>
                            </p>
                            <h3 className="text-sm sm:text-base font-bold text-black group-hover:underline line-clamp-2 group-hover:text-sky-700">
                                {title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{summary}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs border border-gray-300 rounded-full text-gray-700 
                                hover:bg-gray-100 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        )
    }

    // Grid variant (default)
    return (
        <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme} className="group cursor-pointer">
            <div className="space-y-3">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-200">
                    <div className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 !bg-cover !bg-center"
                        style={{ background: `url('${header_image_large}')` }}>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs text-gray-600 flex items-center space-x-1.5">
                        <span>{moment(date_added).format("Do MMM, YYYY")}</span>
                        <span>•</span>
                        <span className=' flex items-center space-x-1.5'>
                            <span className='font-medium'>Views:</span>
                            <span>{views}</span>
                        </span>
                    </p>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-black group-hover:underline flex-1 group-hover:text-sky-700">
                            {title}
                        </h3>
                        <BsArrowUpRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{summary}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs border border-gray-300 rounded-full 
                            text-gray-700 hover:bg-gray-100 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </CustomLinkMain>
    )
}
