import * as React from 'react';
import { Seo } from '../../components/seo';

export interface DashboardDetailsProps {}

export const DashboardDetails = ({}: DashboardDetailsProps) => {
    return (
        <>
            <Seo title="Dashboard Details" />
            <div
                style={{
                    display: 'flex',
                    height: '50vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <h1> Not implemented yet.</h1>
            </div>
        </>
    );
};
