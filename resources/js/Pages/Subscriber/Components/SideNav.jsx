import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from '@inertiajs/react';

export default function SubscriberSideNav(){
    return(
        <>
        <ListGroup>
            <ListGroup.Item as={Link} href={route('subscriber.dashboard')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <span class="material-symbols-outlined">
                        dashboard
                        </span>
                    </div>
                    <div>Dashboard</div>
            </ListGroup.Item>
            {/* <ListGroup.Item as={Link} href={route('subscriber.notifications')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <span class="material-symbols-outlined">
                        notifications
                        </span>
                    </div>
                    <div>Notifications</div>
            </ListGroup.Item> */}
            <ListGroup.Item as={Link} href={route('subscriber.bookmarks')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <span class="material-symbols-outlined">
                        bookmarks
                        </span>
                    </div>
                    <div>Bookmarks</div>
            </ListGroup.Item>
            {/* <ListGroup.Item>Feeds</ListGroup.Item> */}
            {/* <ListGroup.Item as={Link} href={route('subscriber.notification_settings')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <span class="material-symbols-outlined">
                        notification_add
                        </span>
                    </div>
                    <div>Notification Settings</div>
            </ListGroup.Item> */}
            <ListGroup.Item as={Link} method="post"  href={route('logout')} className='d-flex justify-content-between align-items-center'>
                    <div>
                        <span class="material-symbols-outlined">
                        logout
                        </span>
                    </div>
                    <div>Logout</div>
            </ListGroup.Item>
        </ListGroup>
        </>
    )
}