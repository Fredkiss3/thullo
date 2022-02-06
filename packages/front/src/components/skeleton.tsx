import * as React from 'react';
import cls from '../styles/components/skeleton.module.scss';

export interface SkeletonProps {
    className?: string;
    as?: typeof HTMLElement['name'];
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, as }) => {
    const Tag = as || 'div';

    // @ts-ignore
    return <Tag className={`${className} ${cls.skeleton}`} />;
};
