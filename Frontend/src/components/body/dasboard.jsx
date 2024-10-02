import React from 'react';

// styles
import './dasboard.css';

// components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Box, BoxTableLineChart, BoxController, BoxHim, BoxTem, BoxLig } from '../help/box';
import { useState, useEffect, } from 'react';

//icon
import { MdOutlineLightMode } from 'react-icons/md';
import { IoWaterOutline } from "react-icons/io5";
import { CiTempHigh } from "react-icons/ci";

// data
import initialData from '../data/data.json';



function Dasboard(params) {

    const [dataImport, setSensorData] = useState(initialData);
    const lastData = dataImport.slice(-10);
    const dataLastItem = lastData[lastData.length - 1];

    const fetchData = async () => {
        try {
            console.log('Fetching data...');
            const response = await fetch('https://raw.githubusercontent.com/mindongun123/iot_example/main/data.json');
            const data = await response.json();
            console.log('Data fetched:', data);
            setSensorData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const [fetchCount, setFetchCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFetchCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= 3) {
                    fetchData();
                    return 0;
                }
                return newCount;
            });
            // fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Container  >
            <Row className='row-item-sensor'>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.temperature} params={"°C"} icon={<CiTempHigh className='icon-sensor' style={{ color: 'red' }} />} bg={"linear-gradient(135deg, #f88c8c 0%, #fa0101 100%)"} />
                </Col>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.humidity} params={"%"} icon={<IoWaterOutline className='icon-sensor' style={{ color: 'blue' }} />} bg={"linear-gradient(135deg, #8cd5f8 20%, #01abfa 80%)"} />
                </Col>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.light} params={"LUX"} icon={<MdOutlineLightMode className='icon-sensor' style={{ color: 'yellow' }} />} bg={"linear-gradient(135deg, #f8ec8c 20%, #fadd01 80%)"} />
                </Col>
                {/*                                 
                <Col xs={12} md={3} className='item-sensor'>
                    <Box index={dataLastItem.temperature} params={"°C"} icon={<CiTempHigh className='icon-sensor' style={{ color: 'red' }} />} bg={"linear-gradient(135deg, #f88c8c 0%, #fa0101 100%)"} />
                </Col>
                <Col xs={12} md={3} className='item-sensor'>
                    <Box index={dataLastItem.humidity} params={"%"} icon={<IoWaterOutline className='icon-sensor' style={{ color: 'blue' }} />} bg={"linear-gradient(135deg, #8cd5f8 20%, #01abfa 80%)"} />
                </Col>
                <Col xs={12} md={3} className='item-sensor'>
                    <Box index={dataLastItem.light} params={"LUX"} icon={<MdOutlineLightMode className='icon-sensor' style={{ color: 'yellow' }} />} bg={"linear-gradient(135deg, #f8ec8c 20%, #fadd01 80%)"} />
                </Col>
                <Col xs={12} md={3} className='item-sensor'>
                    <Box index={dataLastItem.wind} params={"KM/H"} icon={<MdOutlineLightMode className='icon-sensor' style={{ color: 'green' }} />} bg={"linear-gradient(135deg, #f8ec8c 20%, #fadd01 80%)"} />
                </Col> */}
            </Row>

            <Row className='row-item-data'>
                <Col xs={12} md={8} className='item-data'>
                    <BoxTableLineChart lastData={lastData} />
                </Col>
                <Col xs={12} md={4} className='item-data'>
                    <BoxController />
                </Col>
            </Row>
        </Container>
    );
}

export default Dasboard;