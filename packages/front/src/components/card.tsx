import * as React from 'react';
import cls from '@/styles/components/card.module.scss';
import { Card as CardType } from '@/lib/types';
import { Link } from 'react-router-dom';

export interface CardProps {
    card: CardType;
    boardId: string;
    className?: string;
}

export function Card({ card: { id, title }, className, boardId }: CardProps) {
    return (
        <Link className={cls.card} to={`/dashboard/${boardId}/card/${id}`}>
            <span className={cls.card__title}> {title}</span>
        </Link>
    );
}
