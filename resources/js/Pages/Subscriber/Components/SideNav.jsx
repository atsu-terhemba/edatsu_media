import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from '@inertiajs/react';

export default function SubscriberSideNav(){
    return(
        <>
        <ListGroup>
            <ListGroup.Item as={Link} href={route('subscriber.dashboard')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-speedometer2"></i>
                    </div>
                    <div>Dashboard</div>
            </ListGroup.Item>
            <ListGroup.Item as={Link} href={route('subscriber.bookmarked_opportunities')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-calendar-event"></i>
                    </div>
                    <div>Opportunities</div>
            </ListGroup.Item>
            <ListGroup.Item as={Link} href={route('subscriber.bookmarked_tools')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-tools"></i>
                    </div>
                    <div>Tools</div>
            </ListGroup.Item>
            <ListGroup.Item as={Link} href={route('subscriber.notifications')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-bell"></i>
                    </div>
                    <div>Notifications</div>
            </ListGroup.Item>
            {/* <ListGroup.Item as={Link} href={route('subscriber.messages')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-envelope"></i>
                    </div>
                    <div>Messages</div>
            </ListGroup.Item> */}
            <ListGroup.Item as={Link} href={route('subscriber.preferences')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-sliders"></i>
                    </div>
                    <div>Preferences</div>
            </ListGroup.Item>
            {/* <ListGroup.Item as={Link} href={route('subscriber.notification_settings')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-gear"></i>
                    </div>
                    <div>Settings</div>
            </ListGroup.Item> */}
            <ListGroup.Item as={Link} method="post"  href={route('logout')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <i className="bi bi-box-arrow-right"></i>
                    </div>
                    <div>Logout</div>
            </ListGroup.Item>
        </ListGroup>
        </>
    )
}