import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export interface HomePageProps {}

export function HomePage() {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate('/dashboard');
    }, []);

    return <></>;
}
