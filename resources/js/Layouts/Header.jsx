import { Fragment } from "react"
import { Navbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import { truncateText, ActiveLink } from "@/utils/Index";
import { Images } from "@/utils/Images";


export default function Header({auth}){

return(
<Fragment>
<Navbar expand="lg" className="header border-0 custom-title align-middle"  bg="dark" variant="dark">
<Container className="align-middle">
{/* Logo */}
<Link href="/">
    <Image src={Images.app_logo_trans} width={50} className="img-fluid" alt="logo" />
</Link>
{/* Navbar Collapse */}
<Navbar.Collapse id="navbarSupportedContent">
    <div className="d-flex justify-content-between w-100">
    <form class="d-flex" role="search">
    </form>
    <Nav className="m-0 p-0 d-flex align-items-center fs-9">
        {/* <Nav.Item>
            <Button className="btn bg-transparent border-0 me-3" onClick={toggleMode}>
                <span className="material-symbols-outlined align-middle">search</span>
            </Button>
        </Nav.Item> */}
        {/* <Nav.Item>
        <Link href="toolshed" className="nav-link text-light me-3 text-decoration-none">
            Pricing
        </Link>
        </Nav.Item> */}
        {/* <Nav.Item>
        <Link href="news" className="nav-link text-light me-3 text-decoration-none">
        News
        </Link>
        </Nav.Item> */}
        <Nav.Item>
        <Link href={route('oppty')} className={`nav-link me-3 text-decoration-none ${ActiveLink('/opportunities')}`}> 
        Opportunities
        </Link>
        </Nav.Item>
        {/* <Nav.Item>
        <Link href="/money-guide"  className={`nav-link text-light me-3 text-decoration-none poppins-light ${ActiveLink('/money-guide')}`}>
            Money Guide
        </Link>
        </Nav.Item> */}
        {/* <Nav.Item>
        <Link href="/toolshed"  className={`nav-link text-light me-3 text-decoration-none poppins-light ${ActiveLink('/toolshed')}`}>
            Toolshed
        </Link>
        </Nav.Item> */}
        {/* <Nav.Item>
        <Link href="toolshed" className="nav-link text-light me-3 text-decoration-none">
            Groups(FB)
        </Link>
        </Nav.Item> */}
        {/* Dark Mode Toggle */}
        {/* <Button className="btn bg-transparent border-0 me-3" onClick={toggleMode}>
        <span className="material-symbols-outlined align-middle">dark_mode</span>
        </Button> */}
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

            {/* <NavDropdown.Item as={Link} href={route('profile.edit')} className="fs-9">
                Settings
            </NavDropdown.Item> */}
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