
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { Fragment } from 'react';
import Metadata from '@/Components/Metadata';
import RegisterForm from './RegisterForm';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Register({role}) {

    return (
        <Fragment>
           <Metadata
            title="Sign Up - Edatsu Media"
            description="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            keywords="sign up, create account, business opportunities, funding resources, finance tools, entrepreneur support, grants and investments, Edatsu Media"
            canonicalUrl="https://www.edatsu.com/signup"
            ogTitle="Join Edatsu Media - Business Insights & Funding Opportunities"
            ogDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            ogImage="/img/logo/default_logo.jpg"
            ogUrl="https://www.edatsu.com/signup"
            twitterTitle="Join Edatsu Media - Business Insights & Funding Opportunities"
            twitterDescription="Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!"
            twitterImage="/img/logo/default_logo.jpg"
            />
        <GuestLayout>
            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={4}>
                        {/**left side content */}
                        </Col>
                        <Col sm={4}>
                        <RegisterForm role="subscriber" path="sign-up"/>
                        </Col>
                        <Col sm={4}>
                         {/**right side content */}
                        </Col>
                    </Row>
                </Container>
            </Container>
        </GuestLayout>
        </Fragment>
    );
}
