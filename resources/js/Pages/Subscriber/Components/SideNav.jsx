import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from '@inertiajs/react';

export default function SubscriberSideNav(){
    return(
        <>
        <ListGroup>
            <ListGroup.Item as={Link} href={route('subscriber.dashboard')} className='d-flex align-items-center gap-3' style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>dashboard</span>
                    <span>Dashboard</span>
            </ListGroup.Item>
            <ListGroup.Item as={Link} href={route('subscriber.bookmarked_opportunities')} className='d-flex align-items-center gap-3' style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>event</span>
                    <span>Opportunities</span>
            </ListGroup.Item>
            <ListGroup.Item as={Link} href={route('subscriber.bookmarked_tools')} className='d-flex align-items-center gap-3' style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>handyman</span>
                    <span>Tools</span>
            </ListGroup.Item>
            <ListGroup.Item as={Link} href={route('subscriber.notifications')} className='d-flex align-items-center gap-3' style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>notifications</span>
                    <span>Notifications</span>
            </ListGroup.Item>
            {/* <ListGroup.Item as={Link} href={route('subscriber.messages')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-envelope"></i>
                    </div>
                    <div>Messages</div>
            </ListGroup.Item> */}
            {/* <ListGroup.Item as={Link} href={route('subscriber.preferences')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-sliders"></i>
                    </div>
                    <div>Preferences</div>
            </ListGroup.Item> */}
            {/* <ListGroup.Item as={Link} href={route('subscriber.notification_settings')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-gear"></i>
                    </div>
                    <div>Settings</div>
            </ListGroup.Item> */}
            <ListGroup.Item as={Link} method="post"  href={route('logout')} className='d-flex align-items-center gap-3' style={{textDecoration: 'none'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>logout</span>
                    <span>Logout</span>
            </ListGroup.Item>
        </ListGroup>
        </>
    )
}