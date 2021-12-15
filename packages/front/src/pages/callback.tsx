import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pulse } from '../components/pulse';
import { jsonFetch } from '../lib/functions';

export interface CallBackPageProps {}

export const CallBackPage: React.FC<CallBackPageProps> = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        async function fetchData() {
            const query = new URLSearchParams(window.location.search);
            const code = query.get('code');

            const { data, errors } = await jsonFetch<{ success: boolean }>(
                `/.netlify/functions/callback`,
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

            console.log('Success ?', data?.success);
            console.log('Errors ?', errors);
            if (errors) {
                navigate(`/login?errors=${JSON.stringify(errors)}`);
            } else {
                navigate(`/profile`);
            }
        }

        fetchData();
    }, []);
    return (
        <Pulse>
            <h1>Nous récupérons vos informations...</h1>
        </Pulse>
    );
};
