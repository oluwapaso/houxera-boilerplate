"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers } from '@/_lib/helper'
import FloatingInput from '@/components/FloatingInput'
import { PiHouseLine, PiMathOperations } from 'react-icons/pi'
import { RootState } from '@/app/GlobalRedux/store'
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import { BiRefresh, BiTrash } from 'react-icons/bi'
import { BsGear } from 'react-icons/bs'
import MortgageDonutChart from './MortgageDonutChart'

const helpers = new Helpers();
const MortgageCalculatorVar12 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

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
    const [chartData, setChartData] = useState({ principal: 0, totalInterest: 0 });

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

    const handleShowCalc = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newShowCalc = e.target.checked;   // ← Read fresh value from event 
        setShowCalc(newShowCalc);

        var to = setTimeout(() => {
            CalculateMortagage(newShowCalc);
        }, 250);
        return () => clearTimeout(to);

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

    const CalculateMortagage = (show_calc: boolean) => {

        const downPayment = parseFloat(helpers.formatMoneyToNumber(calc_data.downpay_dollar));
        const propertyPrice = parseFloat(helpers.formatMoneyToNumber(calc_data.property_price));
        const interestRate = parseFloat(calc_data.interest_rate.toString()) / 100;
        const mortgageLength = parseFloat(calc_data.length_of_mortgage.toString());
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = mortgageLength * 12;
        const principal = propertyPrice - downPayment;
        const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
        const totalInterest = (monthlyPayment * numberOfPayments) - principal;

        setMonthlyPayment(helpers.formatCurrency(monthlyPayment.toString()));
        setChartData({ principal, totalInterest });

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

            output += `<div class="!w-full !max-w-[100%] overflow-x-auto py-3 px-4 bg-white border border-gray-200 mb-5">
            <table class="table table-auto w-[900px] lg:w-full">
                <tr class="text-left"><th>Month</th><th>Interest Paid</th><th>Principal Paid</th><th>Remaining Balance</th></tr>`;

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
                    output += `<div class="!w-full !max-w-[100%] overflow-x-auto py-3 px-4 bg-white border border-gray-200 mb-5">
                        <table class="table table-auto w-[900px] lg:w-full">
                        <tr class="text-left"><th>Month</th><th>Interest Paid</th><th>Principal Paid</th><th>Remaining Balance</th></tr>`;
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
                    "component": "MortgageCalculatorVar12",
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

    if (themeSett && themeSett != null) {
        return (
            <section className="w-full min-h-[100dvh] relative bg-gray-100">

                {/* hero band */}
                <div className={`w-full pb-20 pt-36 px-4 text-center bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <PiHouseLine size={16} color="#FFFFFF" />
                        <span className="text-xs uppercase tracking-widest">Financing Estimator</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">{raw_data.header || "Mortgage Calculator"}</h1>
                    <p className={`mt-3 max-w-[480px] mx-auto text-sm`}>
                        {raw_data.sub_header || "A practical estimator for monthly home loan payments."}
                    </p>
                </div>

                <div className="container mx-auto max-w-[1000px] px-4 -mt-12 pb-20">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl px-7 py-7">

                        <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#16A34A' }}>Listing Details</div>

                        <div className="">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FloatingInput name='property_price' label='Property Price' placeholder='Property Price'
                                    handleChange={(e) => handleChange(e)} value={calc_data.property_price.toString()}
                                    handleBlur={(e) => handleInputBlur(e)} required data-is-currency />

                                <div className="grid grid-cols-2 gap-3">
                                    <FloatingInput name='downpay_dollar' label='Down.Pay Amt.' placeholder='Down Payment Amount'
                                        handleChange={(e) => handleDpChange(e)} value={calc_data.downpay_dollar.toString()}
                                        handleBlur={(e) => handleDpBlur(e)} required data-is-currency />
                                    <FloatingInput name='downpay_percent' label='Down.Pay %' placeholder='Down Payment Percentage'
                                        handleChange={(e) => handleDpChange(e)} value={calc_data.downpay_percent.toString()}
                                        handleBlur={(e) => handleDpBlur(e)} required data-is-percent />
                                </div>

                                <FloatingInput name='length_of_mortgage' label='Length of Mortgage' placeholder='Length of Mortgage'
                                    handleChange={(e) => handleChange(e)} value={calc_data.length_of_mortgage.toString()} required data-is-number
                                    handleBlur={(e) => handleInputBlur(e)} data-max-len={2} data-max-val={30} data-min-val={1} />

                                <FloatingInput name='interest_rate' label='Annual Interest Rate' placeholder='Annual Interest Rate'
                                    handleChange={(e) => handleChange(e)} value={calc_data.interest_rate.toString()} required data-is-percent
                                    handleBlur={(e) => handleInputBlur(e)} data-max-len={3} data-max-val={100} data-min-val={0} />
                            </div>

                            <div className=' flex justify-between items-start'>
                                <div className='mt-5 sm:col-span-2 relative flex items-center -left-2.5'>
                                    <input type='checkbox' className='styled-checkbox' name='show_calc' id='show_calc'
                                        checked={show_calc} onChange={(e) => handleShowCalc(e)} />
                                    <label className='' htmlFor="show_calc">
                                        <span className=''>Show me the calculations and amortization</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => CalculateMortagage(show_calc)}
                                    className={`mt-6 px-7 py-3.5 font-semibold flex items-center gap-2 justify-center rounded
                                    bg-${themeSett.primary_color} text-${themeSett.primary_button_text} hover:shadow-2xl 
                                    hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} cursor-pointer `}>
                                    <PiMathOperations size={16} /> <span>{raw_data.button_text || "Calculate"}</span>
                                </button>
                            </div>
                        </div>

                        {/* agent-card style result */}
                        <div className="border-t px-6 md:px-10 py-8 mt-5" style={{ borderColor: '#E5E7EB', background: '#F0FDF4' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#16A34A' }}>Estimated Monthly Payment</div>
                                    <div className="text-4xl font-bold mt-1" style={{ color: '#14532D' }}>{monthly_payment}</div>
                                </div>
                                <div className="text-sm text-right" style={{ color: '#4B5563' }}>
                                    Based on the figures<br />provided above
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-10 flex items-center justify-center mb-5'>
                        {/* donut chart */}
                        {chartData.principal > 0 && (
                            <MortgageDonutChart
                                principal={chartData.principal}
                                totalInterest={chartData.totalInterest}
                                monthlyPayment={monthly_payment}
                                primaryColor={themeSett?.primary_color}
                            />
                        )}
                    </div>

                    <div className={`mt-10 bg-white rounded-2xl p-6 md:p-8 shadow-xl ${!show_calc ? "hidden" : ""}`}>
                        <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#16A34A' }}>Calculations &amp; Amortization</div>
                        <ol className="list-decimal pl-4 space-y-3 text-sm" style={{ color: '#374151' }} id="further_brk_dwn"></ol>
                    </div>

                    <div className={`w-full mt-6 overflow-x-auto rounded-2xl ${!show_calc ? "hidden" : ""}`} id='monthly_breakdown'></div>
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

export default MortgageCalculatorVar12