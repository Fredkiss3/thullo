import * as React from 'react';
import { Link } from 'react-router-dom';

export interface IndexPageProps {}

export const IndexPage: React.FC<IndexPageProps> = () => {
    return (
        <>
            <Link to={'/login'}>Connexion</Link>
        </>
    );
};
