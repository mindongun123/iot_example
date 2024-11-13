import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './test.css';
import { BoxTableLineChartTest, Box } from '../help/box';
import { FiWind } from "react-icons/fi";
import ToggleButton from '../help/togglebutton';
import Row from 'react-bootstrap/Row';
import { IoIosWarning } from "react-icons/io";
import Col from 'react-bootstrap/Col';

function Test() {


    const [dataTest, setDataTest] = useState([]);
    const lastData = dataTest.slice(-10);
    const [fetchCount, setFetchCount] = useState(0);

    const [actionLast, setActionLast] = useState(["OFF", "OFF", "OFF", "OFF"]);

    const boxTestRef = useRef(null);

    const dataLastItem = lastData[lastData.length - 1] || {
        id: "6717c2d7d91647270d6193d5",
        light: 437,
        temperature: 29.8,
        humidity: 70,
        wind: 10,
        time: "2024-10-22 22:20:55"
    };

    useEffect(() => {
    }, [actionLast]);

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

    const fetchDataTest = async () => {
        try {
            console.log('Fetching action data...');
            const response = await fetch('http://localhost:3800/sensor/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataTest(data);
        } catch (error) {
            console.error('Error fetching action data:', error);
        }
    };


    useEffect(() => {
        fetchDataTest();
        fetchAction();
        const intervalId = setInterval(() => {
            setFetchCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= 1) {
                    fetchDataTest();
                    return 0;
                }
                return newCount;
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleAlertBackground = () => {
            if (dataTest.length > 0) {
                const latestData = dataTest[dataTest.length - 1];
                if (latestData.wind > 6) {
                    boxTestRef.current.classList.add("alert-background");
                } else {
                    boxTestRef.current.classList.remove("alert-background");
                }
            }
        };
        handleAlertBackground();
    }, [dataTest, actionLast]);




    return (
        <Container className="test-container">


            <Row className='row-item-data'>
                <Col xs={12} md={8} className='item-data'>
                    <BoxTableLineChartTest lastData={lastData} />
                </Col>


                <Col xs={12} md={4} className='item-data'>
                    <Col className='item-sensor'>
                        <Box index={dataLastItem.temperature} params={"°C"}
                            icon={<FiWind className='icon-sensor'
                                style={{ color: 'red' }} />}
                            bg={"linear-gradient(135deg, #f88c8c 0%, #fa0101 100%)"}
                        />
                    </Col>
                    
                    <Col className='item-sensor'>
                        <div ref={boxTestRef} className="box-test" style={{ padding: "15px", marginTop: "15px" }}>
                            <ToggleButton img={<IoIosWarning className='box-image-icon' />} bg={"linear-gradient(135deg, #e3cef6fa 10%, #a041f9fa 90%)"} effect={"effect-wind"} lightId={"light4"} action={actionLast[3]} />
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default Test;
