"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers } from '@/_lib/helper'
import FloatingInput from '@/components/FloatingInput'
import { PiMathOperations } from 'react-icons/pi'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import { BiRefresh, BiTrash } from 'react-icons/bi'
import { BsGear } from 'react-icons/bs'

const helpers = new Helpers();
const MortgageCalculatorVar9 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const empty_form_data = {
        property_price: helpers.formatCurrency("100000000", true),
        downpay_dollar: helpers.formatCurrency("25000000", true),
        downpay_percent: "25%",
        length_of_mortgage: 30,
        interest_rate: 10,
    }

    const [monthly_payment, setMonthlyPayment] = useState("0");
    const [show_calc, setShowCalc] = useState(false);
    const [calc_data, setCalcData] = useState(empty_form_data);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCalcData((prev_data) => {
            return {
                ...prev_data,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleDpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // just store the raw value while typing, no cross-calculation
        setCalcData((prev_data: any) => ({
            ...prev_data,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDpBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "downpay_dollar") {
            const dpValue = parseFloat(helpers.formatMoneyToNumber(e.target.value));
            const priceValue = parseFloat(helpers.formatMoneyToNumber(calc_data.property_price));

            let percent = priceValue > 0 ? ((dpValue / priceValue) * 100).toFixed(2) : "0";
            percent = percent.replace(".00", "");
            const formattedPercent = `${helpers.formatFraction(percent)}%`;

            setCalcData((prev_data: any) => ({
                ...prev_data,
                downpay_dollar: helpers.formatCurrency(e.target.value, true),
                downpay_percent: formattedPercent,
            }));

        } else if (e.target.name === "downpay_percent") {
            const priceValue = parseFloat(helpers.formatMoneyToNumber(calc_data.property_price));
            let percent = parseFloat(helpers.formatMoneyToNumber(e.target.value));

            if (isNaN(percent) || percent < 0) percent = 0;
            if (percent > 100) percent = 100;

            const dpAmount = priceValue * (percent / 100);
            const formattedPercent = `${helpers.formatFraction(percent.toFixed(2).replace(".00", ""))}%`;

            setCalcData((prev_data: any) => ({
                ...prev_data,
                downpay_percent: formattedPercent,
                downpay_dollar: helpers.formatCurrency(dpAmount.toFixed(2), true),
            }));
        }
    };

    const handleShowCalc = () => {

        setShowCalc(!show_calc)
        if (show_calc) {
            const monthly_breakdown = document.getElementById("monthly_breakdown");
            if (monthly_breakdown) {
                monthly_breakdown.innerHTML = "";
            }
        } else {
            var to = setTimeout(CalculateMortagage, 250);
            return () => clearTimeout(to);
        }

    }

    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> |
        React.ChangeEvent<HTMLTextAreaElement>
    ) => {

        var value = e.target.value;
        const isCurrency = e.target.dataset.isCurrency === 'true';
        const isNumber = e.target.dataset.isNumber === 'true';
        const maxLen = parseInt(e.target.dataset.maxLen as string);
        const maxVal = parseInt(e.target.dataset.maxVal as string);
        const minVal = parseInt(e.target.dataset.minVal as string);
        const isPercent = e.target.dataset.isPercent === 'true';
        // const minNumber = parseInt(e.target.dataset.min as string); 

        setCalcData((prev_val: any) => {
            const prevVal = { ...prev_val }

            let newValue = value;
            if (isCurrency) {
                newValue = helpers.formatCurrency(value, true); ///minNumber.toString() 
            }

            if (isNumber) {
                newValue = helpers.formatWholeNumber(value); ///minNumber.toString() 
            }

            if (maxLen && maxLen > 0) {
                newValue = newValue.substring(0, maxLen);
            }

            if (parseInt(newValue) > maxVal) {
                newValue = maxVal.toString();
            }

            if (parseInt(newValue) < minVal) {
                newValue = minVal.toString();
            }

            if (isPercent) {
                newValue = newValue.replace(".00", "").replace("₦", "").replace("NGN", "").replace("%", "");
                if (parseFloat(newValue) < 0) {
                    newValue = "0";
                }

                if (parseFloat(newValue) > 100) {
                    newValue = "100";
                }

                newValue = `${helpers.formatFraction(newValue)}%`; ///minNumber.toString() 
            }

            return {
                ...prevVal,
                [e.target.name]: newValue,
            }
        })
    }

    const CalculateMortagage = () => {

        const downPayment = parseFloat(helpers.formatMoneyToNumber(calc_data.downpay_dollar));
        const propertyPrice = parseFloat(helpers.formatMoneyToNumber(calc_data.property_price));
        const interestRate = parseFloat(calc_data.interest_rate.toString()) / 100;
        const mortgageLength = parseFloat(calc_data.length_of_mortgage.toString());
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = mortgageLength * 12;
        const principal = propertyPrice - downPayment;
        const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
        // setMonthlyPayment(new Intl.NumberFormat('en-US', {
        //     style: 'currency',
        //     currency: 'NGN'
        // }).format(monthlyPayment))

        setMonthlyPayment(helpers.formatCurrency(monthlyPayment.toString()));

        let appendTo = document.getElementById("further_brk_dwn")
        if (appendTo) {

            appendTo.innerHTML = `
            <li><strong>The down payment</strong> = The price of the home multiplied by the percentage down
            divided by 100 (for ${calc_data.downpay_percent} down ,<br/> becomes ${calc_data.downpay_percent}/100 or ${parseFloat(calc_data.downpay_percent) / 100}) 
            ${helpers.formatCurrency(downPayment.toString(), true)} = ${helpers.formatCurrency((propertyPrice - downPayment).toString())} X (${calc_data.downpay_percent} / 100)
            </li>

            <li><strong>The interest rate</strong> = The annual interest percentage divided by 100 <br/>
            ${interestRate / 100} = ${interestRate}% / 100
            </li>

            <li><strong>The monthly interest rate</strong> = The annual interest rate divided by 12 (for the 12 months in a year)<br/>
            ${(interestRate / 100) / 12} = ${interestRate / 100} / 12
            </li>

            <li><strong>The month term of the loan in months</strong> = The number of years you've taken the loan out for times 12<br/>
            ${numberOfPayments} Months = ${mortgageLength} Years X 12
            </li>

            <li>The monthly payment is figured out using the following <strong>formula</strong>:<br/>
            <div class='w-full my-3'>
            <div class='flex items-center font-play-fair-display'>
                <div class='text-4xl'>
                    M = P
                </div>
                <div class='text-3xl flex flex-col divide-y-2 ml-4'>
                    <div>r (1 + r)<sup>n</sup></div>
                    <div>(1 + r)<sup>n</sup> - 1</div>
                </div>
            </div>
            </div>
            <div class='w-full'>
            Monthly Payment = ${principal} * (${interestRate / 100} / (1 - ((1 + ${interestRate / 100}) - ${numberOfPayments})))
            </div>
            </li>
            `
        }

        if (show_calc) {
            let remainingBalance = principal;
            let output = '<div class="w-full px-4 py-3 bg-gray-100 font-semibold"><h3>Year 1</h3></div>';

            output += `<div class="!w-full !max-w-[100%] overflow-x-auto py-3 px-4 border border-gray-200 mb-5"><table class="table table-auto w-[900px] lg:w-full"><tr><th>Month</th><th>Interest Paid</th><th>Principal Paid</th>
            <th>Remaining Balance</th></tr>`;

            let k = 1;
            for (let i = 1; i <= numberOfPayments; i++) {

                const interestPaid = remainingBalance * monthlyInterestRate;
                const principalPaid = monthlyPayment - interestPaid;
                remainingBalance -= principalPaid;

                output += `<tr class="*:py-3 border-b border-gray-200">
                    <td>${k}</td>
                    <td>${helpers.formatCurrency(interestPaid.toString(), true)}</td>
                    <td>${helpers.formatCurrency(principalPaid.toString(), true)}</td>
                    <td>${helpers.formatCurrency(remainingBalance.toString(), true)}</td>
                </tr>`;

                if (i % 12 === 0 && i !== numberOfPayments) {
                    output += '</table></div>';
                    output += `<div class="w-full px-4 py-3 bg-gray-100 font-semibold"><h3>Year ${(i / 12) + 1}</h3></h3></div><h3>`;
                    output += `<div class="!w-full !max-w-[100%] overflow-x-auto py-3 px-4 border border-gray-200 mb-5"><table class="table table-auto w-[900px] lg:w-full">
                    <tr><th>Month</th><th>Interest Paid</th><th>Principal Paid</th><th>Remaining Balance</th></tr>`;
                }

                if (k == 12) {
                    k = 0;
                }
                k++;
            }

            output += '</table></div>';

            const monthly_breakdown = document.getElementById("monthly_breakdown")
            if (monthly_breakdown) {
                monthly_breakdown.innerHTML = output
            }

        } else {
            const monthly_breakdown = document.getElementById("monthly_breakdown")
            if (monthly_breakdown) {
                monthly_breakdown.innerHTML = ""
            }
        }

    }

    const handleSettingsClick = () => {
        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "mortgage_calculator",
                    "type": "section",
                    "component": "MortgageCalculatorVar9",
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "Mortgage Calculator"
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleHover = () => {
        setSectionHover(true);
    }

    const handleMouseExist = () => {
        setSectionHover(false);
    }

    useEffect(() => {

        var property_price = parseFloat(helpers.formatMoneyToNumber(calc_data.property_price))
        var downpay_percent = parseFloat(helpers.formatMoneyToNumber(calc_data.downpay_percent.toString()))
        let downpay_dollar = (downpay_percent / 100) * property_price;

        setCalcData((prev_data: any) => {
            return {
                ...prev_data,
                "downpay_dollar": helpers.formatCurrency(downpay_dollar.toString(), true)
            }
        });

    }, [calc_data.property_price, calc_data.downpay_percent]);

    useEffect(() => {
        dispatch(hidePageLoader());
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    const raised = '8px 8px 16px #D6CFC4, -8px -8px 16px #FFFFFF';
    const inset = 'inset 4px 4px 8px #D6CFC4, inset -4px -4px 8px #FFFFFF';

    if (themeSett && themeSett != null) {
        return (
            <section className="w-full min-h-[100dvh] py-35 px-4 flex items-center justify-center" style={{ background: '#E7E0D5' }}>
                <div className="w-full max-w-[680px]">

                    <h1 className="text-3xl font-semibold text-center mb-10" style={{ color: '#5C5448' }}>
                        Mortgage Calculator xx
                    </h1>

                    <div className="rounded-[32px] p-8 md:p-10" style={{ background: '#E7E0D5', boxShadow: raised }}>

                        <div className="space-y-6">
                            <div className="rounded-2xl p-1" style={{ boxShadow: inset }}>
                                <FloatingInput name='property_price' label='Property Price' placeholder='Property Price'
                                    handleChange={(e) => handleChange(e)} value={calc_data.property_price.toString()}
                                    handleBlur={(e) => handleInputBlur(e)} required data-is-currency />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl p-1" style={{ boxShadow: inset }}>
                                    <FloatingInput name='downpay_dollar' label='Down.Pay Amt.' placeholder='Down Payment Amount'
                                        handleChange={(e) => handleDpChange(e)} value={calc_data.downpay_dollar.toString()}
                                        handleBlur={(e) => handleDpBlur(e)} required data-is-currency />
                                </div>
                                <div className="rounded-2xl p-1" style={{ boxShadow: inset }}>
                                    <FloatingInput name='downpay_percent' label='Down.Pay %' placeholder='Down Payment Percentage'
                                        handleChange={(e) => handleDpChange(e)} value={calc_data.downpay_percent.toString()}
                                        handleBlur={(e) => handleDpBlur(e)} required data-is-percent />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl p-1" style={{ boxShadow: inset }}>
                                    <FloatingInput name='length_of_mortgage' label='Length of Mortgage' placeholder='Length of Mortgage'
                                        handleChange={(e) => handleChange(e)} value={calc_data.length_of_mortgage.toString()} required data-is-number
                                        handleBlur={(e) => handleInputBlur(e)} data-max-len={2} data-max-val={30} data-min-val={1} />
                                </div>
                                <div className="rounded-2xl p-1" style={{ boxShadow: inset }}>
                                    <FloatingInput name='interest_rate' label='Interest Rate' placeholder='Annual Interest Rate'
                                        handleChange={(e) => handleChange(e)} value={calc_data.interest_rate.toString()} required data-is-percent
                                        handleBlur={(e) => handleInputBlur(e)} data-max-len={3} data-max-val={100} data-min-val={0} />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer select-none pt-1" htmlFor="show_calc">
                                <input type='checkbox' className='w-4 h-4' name='show_calc' id='show_calc' checked={show_calc} onChange={handleShowCalc} />
                                <span className="text-sm" style={{ color: '#5C5448' }}>Show calculations and amortization</span>
                            </label>

                            <button
                                onClick={CalculateMortagage}
                                className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-shadow"
                                style={{ background: '#E7E0D5', color: '#8A6F4E', boxShadow: raised }}
                            >
                                <PiMathOperations size={18} /> Calculate
                            </button>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="mt-10 rounded-[32px] p-8 text-center" style={{ background: '#E7E0D5', boxShadow: inset }}>
                        <div className="text-4xl font-semibold" style={{ color: '#5C5448' }}>{monthly_payment}</div>
                        <div className="text-sm mt-2" style={{ color: '#9A8F7E' }}>estimated monthly payment</div>
                    </div>

                    <div className={`mt-8 rounded-[32px] p-6 md:p-8 ${!show_calc ? "hidden" : ""}`} style={{ background: '#E7E0D5', boxShadow: raised }}>
                        <ol className="list-decimal pl-4 space-y-3 text-sm" style={{ color: '#5C5448' }} id="further_brk_dwn"></ol>
                    </div>

                    <div className={`w-full mt-6 overflow-x-auto rounded-[24px] ${!show_calc ? "hidden" : ""}`} id='monthly_breakdown'></div>
                </div>

                {is_theme && (
                    <div className=' absolute z-[1000] right-1.5 top-20 space-x-2 flex items-center justify-end *:bg-gray-800 
                    *:text-white *:flex *:items-center *:justify-center *:p-2 *:rounded *:cursor-pointer'>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsGear size={17} />

                            <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Section settings
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("CHANGE_LAYOUT")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiRefresh size={17} />

                            <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Change Layout
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiTrash size={17} />

                            <span className='absolute hidden right-0 whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Remove Section Down
                            </span>
                        </div>

                    </div>
                )}
            </section>
        )
    }
}

export default MortgageCalculatorVar9