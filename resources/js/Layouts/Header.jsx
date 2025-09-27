import { Fragment } from "react"
import { Navbar, Nav, Container, Button, NavDropdown, Image, Badge } from 'react-bootstrap';
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { truncateText, ActiveLink } from "@/utils/Index";
import { Images } from "@/utils/Images";
import { Moon, Sun } from 'lucide-react';
import axios from 'axios';


export default function Header({auth, isDarkMode, toggleDarkMode}){
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
            setNotificationCount(notificationsResponse.data.length);

            // Fetch unread messages count
            const messagesResponse = await axios.get('/messages?type=inbox');
            const unreadMessages = messagesResponse.data.filter(msg => !msg.is_read);
            setMessageCount(unreadMessages.length);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

return(
<Fragment>
<Navbar expand="lg" className="header border-0 custom-title align-middle" bg="dark" variant="dark">
<Container fluid={true} className="align-middle">
{/* Logo */}
<Link href={route('home')}>
    <Image src={Images.app_logo_trans} width={50} className="img-fluid" alt="logo" />
</Link>
{/* Navbar Collapse */}
<Navbar.Collapse id="navbarSupportedContent">
    <div className="d-flex justify-content-between w-100">
    <form className="d-flex" role="search">
    </form>
    <Nav className="m-0 p-0 d-flex align-items-center fs-9">
        <Nav.Item>
        <Link href={route('oppty')} className={`nav-link me-3 text-decoration-none ${ActiveLink('/opportunities')}`}> 
        Opportunities
        </Link>
        </Nav.Item>
        <Nav.Item>
        <Link href={route('toolshed')}  className={`nav-link text-light me-3 text-decoration-none poppins-light ${ActiveLink('/toolshed')}`}>
        Toolshed
        </Link>
        </Nav.Item>
        <Nav.Item>
        <Link href={route('subscription')} className={`nav-link text-light me-3 text-decoration-none poppins-light ${ActiveLink('/subscription')}`}>
         Pricing
        </Link>
        </Nav.Item>
        
        {/* Dark Mode Toggle */}
        <Nav.Item>
            <Button 
                className="btn bg-transparent border-0 me-3" 
                onClick={toggleDarkMode}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDarkMode ? 
                    <Sun size={20} color="white" /> : 
                    <Moon size={20} color="white" />
                }
            </Button>
        </Nav.Item>
        
        {/* User Authenticated */}
        {(auth?.id)?
         <>
        {/* Notification and Message Icons for Subscribers */}
        {auth?.role === 'subscriber' && (
            <>
                <Nav.Item className="me-3">
                    <Link 
                        href={route('subscriber.notifications')} 
                        className="nav-link text-light text-decoration-none position-relative"
                        title="Notifications"
                    >
                        <i className="bi bi-bell" style={{fontSize: '1.2rem'}}></i>
                        {notificationCount > 0 && (
                            <Badge 
                                bg="danger" 
                                pill 
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{fontSize: '0.7rem'}}
                            >
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </Badge>
                        )}
                    </Link>
                </Nav.Item>
                <Nav.Item className="me-3">
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
                </Nav.Item>
            </>
        )}
        
        <NavDropdown title={truncateText(auth?.name, 10)}>
            {(auth?.role == 'subscriber')?
            <NavDropdown.Item as={Link} href={route('subscriber.dashboard')} className="fs-9">     
            Profile
            </NavDropdown.Item>
            :
            <NavDropdown.Item as={Link} href={route('admin.dashboard')} className="fs-9">     
            Profile
            </NavDropdown.Item>
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
        <Link href="/login" className="poppins-semibold btn text-decoration-none fs-9 poppins-regular custom-bg-highlight text-light border-0 shadow-sm py-2 px-4 me-3">
            Login
        </Link>
        <Link href="/sign-up" className="poppins-semibold btn text-decoration-none fs-9 poppins-regular custom-bg-highlight text-light border-0 shadow-sm py-2 px-4">
            Sign Up
        </Link>
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