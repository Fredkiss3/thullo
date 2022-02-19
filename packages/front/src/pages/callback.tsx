import * as React from 'react';
import { useEffect } from 'react';
import { useLoginMutation } from '../lib/queries';
import { Loader } from '../components/loader';

export interface CallBackPageProps {}

export function CallBackPage() {
    const mutation = useLoginMutation();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        mutation.mutate(code);
    }, []);
    return <Loader />;
}
