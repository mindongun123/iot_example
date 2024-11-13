import React from 'react';
import { Container, Row, Col, Image, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile.css';
import img from '../../image/avatar.jpg';

function Profile() {
    return (
        <Container className="profile-container">
            <Row className="justify-content-center text-center">
                <Col md={4}>
                    <Image src={img} roundedCircle fluid className="profile-image" />
                </Col>
            </Row>
            <Row className="justify-content-center text-center">
                <Col md={8}>
                    <h1 className="profile-name">Nguyen Minh Dong</h1>
                    <h4 className="profile-title">Lập trình viên</h4>
                    <p className="profile-description">
                        Tôi là một lập trình viên đam mê với kinh nghiệm trong phát triển web và ứng dụng di động.
                    </p>
                    <div className="profile-social-links">
                        <Button variant="primary" href="https://github.com/mindongun123/iot_example" target="_blank">
                            GitHub
                        </Button>
                        {' '}
                        <Button variant="primary" href="POSTMAN" target="_blank">
                            Postman
                        </Button>
                        <Button variant="primary" href="#" target="_blank">
                            PDF
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="profile-details">
                <Col md={6}>
                    <h3 className='header-box-info'>Thông tin cá nhân</h3>
                    <ListGroup className='mb-3 '>
                        <ListGroup.Item  className='txt-box-info'><strong>Tuổi:</strong> 21</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info' ><strong>Mã:</strong> B21DCCN230</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info' ><strong>Ngành:</strong> CNTT</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info' ><strong>Lớp:</strong> D21DCCN02-B</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info' ><strong>Địa chỉ:</strong> Nam Tu Liem - Ha Noi</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={6}>
                    <h3 className='header-box-info'>Kỹ năng</h3>
                    <ListGroup  className='mb-3'>
                        <ListGroup.Item  className='txt-box-info'>JavaScript</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info'>ReactJS</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info'>Node.js</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info'>MongoDB</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>

            <Row className="profile-works">
                <Col md={12}>
                    <h3 className='header-box-info'>Các dự án đã thực hiện</h3>
                    <ListGroup>
                        <ListGroup.Item  className='txt-box-info'><strong>Dự án 1:</strong> Ứng dụng web quản lý công việc</ListGroup.Item>
                        <ListGroup.Item  className='txt-box-info'><strong>Dự án 2:</strong> Ứng dụng di động đặt vé xe</ListGroup.Item>
                        <ListGroup.Item className='txt-box-info'><strong>Dự án 3:</strong> Hệ thống quản lý học sinh</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
