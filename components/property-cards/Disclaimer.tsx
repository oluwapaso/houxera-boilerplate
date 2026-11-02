import { RootState } from '@/app/GlobalRedux/store';
import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { useSelector } from 'react-redux';

const DisclaimerCard = ({ prop }: { prop: any }) => {

    const brker_info = useSelector((state: RootState) => state.broker);
    console.log("brker_info", brker_info)
    return (
        <div className='section w-full mt-14' id='disclaimer'>
            <div className='col-span-full'>
                <div className=' w-full bg-amber-300 text-gray-950 px-3 py-2 rounded flex flex-col text-sm'>
                    <div className='font-semibold flex items-center'>
                        <FiAlertTriangle size={14} className='mr-1 shrink-0' />
                        <span>Disclaimer</span>
                    </div>
                    <div className=''>
                        The information displayed about this property comprises a property
                        advertisement. <span className='font-medium'>{brker_info?.company_name}</span> makes no warranty as
                        to the accuracy or completeness of the advertisement or any linked or associated information,
                        and <span className='font-medium'>{brker_info?.company_name}</span> has no
                        control over the content. This property listing does not constitute property particulars.
                        The information is provided and maintained by <span className='font-medium'>{prop?.agent_info?.brokage_name}</span>. <span className='font-medium'>{brker_info?.company_name}</span> shall not in any way be held liable for the actions of any agent
                        and/or property owner/landlord on or off this website.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisclaimerCard