import React from 'react';

const Navigation = ({ isSignedIn, onRouteChange }) => {
    if (isSignedIn) {
        return (
            <nav className='w-80 fr flex justify-end'>
                <p onClick={() => onRouteChange('signout')} className='f3 link dim black pa3 pointer'>Sign Out</p>
            </nav>
        );
    } else {
        return (
            <nav className='w-80 fr flex justify-end'>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim black pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black pa3 pointer'>Register</p>
            </nav>
        );
    }
}

export default Navigation;