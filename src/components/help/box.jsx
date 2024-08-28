import React from 'react';
import './box.css';
import TableLineChart from './linechart';
import ToggleButton from './togglebutton';

import { MdDashboard, MdOutlineLightMode, MdOutlineLightbulb } from 'react-icons/md';
import { FaDatabase, FaThermometerEmpty, FaRegLightbulb } from "react-icons/fa";
import { IoWaterOutline, IoFlashlight } from "react-icons/io5";
import { GoSun, GoClockFill } from "react-icons/go";
import { IoMdPerson } from "react-icons/io";
import { CiTempHigh } from "react-icons/ci";
import { WiNightCloudyWindy } from "react-icons/wi";
import { PiFanBold } from "react-icons/pi";
import { TbAirConditioningDisabled, TbAirConditioning } from "react-icons/tb";
import { RiLightbulbFlashLine } from "react-icons/ri";


function Box({ index, params, icon }) {
    function interpolateColor(startColor, endColor, factor) {
        let result = startColor.slice(1).match(/.{2}/g)
            .map((hex, i) => {
                return Math.round(parseInt(hex, 16) + factor * (parseInt(endColor.slice(1).match(/.{2}/g)[i], 16) - parseInt(hex, 16)));
            })
            .map(value => value.toString(16).padStart(2, '0'))
            .join('');
        return `#${result}`;
    }

    const getGradient = () => {
        let startColor, endColor, maxValue;

        if (params === "°C") {
            startColor = "#f88c8c";
            endColor = "#fa0101";
            maxValue = 50;
        } else if (params === "%") {
            startColor = "#8cd5f8";
            endColor = "#01abfa";
            maxValue = 100;
        } else if (params === "LUX") {
            startColor = "#f8ec8c";
            endColor = "#fadd01";
            maxValue = 500;
        }

        const factor = Math.min(index / maxValue, 1);
        const backgroundColor = interpolateColor(startColor, endColor, factor);
        console.log(params + ":" + backgroundColor)
        return backgroundColor;
    };
    const backgroundGradient = `linear-gradient(-135deg, #ffffff 10%, ${getGradient()} 100%)`;


    return (
        <div className="box box-sensor" style={{ background: backgroundGradient }}>
            <p className='info-sensor'>{index}</p>
            <div className='icon-help-info-sensor'>
                {icon}
                <p className='text-info-sensor'>{params}</p>
            </div>
        </div>
    );
}

function BoxTableLineChart({ lastData }) {
    return (
        <div className="box">
            <TableLineChart lastData={lastData} />
        </div>
    )
}



function BoxController({ controller }) {
    return (
        <div className="box box-controller">
            <p className='header-text'>Action</p>
            <div className='container-button'>
                <ToggleButton img={<TbAirConditioningDisabled className='box-image-icon' />} bg={" background: linear-gradient(135deg, #cee1f8 10%, #60c7fa 90%)"} />
                <ToggleButton img={<PiFanBold className='box-image-icon' />} bg={"linear-gradient(135deg, #cef8e5 10%, #60faa3 90%)"} />
                <ToggleButton img={<RiLightbulbFlashLine className='box-image-icon' />} bg={"linear-gradient(135deg, #f8cef5 10%, #fa60d4 90%)"} />
            </div>
        </div>
    )
}

export { Box, BoxTableLineChart, BoxController };