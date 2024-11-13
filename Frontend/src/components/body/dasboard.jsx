import React from 'react';

// styles
import './dasboard.css';

// components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Box, BoxTableLineChart, BoxController  } from '../help/box';
import { useState, useEffect, } from 'react';

//icon
import { MdOutlineLightMode } from 'react-icons/md';
import { IoWaterOutline } from "react-icons/io5";
import { CiTempHigh } from "react-icons/ci";



function Dasboard(params) {



    const [dataImport, setSensorData] = useState([]);
    const lastData = dataImport.slice(-10);
    const [fetchCount, setFetchCount] = useState(0);

    const dataLastItem = lastData[lastData.length - 1] || {
        id: "6717c2d7d91647270d6193d5",
        light: 437,
        temperature: 29.8,
        humidity: 70,
        wind:10,
        time: "2024-10-22 22:20:55"
    };

    const [actionLast, setActionLast] = useState(["OFF", "OFF", "OFF", "OFF"]);

    // Hàm fetch dữ liệu từ API
    const fetchAction = async () => {
        try {
            console.log('Fetching action data...');
            const response = await fetch('http://localhost:3800/action/aclast');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setActionLast(data);
        } catch (error) {
            console.error('Error fetching action data:', error);
        }
    };


    useEffect(() => {
        console.log("Updated actionLast:", actionLast);
        if (actionLast.length > 0) {
        }
    }, [actionLast]);







    const fetchData = async () => {
        try {
            console.log('Fetching data...');
            const response = await fetch('http://localhost:3800/sensor');
            const data = await response.json();
            setSensorData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    useEffect(() => {
        fetchData();
        fetchAction();
        const intervalId = setInterval(() => {
            setFetchCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= 3) {
                    fetchData();
                    return 0;
                }
                return newCount;
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Container  >
            <Row className='row-item-sensor'>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.temperature} params={"°C"}
                        icon={<CiTempHigh className='icon-sensor'
                            style={{ color: 'red' }} />}
                        bg={"linear-gradient(135deg, #f88c8c 0%, #fa0101 100%)"}
                    />
                </Col>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.humidity} params={"%"}
                        icon={<IoWaterOutline className='icon-sensor'
                            style={{ color: 'blue' }} />}
                        bg={"linear-gradient(135deg, #8cd5f8 20%, #01abfa 80%)"}
                    />
                </Col>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.light} params={"LUX"}
                        icon={<MdOutlineLightMode className='icon-sensor'
                            style={{ color: 'yellow' }} />}
                        bg={"linear-gradient(135deg, #f8ec8c 20%, #fadd01 80%)"}
                    />
                </Col>
            </Row>

            <Row className='row-item-data'>
                <Col xs={12} md={8} className='item-data'>
                    <BoxTableLineChart lastData={lastData} />
                </Col>
                <Col xs={12} md={4} className='item-data'>
                    <BoxController
                        av1={actionLast[0]}
                        av2={actionLast[1]}
                        av3={actionLast[2]} />
                </Col>
            </Row>
        </Container>
    );
}

export default Dasboard;