import './datasensor.css';

// components
import React, { useState, useEffect, useMemo } from 'react';
import Table from 'react-bootstrap/Table';
import { Container, Dropdown, Form, Button, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

// axios to fetch data
import axios from 'axios';

function DataSensor() {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('temperature');
    const [filteredData, setFilteredData] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3800/sensor');
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const handleSearch = async () => {
        try {
            console.log(startTime, endTime);

            const params = {
                temperature: searchType === 'temperature' ? searchQuery : undefined,
                humidity: searchType === 'humidity' ? searchQuery : undefined,
                light: searchType === 'light' ? searchQuery : undefined,
                startDate: searchType === 'time' ? startTime : undefined,
                endDate: searchType === 'time' ? endTime : undefined,
            };

            console.log('Search params:', params);

            const response = await axios.get('http://localhost:3800/sensor/search', { params });
            console.log('Search response:', response.data);

            setFilteredData(Array.isArray(response.data.sensors) ? response.data.sensors : []);
            setCurrentPage(1);

        } catch (error) {
            console.error('Error searching sensor data:', error);
        }
    };

    const requestSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const handleItemsPerPageChange = (count) => {
        setItemsPerPage(count);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setSearchQuery('');
        setStartTime('');
        setEndTime('');
    };

    const formatDateTime = (datetime) => {
        return datetime.replace('T', ' ') + ':00';
    };

    return (
        <Container>
            <div className='table-data'>
                <div className='table-header'>
                    <p className='text-header'>TABLE DATA</p>
                </div>

                <div className='d-flex justify-content-between mb-4 mt-3'>
                    <div className='search-bar'>
                        {/* Search */}
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={`${searchType === 'time' ? 'd-none' : ''} search`}
                        />
                        {searchType === 'time' && (
                            <InputGroup className="mb-2">
                                <Form.Control
                                    className='search'
                                    type="datetime-local"
                                    placeholder="Start Time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(formatDateTime(e.target.value))}
                                />
                                <Form.Control
                                    className='search'
                                    type="datetime-local"
                                    placeholder="End Time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(formatDateTime(e.target.value))}
                                />
                            </InputGroup>
                        )}

                        {/* Button Search */}
                        <Button className='btn-search' onClick={handleSearch}>
                            <FaSearch className='icon-btn-search' />
                        </Button>
                    </div>
                    <div className='sort-bar'>
                        {/* Topic Search */}
                        <Dropdown>
                            <Dropdown.Toggle className="topic-search">
                                {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleSearchTypeChange('temperature')}>Temperature</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSearchTypeChange('humidity')}>Humidity</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSearchTypeChange('light')}>Light</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSearchTypeChange('time')}>Time</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Items per page */}
                        <Dropdown>
                            <Dropdown.Toggle className='items-per-page' id="dropdown-basic">
                                Show {itemsPerPage} rows
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10 rows</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20 rows</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50 rows</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <div className='table-content'>
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th className='td-item'>#</th>
                                <th className='td-item' onClick={() => requestSort('temperature')}>
                                    Temperature {sortConfig.key === 'temperature' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th className='td-item' onClick={() => requestSort('humidity')}>
                                    Humidity {sortConfig.key === 'humidity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th className='td-item' onClick={() => requestSort('light')}>
                                    Light {sortConfig.key === 'light' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th className='td-item' onClick={() => requestSort('time')}>
                                    Time {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                paginatedData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className='td-item'>{startIndex + index + 1}</td>
                                        <td className='td-item'>{item.temperature}</td>
                                        <td className='td-item'>{item.humidity}</td>
                                        <td className='td-item'>{item.light}</td>
                                        <td className='td-item'>{item.time}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination pagination-button">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link item-page" href="#" aria-label="Previous" onClick={handlePrevious}>
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li className="page-item active">
                            <a className="page-link item-page" href="#">
                                {currentPage}
                            </a>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link item-page" href="#" aria-label="Next" onClick={handleNext}>
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </Container>
    );
}

export default DataSensor;
