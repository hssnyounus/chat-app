import React from 'react';
import { Helmet } from 'react-helmet-async';

const Title = ({ title = "Chat", description = "This is chat app called by Abdullah" }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
        </Helmet>
    )
}

export default Title