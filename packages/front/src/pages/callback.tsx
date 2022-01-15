import * as React from 'react';
import { useEffect } from 'react';
import { Pulse } from '../components/pulse';
import { useLoginMutation } from '../lib/hooks';
import { Loader } from '../components/loader';

export interface CallBackPageProps {}

export const CallBackPage: React.FC<CallBackPageProps> = () => {
    const mutation = useLoginMutation();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        mutation.mutate(code);
    }, []);
    return <Loader />;
};
