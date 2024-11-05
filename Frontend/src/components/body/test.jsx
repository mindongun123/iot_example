import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './test.css';
import { BoxTableLineChartTest } from '../help/box';

function Test() {


    const [dataTest, setDataTest] = useState([]);
    const lastData = dataTest.slice(-10);
    const [fetchCount, setFetchCount] = useState(0);

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
        const intervalId = setInterval(() => {
            setFetchCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= 3) {
                    fetchDataTest();
                    return 0;
                }
                return newCount;
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Container className="test-container">
            <BoxTableLineChartTest lastData={lastData} />
        </Container>
    );
}

export default Test;
