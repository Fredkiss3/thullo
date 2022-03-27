import * as React from 'react';

// Functions & Others
import type { Board } from '@/lib/types';

// Components
import { Link } from 'react-router-dom';
import { Avatar } from './avatar';
import { Skeleton } from './skeleton';

// Styles
import cls from '@/styles/components/boardcard.module.scss';

export interface BoardCardProps {
    board?: Board;
    loading?: boolean;
}

export function BoardCard({ board, loading }: BoardCardProps) {
    return !loading && board ? (
        <Link
            className={cls.boardcard}
            to={board.id!}
            data-test-id="board-card"
        >
            <img
                className={cls.boardcard__cover}
                src={board.cover.url}
                alt="Image de couverture du tableau"
            />
            <h3
                className={cls.boardcard__title}
                data-test-id="board-card-title"
            >
                {board.name}
            </h3>
            <ul className={cls.boardcard__avatar_list}>
                {board.participants.slice(0, 3).map((p, index) => (
                    <li key={index}>
                        <Avatar
                            name={p.name}
                            username={p.login}
                            photoURL={p.avatarURL}
                        />
                    </li>
                ))}

                {board.participants.length > 3 && (
                    <li className={cls.boardcard__avatar_list__more}>
                        +{board.participants.length - 3} Others
                    </li>
                )}
            </ul>
        </Link>
    ) : (
        // Skeleton state
        <div className={cls.boardcard}>
            <Skeleton className={cls.boardcard__cover_skeleton} as="div" />
            <Skeleton className={cls.boardcard__title_skeleton} as="h3" />
            <ul className={cls.boardcard__avatar_list}>
                {[1, 2, 3].map((_, index) => (
                    <li key={index}>
                        <Skeleton
                            as={'div'}
                            className={
                                cls.boardcard__avatar_list__avatar_skeleton
                            }
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
