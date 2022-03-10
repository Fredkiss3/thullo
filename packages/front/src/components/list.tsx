import * as React from 'react';
import { List as ListType } from '@/lib/types';

export interface ListProps {
    list: ListType;
    className?: string;
}

export function List({ list: { cards, name }, className }: ListProps) {
    return (
        <div className={className}>
            <span>{name}</span>
        </div>
    );
}
