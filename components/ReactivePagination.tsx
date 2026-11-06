"use client"

import { RootState } from '@/app/GlobalRedux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ReactivePagination = ({ totalPage, curr_page, url_path, scroll_to, is_path = true, is_theme = false, on_click, changeTigger, trigger_loader }:
    {
        totalPage: number, curr_page: number, url_path: string, scroll_to?: string, is_path?: boolean, is_theme?: boolean,
        on_click?: (page_num: any) => void, changeTigger: React.Dispatch<React.SetStateAction<number>>,
        trigger_loader: React.Dispatch<React.SetStateAction<boolean>>
    }) => {


    const [canScroll, setCanScroll] = useState(false);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const handleClick = (loc: string, new_page_num: number) => {

        //Return early
        if (is_theme) {
            toast.dismiss();
            toast.error("Navigation is not allowed in edit mode");

            return false;
        }

        setCanScroll(true);
        if (curr_page != new_page_num) {
            trigger_loader(false);
        }
        // router.push(loc, { scroll: false });
        history.pushState({}, "", loc);
        changeTigger(new_page_num);
    }

    useEffect(() => {
        // Scroll to the target component when the component mounts
        if (canScroll) {
            const element = document.getElementById(scroll_to as string);
            if (element) {

                const rect = element.getBoundingClientRect();
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const finalOffset = rect.top + scrollTop - 180;

                window.scrollTo({
                    top: finalOffset,
                    behavior: 'smooth'
                });

            }
        }
    }, [curr_page]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <div className="w-full flex items-center justify-between py-8">
                <button disabled={curr_page <= 1}
                    onClick={() => {
                        if (is_path) {
                            handleClick(`${url_path}page=${curr_page - 1}`, curr_page - 1)
                        } else {
                            if (on_click) {
                                on_click(curr_page - 1)
                            }
                        }
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 disabled:opacity-50">
                    <BiChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                </button>

                {/* {curr_page > 1 ? (
                    <div onClick={() => {
                        if (is_path) {
                            handleClick(`${url_path}page=${curr_page - 1}`, curr_page - 1)
                        } else {
                            if (on_click) {
                                on_click(curr_page - 1)
                            }
                        }
                    }} className={prev_class}>
                        <FaArrowLeftLong size={25} />
                    </div>
                ) : (
                    <div className={`${prev_class} !cursor-not-allowed !opacity-50`}>
                        <FaArrowLeftLong size={25} />
                    </div>
                )} */}

                <div className="flex items-center gap-2">
                    {[...Array(totalPage)].map((_elem, index) => {
                        // Show first link
                        if (index === 0) {
                            return (
                                <button key={index} onClick={() => {
                                    if (is_path) {
                                        handleClick(`${url_path}page=${index + 1}`, index + 1)
                                    } else {
                                        if (on_click) {
                                            on_click(index + 1)
                                        }
                                    }
                                }} className={`w-8 h-8 rounded text-sm font-medium cursor-pointer ${curr_page === index + 1
                                    ? `bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`
                                    : `text-gray-900 hover:bg-gray-200`}`}>
                                    {index + 1}
                                </button>
                            );
                        }

                        // Show ellipsis before the last link and after the first link
                        if ((index === 1 && curr_page > 3) || (index === totalPage - 2 && curr_page < totalPage - 2)) {
                            return (
                                <div key={index} className="mx-1">...</div>
                            );
                        }

                        // Show current page link and nearby links
                        if (index === totalPage - 1 || (index >= curr_page - 3 && index <= curr_page + 1)) {
                            return (
                                <button key={index} onClick={() => {
                                    if (is_path) {
                                        handleClick(`${url_path}page=${index + 1}`, index + 1)
                                    } else {
                                        if (on_click) {
                                            on_click(index + 1)
                                        }
                                    }
                                }} className={`w-8 h-8 rounded text-sm font-medium cursor-pointer  ${curr_page === index + 1
                                    ? `bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`
                                    : `text-gray-900 hover:bg-gray-200`}`}>
                                    {index + 1}
                                </button>
                            );
                        }

                        return null; // Hide other links
                    })}
                </div>

                <button disabled={curr_page < totalPage}
                    onClick={() => {
                        if (is_path) {
                            handleClick(`${url_path}page=${curr_page + 1}`, curr_page + 1)
                        } else {
                            if (on_click) {
                                on_click(curr_page + 1)
                            }
                        }
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 disabled:opacity-50" >
                    <span>Next</span> <BiChevronRight className="w-4 h-4" />
                </button>

                {/* {curr_page < totalPage ? (
                    <div onClick={() => {
                        if (is_path) {
                            handleClick(`${url_path}page=${curr_page + 1}`, curr_page + 1)
                        } else {
                            if (on_click) {
                                on_click(curr_page + 1)
                            }
                        }
                    }} className={next_class}>
                        <FaArrowRightLong size={25} />
                    </div>
                ) : (
                    <div className={`${next_class} !cursor-not-allowed !opacity-50`}>
                        <FaArrowRightLong size={25} />
                    </div>
                )} */}
            </div>
        );
    }

}


export default ReactivePagination