import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { jsonFetch } from '../lib/functions';

export interface CallBackPageProps {}

export const CallBackPage: React.FC<CallBackPageProps> = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        async function fetchData() {
            const query = new URLSearchParams(window.location.search);
            const code = query.get('code');

            const { data, errors } = await jsonFetch<{ success: boolean }>(
                `${import.meta.env.VITE_API_URL}/api/auth`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        authCode: code,
                    }),
                }
            );

            if (errors) {
                navigate(`/login?errors=${JSON.stringify(errors)}`);
            } else {
                navigate(`/profile`);
                console.log('Success ?', data.success);
                console.log('Errors ?', errors);
            }
        }

        fetchData();
    }, []);
    return (
        <>
            <h1>Chargement...</h1>
        </>
    );
};
