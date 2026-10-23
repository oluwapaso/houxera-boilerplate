import Image from 'next/image'
import React from 'react'
import CustomLinkMain from './CustomLink'
import { BiChevronRight, BiPhoneCall } from 'react-icons/bi'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa6'

const Footer = () => {
    return (
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center pt-28 bg-footer-primary-bg overflow-hidden">
            <div className=" container mx-auto max-w-[1200px]">
                <div className="w-full grid grid-cols-3 gap-10">
                    <div className=" flex flex-col gap-y-3">
                        <div>
                            <Image src={`/logo-light.png`} height={50} width={150} className="" alt="Nigeria MLS and IDX provider" />
                        </div>

                        <div className=" leading-8 text-gray-200 mt-3">
                            Excellence decisively nay man yet impression for contrasted remarkably. There spoke happy for you are out.
                            Fertile how old address did showing.
                        </div>
                    </div>

                    <div className=" grid grid-cols-2 gap-4 text-gray-200">
                        <div className=" flex flex-col">
                            <div className="font-bold text-xl text-white">Quick LInk</div>
                            <div className=" flex flex-col mt-8 space-y-4 font-thin *:flex *:items-center *:space-x-2">
                                <CustomLinkMain href={`/`} className=" hover:border-b-green-400 transition-all ease-in hover:delay-150">
                                    <BiChevronRight size={20} className="" /> <span>Home</span>
                                </CustomLinkMain>
                                <CustomLinkMain href={`/contact-us`} className=" hover:border-b-green-400 transition-all ease-in hover:delay-150">
                                    <BiChevronRight size={20} className="" /> <span>About RaR</span>
                                </CustomLinkMain>
                            </div>
                        </div>

                        <div className=" flex flex-col">
                            <div className="font-bold text-xl text-white opacity-0">-</div>
                            <div className=" flex flex-col mt-8 space-y-4 font-thin *:flex *:items-center *:space-x-2">
                                <CustomLinkMain href={`/terms`} className=" hover:border-b-green-400 transition-all ease-in hover:delay-150">
                                    <BiChevronRight size={20} className="" /> <span>Terms of Use</span>
                                </CustomLinkMain>
                                <CustomLinkMain href={`/privacy-policy`} className=" hover:border-b-green-400 transition-all ease-in hover:delay-150">
                                    <BiChevronRight size={20} className="" /> <span>Privacy Policy</span>
                                </CustomLinkMain>
                            </div>
                        </div>
                    </div>


                    <div className=' relative after:bg-footer-secondary-bg after:absolute after:w-[500%]
                     after:-top-40 after:h-[300%] after:z-1 after:-left-[30px] '>
                        <div className="w-full flex flex-col text-gray-200 relative z-2 pl-8">
                            <div className="font-bold text-xl text-white">Contact Info</div>
                            <div className="w-full flex flex-col mt-8 space-y-6 font-thin *:flex *:items-start *:space-x-4">


                                <div className='w-full !space-x-4'>
                                    <div className=' size-14 rounded-full flex justify-center items-center shrink-0 
                                    bg-footer-primary-bg/50 border border-dashed border-green-600 p-0 m-0'>
                                        <FaMapMarkerAlt size={25} className=" relative z-10  " />
                                    </div>
                                    <div className=' grow flex flex-col space-y-1'>
                                        <div className='font-medium text-lg'>Address</div>
                                        <div>5919 Trussville Crossings</div>
                                        <div>Pkwy, Birmingham</div>
                                    </div>
                                </div>


                                <div className='w-full !space-x-4'>
                                    <div className=' size-14 rounded-full flex justify-center items-center shrink-0 
                                    bg-footer-primary-bg/50 border border-dashed border-green-600 p-0 m-0'>
                                        <FaEnvelope size={25} className=" relative z-10 " />
                                    </div>
                                    <div className=' grow flex flex-col space-y-1'>
                                        <div className='font-medium text-lg'>Email</div>
                                        <div>contact@naijamlshub.com</div>
                                    </div>
                                </div>


                                <div className='w-full !space-x-4'>
                                    <div className=' size-14 rounded-full flex justify-center items-center shrink-0 
                                    bg-footer-primary-bg/50 border border-dashed border-green-600 p-0 m-0'>
                                        <BiPhoneCall size={25} className=" relative z-10 " />
                                    </div>
                                    <div className=' grow flex flex-col space-y-1'>
                                        <div className='font-medium text-lg'>Phone</div>
                                        <div>+234-8062-744-512</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <div className='w-full bg-red border-t border-footer-secondary-bg py-8 text-gray-200'>
                <div className=" container mx-auto max-w-[1200px] font-normal">
                    &copy; Copyright 2025. All Rights Reserved
                    by <CustomLinkMain href={`/`} className="text-green-500 font-semibold">Houxera</CustomLinkMain>
                </div>
            </div>
        </footer>
    )
}

export default Footer