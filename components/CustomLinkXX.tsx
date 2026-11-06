"use client"

import { showPageLoader } from '@/app/GlobalRedux/app/appSlice'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const CustomLinkMain = (params: any) => {

    const dispatch = useDispatch();
    const path = usePathname();

    if (params.is_theme) {
        return <div {...params} onClick={() => {
            toast.dismiss();
            toast.error("Navigation is not allowed in edit mode");
            return false;
        }}>{params.children}</div>
    }

    //console.log("usepath", usepath)
    return (
        <Link {...params} onClick={() => {
            const host = `${window.location.protocol}//${window.location.host}`;
            const curr_href = window.location.href;
            let curr_path = curr_href.replace(host, "")
            curr_path = decodeURIComponent(curr_path);

            // console.log("params.href", params.href, "path", path, "curr_href", curr_href, "curr_path", curr_path, "host", host)
            if (params.href != path && params.href != curr_path) {
                dispatch(showPageLoader());
            }
        }}>{params.children}</Link>
    )

}

export default CustomLinkMain