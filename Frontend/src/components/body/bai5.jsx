import React from 'react';

// styles
import './dasboard.css';

// components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Box, BoxTableLineChartBai5, BoxController } from '../help/box';
import { useState, useEffect, } from 'react';

import { WiNightCloudyWindy } from "react-icons/wi";
import { WiNightAltCloudyWindy } from "react-icons/wi";
import { WiDayCloudyWindy } from "react-icons/wi";



function Bai5(params) {



    const [dataImport, setSensorData] = useState([]);
    const lastData = dataImport.slice(-10);
    const [fetchCount, setFetchCount] = useState(0);

    const dataLastItem = lastData[lastData.length - 1] || {
        id: "6717c2d7d91647270d6193d5",
        light: 437,
        temperature: 29.8,
        humidity: 70,

        wind: 10,
        wind1: 10,
        wind2: 10,

        time: "2024-10-22 22:20:55"
    };

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
        const intervalId = setInterval(() => {
            setFetchCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= 3) {
                    fetchData();
                    return 0;
                }
                return newCount;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Container  >
            <Row className='row-item-sensor'>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.wind} params={"wind"}
                        icon={<WiNightAltCloudyWindy className='icon-sensor'
                            style={{ color: 'red' }} />}
                        bg={"linear-gradient(135deg, #f88c8c 0%, #fa0101 100%)"}
                    />
                </Col>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.wind1} params={"wind1"}
                        icon={<WiNightCloudyWindy className='icon-sensor'
                            style={{ color: 'blue' }} />}
                        bg={"linear-gradient(135deg, #8cd5f8 20%, #01abfa 80%)"}
                    />
                </Col>
                <Col xs={12} md={4} className='item-sensor'>
                    <Box index={dataLastItem.wind2} params={"wind2"}
                        icon={<WiDayCloudyWindy className='icon-sensor'
                            style={{ color: 'yellow' }} />}
                        bg={"linear-gradient(135deg, #f8ec8c 20%, #fadd01 80%)"}
                    />
                </Col>
            </Row>

            <Row className='row-item-data'>
                <Col xs={12} md={8} className='item-data'>
                    <BoxTableLineChartBai5 lastData={lastData} />
                </Col>
            </Row>

        </Container>
    );
}

export default Bai5;