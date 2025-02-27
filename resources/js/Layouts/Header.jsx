import { Fragment } from "react"
import { Navbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import { truncateText } from "@/utils";



export default function Header({auth}){

// useEffect(()=>{
//     console.log(auth?.id);
// })

function toggleMode(){
    
}

return(
<Fragment>
<Navbar expand="lg" className="header border-0 m-0 fs-9 custom-title align-middle" bg="dark" variant="dark">
<Container className="align-middle">
{/* Logo */}
<Link href="/">
    <Image src="img/logo/trans/logo_trans_4.png" width={50} className="img-fluid" alt="logo" />
</Link>
{/* Navbar Collapse */}
<Navbar.Collapse id="navbarSupportedContent">
    <div className="d-flex justify-content-between w-100">
    <form class="d-flex" role="search">
    </form>
    <Nav className="m-0 p-0 d-flex align-items-center">
        <Nav.Item>
        <Link href="sponsorship" className="nav-link text-light me-3 text-decoration-none">
            Sponsorship
        </Link>
        </Nav.Item>
        <Nav.Item>
        <Link href="/" className="nav-link text-light me-3 text-decoration-none">
            Opportunities
        </Link>
        </Nav.Item>
        {/* Dark Mode Toggle */}
        <Button className="btn bg-transparent border-0 me-3" onClick={toggleMode}>
        <span className="material-symbols-outlined align-middle">dark_mode</span>
        </Button>
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

            <NavDropdown.Item as={Link} href={route('profile.edit')} className="fs-9">
                Settings
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} method="post" href={route('logout')} className="fs-9" >
                Logout
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" className="fs-8 text-secondary">&copy; edatsu inc</NavDropdown.Item>
        </NavDropdown>
        </>
        :
        <>
        <Link href="/login" className="btn text-decoration-none fs-9 poppins-semibold custom-bg-highlight text-light border-0 shadow-sm py-2 px-4 me-3">
            Login
        </Link>
        <Link href="/sign-up" className="btn text-decoration-none fs-9 poppins-semibold custom-bg-highlight text-light border-0 shadow-sm py-2 px-4">
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