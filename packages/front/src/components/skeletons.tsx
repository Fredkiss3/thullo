import * as React from 'react';
// Components
import { Skeleton, SkeletonProps } from './skeleton';

export interface SkeletonListProps extends SkeletonProps {
    count: number;
    as?: string;
}

export function Skeletons({ count, className, as }: SkeletonListProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} className={className} as={as} />
            ))}
        </>
    );
}
