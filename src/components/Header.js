import React from 'react'
import { BsPlusSquare } from "react-icons/bs";


import { useAuthenticator } from '@aws-amplify/ui-react';

function Header({ createOn, user, handleClick }) {

    return (
        <header>
            <h1>My Movie App </h1>
            { user && <div className='header-btn'>
                <BsPlusSquare onClick={createOn} />
                <button className='sign-out' onClick={handleClick }>Sign out</button>

            </div>}
        </header>
    )
}

export default Header