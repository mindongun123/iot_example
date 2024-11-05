import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './test.css';
import { BoxTableLineChartTest } from '../help/box';
import { FiWind } from "react-icons/fi";
import ToggleButton from '../help/togglebutton';


function Test() {


    const [dataTest, setDataTest] = useState([]);
    const lastData = dataTest.slice(-10);
    const [fetchCount, setFetchCount] = useState(0);

    const [actionLast, setActionLast] = useState(["OFF", "OFF", "OFF", "OFF"]);

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
                    fetchAction();
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
                if (latestData.light > 400 && actionLast[3] === "ON") {
                    document.body.classList.add("alert-background");
                } else {
                    document.body.classList.remove("alert-background");
                }
            }
        };
        handleAlertBackground();
    }, [dataTest, actionLast]);




    return (
        <Container className="test-container">
            <BoxTableLineChartTest lastData={lastData} />
            <div className="box-test" style={{ width: "350px", padding: "10px", marginTop: "10px" }}>
                <ToggleButton img={<FiWind className='box-image-icon' />} bg={"linear-gradient(135deg, #e3cef6fa 10%, #a041f9fa 90%)"} effect={"effect-wind"} lightId={"light4"} action={actionLast[3]} />
            </div>
        </Container>
    );
}

export default Test;
