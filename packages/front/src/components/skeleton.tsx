import * as React from 'react';

// styles
import cls from '@/styles/components/skeleton.module.scss';

export interface SkeletonProps {
    className?: string;
    as?: typeof HTMLElement['name'];
}

export function Skeleton({ className, as }: SkeletonProps) {
    const Tag = as ?? 'div';

    // @ts-ignore
    return <Tag className={`${className} ${cls.skeleton}`} />;
}
