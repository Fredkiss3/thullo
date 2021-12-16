import * as React from 'react';
import { useEffect } from 'react';
import { Pulse } from '../components/pulse';
import { useLoginMutation } from '../lib/hooks';

export interface CallBackPageProps {}

export const CallBackPage: React.FC<CallBackPageProps> = () => {
    const mutation = useLoginMutation();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        mutation.mutate(code);
    }, []);
    return (
        <Pulse>
            <h1>Nous récupérons vos informations...</h1>
        </Pulse>
    );
};
