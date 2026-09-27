import { useEffect } from "react";
import { useDispatch } from "react-redux"; 
import { togglePropertyModal } from "@/app/GlobalRedux/user/userSlice"; 

const usePropertyModal = ({ page, property_info, is_theme = {} }: any) => {

    const dispatch = useDispatch();  
    useEffect(() => {

        if (page && page !== null && property_info?.property_uid !== null) { 

                let modal_info: any = {
                    shown: true,
                    need_fetch: false,   
                    property_info: property_info,   
                    is_theme: is_theme,   
                };

                if (page === "Enquiry") {
                    modal_info = {
                        ...modal_info,
                        page: "Enquiry", 
                        title: `Make an enquiry about property #${property_info?.mls_number}`,
                    };
                } else if (page === "Tour") {
                    modal_info = {
                        ...modal_info,
                        page: "Tour",
                        title: `Schedule a tour for property #${property_info?.mls_number}`,
                    };
                } else if (page === "Share") {
                    modal_info = {
                        ...modal_info,
                        page: "Share",
                        title: `Share property #${property_info?.mls_number} with your social contacts`,
                    };
                } else if (page === "Email Share") {
                    modal_info = {
                        ...modal_info,
                        page: "Email Share",
                        title: `Share property #${property_info?.mls_number} with your email contact`,
                    };
                }

                dispatch(togglePropertyModal(modal_info));
          
        }
    }, [page]); 

    return {};
};

export default usePropertyModal;
