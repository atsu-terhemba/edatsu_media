import { Fragment } from "react"
import { Navbar, Nav, Container, NavDropdown, Image, Badge } from 'react-bootstrap';
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
            const notificationsResponse = await axios.get('/notifications?filter=unread');
            const notifCount = Array.isArray(notificationsResponse.data) ? notificationsResponse.data.length : 0;
            console.log('Notification count from API:', notifCount, notificationsResponse.data);
            setNotificationCount(notifCount);

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
<Navbar
    expand="lg"
    className="header border-0 align-middle"
    bg="dark"
    variant="dark"
    style={{
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        padding: '0.4rem 0',
    }}
>
<Container className="align-middle">
    {/* Logo */}
    <Link href={route('home')}>
        <Image src={Images.app_logo_trans} width={42} className="img-fluid" alt="logo" />
    </Link>

    {/* Mobile Toggle */}
    <Navbar.Toggle aria-controls="navbarSupportedContent" className="border-0" />

    {/* Navbar Collapse */}
    <Navbar.Collapse id="navbarSupportedContent">
        <div className="d-lg-flex justify-content-between w-100 py-3 py-lg-0">
            <form className="d-flex" role="search"></form>
            <Nav className="m-0 p-0 d-flex flex-column flex-lg-row align-items-start align-items-lg-center fs-9 gap-2 gap-lg-0">
                <Nav.Item>
                    <Link href={route('opportunities')} className={`nav-link me-lg-3 text-decoration-none ${ActiveLink('/opportunities')}`}>
                        Opportunities
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link href={route('toolshed')} className={`nav-link text-light me-lg-3 text-decoration-none ${ActiveLink('/toolshed')}`}>
                        Toolshed
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    {auth?.id ? (
                        <Link href={route('subscription')} className={`nav-link text-light me-3 text-decoration-none d-flex align-items-center gap-1 ${ActiveLink('/subscription')}`}>
                            Upgrade
                            <Badge
                                style={{
                                    fontSize: '10px',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    background: '#dc2626',
                                    color: '#fff',
                                    fontWeight: 500,
                                    border: 'none',
                                }}
                            >
                                PRO
                            </Badge>
                        </Link>
                    ) : (
                        <Link href={route('pricing')} className={`nav-link text-light me-3 text-decoration-none ${ActiveLink('/pricing')}`}>
                            Subscription
                        </Link>
                    )}
                </Nav.Item>
                <Nav.Item>
                    <Link href={route('advertise')} className={`nav-link text-light me-3 text-decoration-none ${ActiveLink('/advertise')}`}>
                        Advertise
                    </Link>
                </Nav.Item>

                {/* User Authenticated */}
                {(auth?.id) ?
                    <>
                        {auth?.role === 'subscriber' && (
                            <Nav.Item className="me-lg-3">
                                <NotificationDropdown count={notificationCount} />
                            </Nav.Item>
                        )}

                        <NavDropdown
                            title={
                                <div className="d-flex align-items-center gap-2" style={{ height: '40px' }}>
                                    <span className="d-flex align-items-center">{truncateText(auth?.name, 10)}</span>
                                    <UserAvatar user={auth} size={36} />
                                </div>
                            }
                            id="user-dropdown"
                            align="end"
                        >
                            {(auth?.role == 'subscriber') ?
                                <>
                                    <NavDropdown.Item as={Link} href={route('subscriber.dashboard')} className="fs-9">Dashboard</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} href={route('profile.edit')} className="fs-9">Profile</NavDropdown.Item>
                                </>
                                :
                                <>
                                    <NavDropdown.Item as={Link} href={route('admin.dashboard')} className="fs-9">Dashboard</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} href={route('profile.edit')} className="fs-9">Profile</NavDropdown.Item>
                                </>
                            }
                            <NavDropdown.Item as={Link} method="post" href={route('logout')} className="fs-9">Logout</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#" className="fs-8 text-secondary text-decoration-none">&copy; edatsu inc</NavDropdown.Item>
                        </NavDropdown>
                    </>
                    :
                    <>
                        <Nav.Item className="d-flex flex-row gap-2 mt-2 mt-lg-0">
                            <FlatButton href="/login" variant="dark" size="sm" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                                Login
                            </FlatButton>
                            <FlatButton
                                href="/sign-up"
                                size="sm"
                                style={{
                                    background: '#dc2626',
                                    borderColor: '#dc2626',
                                    color: '#fff',
                                }}
                            >
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
