import * as React from 'react';
import { useLoginMutation } from '@/lib/queries';
import { Loader } from '@/components/loader';

export function CallBackPage() {
    const mutation = useLoginMutation();

    React.useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        mutation.mutate(code);
    }, []);
    return <Loader />;
}
