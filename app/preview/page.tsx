'use client';

import { useSearchParams } from 'next/navigation';
import PageRenderer from '@/components/PageRenderer';
import { useEffect, useRef, useState } from 'react';
import { APIResponseProps } from '@/components/types';
import { useDispatch } from 'react-redux';
import { updateThemeSettings } from '../GlobalRedux/theme/themeSlice';
import { getComponent } from '@/components/registry';

export const dynamic = 'force-dynamic';   // This forces fresh data on every request (no caching) 

const LivePreviewPage = () => {

    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const company_id = searchParams?.get("company_id") as string || "";
    const agent_id = searchParams?.get("agent_id") as string || "";
    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const theme_uid = searchParams?.get("theme_uid") as string || "";
    const access_token = searchParams?.get("access_token") as string || "";
    const page_uid = searchParams?.get("page_uid") as string || "";

    const [pageData, setPageData] = useState<any>(null);
    const [themeData, setThemeData] = useState<any>({});
    const [theme_data_fetched, setThemeDataFetched] = useState(false);

    // Track whether we're embedded in the editor and have received a live push yet,
    // so we don't flash/overwrite live-edited state with a stale fetch.
    const hasReceivedLiveUpdate = useRef(false);

    const DoneRendering = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            { type: 'DONE_RENDERING' },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const RequestPageData = () => {
        // Ask the parent (editor) for the current in-memory data, in case
        // it already has newer state than what's persisted on the server.
        window.parent.postMessage(
            { type: 'REQUEST_PAGE_DATA' },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    useEffect(() => {
        const fetchThemeInfo = async () => {

            try {

                let fields = ["*"]
                var payload = {
                    "access_token": access_token, //Required 
                    "company_id": company_id,
                    "user_id": agent_id,
                    "company_uid": company_unique_id,
                    "theme_uid": theme_uid,
                    "fields": fields,
                    "kind": "Published"
                };

                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
                await fetch(`${apiBaseUrl}/api/v1/protected/themes/idx-theme`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify(payload),
                    'credentials': 'include',
                }).then((resp): Promise<APIResponseProps> => {
                    return resp.json();
                }).then(reqResp => {

                    // If a live update already arrived from the parent editor while
                    // this fetch was in flight, don't clobber it with stale server data.
                    if (hasReceivedLiveUpdate.current) return;

                    if (reqResp.success) {

                        setThemeData(reqResp.data?.theme);
                        setThemeDataFetched(true);
                        dispatch(updateThemeSettings(reqResp.data?.theme?.theme_settings));
                        setPageData(() => reqResp.data?.theme?.theme_settings?.pages[page_uid]);
                        // buildPageList(reqResp.data?.theme?.theme_settings?.pages);

                    } else {
                        let msg = reqResp.message;
                        if (Array.isArray(reqResp.message)) {
                            msg = msg.toString();
                        }
                    }

                }).catch((error: any) => {
                    console.log(error);
                });

            } catch (e: any) {
                console.log(e);
            } finally {
                setThemeDataFetched(true);
            }

        }

        if (theme_uid && theme_uid != "") {
            fetchThemeInfo();
        }

    }, [theme_uid]);

    // Listen for live pushes from the parent editor window.
    useEffect(() => {
        const handleParentMessage = (event: MessageEvent) => {
            // In production, verify event.origin against your editor's origin here.
            if (!event.data || typeof event.data !== 'object') return;

            if (event.data.type === 'UPDATE_PAGE_DATA') {
                hasReceivedLiveUpdate.current = true;

                const { themeSettings, pageUid } = event.data;

                if (!themeSettings) return;

                setThemeData((prev: any) => ({
                    ...prev,
                    theme_settings: themeSettings,
                }));
                dispatch(updateThemeSettings(themeSettings));
                setPageData(themeSettings?.pages?.[pageUid || page_uid]);
                setThemeDataFetched(true);
            }
        };

        window.addEventListener('message', handleParentMessage);
        return () => window.removeEventListener('message', handleParentMessage);
    }, [page_uid, dispatch]);

    useEffect(() => {
        DoneRendering();
        // Ask the parent for current data immediately — if the parent has
        // newer in-memory state than the server, this avoids a double-render
        // (stale fetch result, then correct pushed data).
        RequestPageData();
    }, []);

    if (themeData && pageData) {

        // Extract nav and footer from the new object structure
        const navBlock = themeData.theme_settings?.nav_component;
        const footerBlock = themeData.theme_settings?.footer_component;
        const sections = pageData?.sections;

        var NavComponent = null;
        var NavFound = false;

        for (var i = 0; i < sections.length; i++) {
            if (["HeaderVar1", "HeaderVar2"].includes(sections[i].type)) {
                NavFound = true;
                break;
            }
        }

        // If there is no other componet with Navs in the sections
        if (!NavFound) {
            // Get the actual component
            NavComponent = getComponent(navBlock?.type);
        }

        const FooterComponent = getComponent(footerBlock?.type);

        return <div className="flex flex-col min-h-screen">

            {/* Dynamic Nav */}
            {(NavComponent && (pageData?.slug != "/login" && pageData?.slug != "/register" && pageData?.slug != "/forgot-password"
                && pageData?.slug != "/reset-password"))
                ? (<NavComponent {...(navBlock?.props || {})} is_theme={true} transparent={true} />)
                : null
            }

            <main className="w-full">
                <PageRenderer data={pageData} is_theme={true} />
            </main>

            {/* Dynamic Footer */}
            {(FooterComponent && (pageData?.slug != "/login" && pageData?.slug != "/register" && pageData?.slug != "/forgot-password"
                && pageData?.slug != "/reset-password"))
                ? (<FooterComponent {...(footerBlock?.props || {})} is_theme={true} />)
                : null
            }

            {
                /*{NavComponent ? (<NavComponent {...(navBlock?.props || {})} is_theme={true} transparent={true} />) : (
                    <nav className="h-20 bg-gray-900 flex items-center justify-center text-white">
                        Nav Component Not Found
                    </nav>
                )}*/
            }
        </div>
    }
}

export default LivePreviewPage