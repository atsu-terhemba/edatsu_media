import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "@inertiajs/react";
import { useState } from 'react';

export default function AdminSideNav(){


    const [openMenus, setOpenMenus] = useState({
        generalOptions: false,
        opportunityPosts: false,
        toolshedPosts: false,
        moneyGuidePosts: false,
      });
    
      const toggleMenu = (menu) => {
        setOpenMenus((prevState) => ({
          ...prevState,
          [menu]: !prevState[menu],
        }));
      };

    return(
        <>
        <ListGroup>
      {/* Dashboard */}
      <ListGroup.Item as={Link} href={route('admin.dashboard')} className='d-flex justify-content-between align-items-center'>
        <div>
          <span className="material-symbols-outlined">dashboard</span>
        </div>
        <div>Dashboard</div>
      </ListGroup.Item>

      {/* Users */}
      <ListGroup.Item as={Link} href={route('admin.users')} className='d-flex justify-content-between align-items-center'>
        <div>
          <span className="material-symbols-outlined">group</span>
        </div>
        <div>Users</div>
      </ListGroup.Item>

      {/* RSS Feed - COMMENTED: No page exists yet */}
      {/* <ListGroup.Item as={Link} href="#" className='d-flex justify-content-between align-items-center'>
        <div>
          <span className="material-symbols-outlined">rss_feed</span>
        </div>
        <div>RSS Feed</div>
      </ListGroup.Item> */}

      {/* General Options */}
      <ListGroup.Item
        action
        onClick={() => toggleMenu('generalOptions')}
        className='d-flex justify-content-between align-items-center'
      >
        <div>
          <span className="material-symbols-outlined">settings</span>
        </div>
        <div>
          General Options <i className={`fas fa-caret-${openMenus.generalOptions ? 'down' : 'right'}`}></i>
        </div>
      </ListGroup.Item>
      {openMenus.generalOptions && (
        <ListGroup>
          <ListGroup.Item as={Link} href={route('admin.brand-labels')} className='text-decoration-none'>
            Create Brand Labels
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.tag')} className='text-decoration-none'>
            Create Tags
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.regions')} className='text-decoration-none'>
            Create Regions
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.continent')} className='text-decoration-none'>
            Create Continent
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.countries')} className='text-decoration-none'>
            Create Countries
          </ListGroup.Item>
        </ListGroup>
      )}

      {/* Opportunity Posts */}
      <ListGroup.Item
        action
        onClick={() => toggleMenu('opportunityPosts')}
        className='d-flex justify-content-between align-items-center'
      >
        <div>
          <span className="material-symbols-outlined">post_add</span>
        </div>
        <div>
          Opportunity Posts <i className={`fas fa-caret-${openMenus.opportunityPosts ? 'down' : 'right'}`}></i>
        </div>
      </ListGroup.Item>
      {openMenus.opportunityPosts && (
        <ListGroup>
          <ListGroup.Item as={Link} href={route('admin.opp')} className='text-decoration-none'>
            Create Post
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.all_opp_post')} className='text-decoration-none'>
            All Posts
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.categories')} className='text-decoration-none'>
            Create Categories
          </ListGroup.Item>
        </ListGroup>
      )}

       {/*MoneyGuide Posts - COMMENTED: Routes not properly implemented yet */}
       {/* <ListGroup.Item
        action
        onClick={() => toggleMenu('moneyGuidePosts')}
        className='d-flex justify-content-between align-items-center'
      >
        <div>
          <span className="material-symbols-outlined">post_add</span>
        </div>
        <div>
          Money Guide <i className={`fas fa-caret-${openMenus.moneyGuidePosts ? 'down' : 'right'}`}></i>
        </div>
      </ListGroup.Item>
      {openMenus.moneyGuidePosts && (
        <ListGroup>
          <ListGroup.Item as={Link} href={route('admin.opp')} className='text-decoration-none'>
            Create Post
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.all_opp_post')} className='text-decoration-none'>
            All Posts
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.categories')} className='text-decoration-none'>
            Create Categories
          </ListGroup.Item>
        </ListGroup>
      )} */}





      {/* Toolshed Posts */}
      <ListGroup.Item
        action
        onClick={() => toggleMenu('toolshedPosts')}
        className='d-flex justify-content-between align-items-center'
      >
        <div>
          <span className="material-symbols-outlined">build</span>
        </div>
        <div>
          Toolshed Posts <i className={`fas fa-caret-${openMenus.toolshedPosts ? 'down' : 'right'}`}></i>
        </div>
      </ListGroup.Item>
      {openMenus.toolshedPosts && (
        <ListGroup>
          <ListGroup.Item as={Link} href={route('admin.products')} className='text-decoration-none'>
            Create Product
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.all_products')} className='text-decoration-none'>
            All Products
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.product_categories')} className='text-decoration-none'>
            Product Categories
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.product_functionality')} className='text-decoration-none'>
            Product Functionality
          </ListGroup.Item>
          <ListGroup.Item as={Link} href={route('admin.product_pricing')} className='text-decoration-none'>
            Product Pricing
          </ListGroup.Item>
        </ListGroup>
      )}
    </ListGroup>
        </>
    )
}