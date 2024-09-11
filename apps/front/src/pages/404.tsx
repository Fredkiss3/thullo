import * as React from 'react';
import { Link } from 'react-router-dom';

export function Error404Page() {
    return (
        <>
            <main style={{ padding: '1rem' }}>
                <p>There's nothing here!</p>
                <Link
                    to={'/'}
                    style={{
                        textDecoration: 'underline',
                        color: 'blue',
                    }}
                >
                    Go back to the homepage
                </Link>
            </main>
        </>
    );
}
