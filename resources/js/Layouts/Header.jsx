import { Fragment } from "react"
import { Navbar, Nav, Container, Button, NavDropdown, Image, Badge } from 'react-bootstrap';
import NotificationDropdown from '@/Components/NotificationDropdown';
import { Link } from "@inertiajs/react";
import FlatButton from '@/Components/FlatButton';
import { useEffect, useState } from "react";
import { truncateText, ActiveLink } from "@/utils/Index";
import { Images } from "@/utils/Images";
import axios from 'axios';
import UserAvatar from '@/Components/UserAvatar';


export default function Header({auth}){
    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    useEffect(() => {
        if (auth?.id && auth?.role === 'subscriber') {
            fetchCounts();
        }
    }, [auth]);

    const fetchCounts = async () => {
        try {
            // Fetch unread notifications count
            const notificationsResponse = await axios.get('/notifications?filter=unread');
            const notifCount = Array.isArray(notificationsResponse.data) ? notificationsResponse.data.length : 0;
            console.log('Notification count from API:', notifCount, notificationsResponse.data);
            setNotificationCount(notifCount);

            // Fetch unread messages count
            const messagesResponse = await axios.get('/messages?type=inbox');
            const unreadMessages = Array.isArray(messagesResponse.data) ? messagesResponse.data.filter(msg => !msg.is_read) : [];
            setMessageCount(unreadMessages.length);
        } catch (error) {
            console.error('Error fetching counts:', error);
            setNotificationCount(0);
            setMessageCount(0);
        }
    };

return(
<Fragment>
<Navbar expand="lg" className="header border-0 custom-title align-middle py-2" bg="dark" variant="dark">
<Container className="align-middle">
{/* Logo */}
<Link href={route('home')}>
    <Image src={Images.app_logo_trans} width={50} className="img-fluid" alt="logo" />
</Link>
{/* Mobile Toggle */}
<Navbar.Toggle aria-controls="navbarSupportedContent" className="border-0" />
{/* Navbar Collapse */}
<Navbar.Collapse id="navbarSupportedContent">
    <div className="d-lg-flex justify-content-between w-100 py-3 py-lg-0">
    <form className="d-flex" role="search">
    </form>
    <Nav className="m-0 p-0 d-flex flex-column flex-lg-row align-items-start align-items-lg-center fs-9 gap-2 gap-lg-0">
        <Nav.Item>
        <Link href={route('opportunities')} className={`nav-link me-lg-3 text-decoration-none ${ActiveLink('/opportunities')}`}> 
        Opportunities
        </Link>
        </Nav.Item>
        <Nav.Item>
        <Link href={route('toolshed')}  className={`nav-link text-light me-lg-3 text-decoration-none poppins-light ${ActiveLink('/toolshed')}`}>
        Toolshed
        </Link>
        </Nav.Item>
        <Nav.Item>
        {auth?.id ? (
            <Link href={route('subscription')} className={`nav-link text-light me-3 text-decoration-none poppins-light d-flex align-items-center gap-1 ${ActiveLink('/subscription')}`}>
                Upgrade
                <Badge bg="warning" text="dark" style={{fontSize: '0.65rem', padding: '2px 6px'}}>PRO</Badge>
            </Link>
        ) : (
            <Link href={route('pricing')} className={`nav-link text-light me-3 text-decoration-none poppins-light ${ActiveLink('/subscription')}`}>
                Pricing
            </Link>
        )}
        </Nav.Item>
        <Nav.Item>
        <Link href={route('advertise')} className={`nav-link text-light me-3 text-decoration-none poppins-light ${ActiveLink('/advertise')}`}>
         Advertise
        </Link>
        </Nav.Item>
        
        {/* User Authenticated */}
        {(auth?.id)?
         <>
        {/* Notification and Message Icons for Subscribers */}
        {auth?.role === 'subscriber' && (
            <>
                <Nav.Item className="me-lg-3">
                    <NotificationDropdown count={notificationCount} />
                </Nav.Item>
                {/* <Nav.Item className="me-3">
                    <Link 
                        href={route('subscriber.messages')} 
                        className="nav-link text-light text-decoration-none position-relative"
                        title="Messages"
                    >
                        <i className="bi bi-envelope" style={{fontSize: '1.2rem'}}></i>
                        {messageCount > 0 && (
                            <Badge 
                                bg="danger" 
                                pill 
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{fontSize: '0.7rem'}}
                            >
                                {messageCount > 9 ? '9+' : messageCount}
                            </Badge>
                        )}
                    </Link>
                </Nav.Item> */}
            </>
        )}
        
        <NavDropdown 
            title={
                <div className="d-flex align-items-center gap-2" style={{ height: '40px' }}>
                    <span className="d-flex align-items-center">{truncateText(auth?.name, 10)}</span>
                    <UserAvatar user={auth} size={40} />
                </div>
            }
            id="user-dropdown"
            align="end"
        >
            {(auth?.role == 'subscriber')?
            <>
            <NavDropdown.Item as={Link} href={route('subscriber.dashboard')} className="fs-9">     
            Dashboard
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} href={route('profile.edit')} className="fs-9">     
            Profile
            </NavDropdown.Item>
            </>
            :
            <>
            <NavDropdown.Item as={Link} href={route('admin.dashboard')} className="fs-9">     
            Dashboard
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} href={route('profile.edit')} className="fs-9">     
            Profile
            </NavDropdown.Item>
            </>
            }

            <NavDropdown.Item as={Link} method="post" href={route('logout')} className="fs-9" >
                Logout
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" className="fs-8 text-secondary text-decoration-none">&copy; edatsu inc</NavDropdown.Item>
        </NavDropdown>
        </>
        :
        <>
        <Nav.Item className="d-flex flex-row gap-2 mt-2 mt-lg-0">
        <FlatButton href="/login" variant="primary" size="sm">
            Login
        </FlatButton>
        <FlatButton href="/sign-up" variant="success" size="sm">
            Sign Up
        </FlatButton>
        </Nav.Item>
        </>
        }
    </Nav>
</div>
</Navbar.Collapse>
</Container>
</Navbar>
</Fragment>
    )
}