import { Fragment } from "react"
import { Navbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import { truncateText, ActiveLink } from "@/utils/Index";
import { Images } from "@/utils/Images";
import { Moon, Sun } from 'lucide-react';


export default function Header({auth, isDarkMode, toggleDarkMode}){

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