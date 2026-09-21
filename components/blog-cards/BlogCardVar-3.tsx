'use client';

import CustomLinkMain from "../CustomLink";
import { BlogPost } from "../types";

export function BlogCardVar3({ blog_post, is_theme }: { blog_post: BlogPost, is_theme: boolean }) {

    var { post_uid, company_uid, title, slug, category_uid, category_name, summary, post_body, header_image_large, header_image_small,
        clicks, views, comments, channels, date_added, } = blog_post

    header_image_large = header_image_large ? header_image_large : "../no-image-found.jpg"
    const tags = ["Abuja", "Rentals", "Short-let"]
    return (
        <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme}
            className="bg-white drop-shadow hover:drop-shadow-xl cursor-pointer">
            <div className="relative w-full aspect-[3/2] sm:aspect-[4/2] md:aspect-[3/2] overflow-hidden !bg-cover !bg-center 
            border-b border-gray-300" style={{ background: `url('${header_image_large}')` }}>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-xs text-gray-600 mb-4 line-clamp-3">
                    {summary}
                </p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </CustomLinkMain>
    )
}
