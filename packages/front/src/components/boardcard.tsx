import * as React from 'react';
import { Board } from '../lib/types';
import { Avatar } from './avatar';
import cls from '../styles/components/boardcard.module.scss';
import { Link } from 'react-router-dom';
import { Skeleton } from './skeleton';

export interface BoardCardProps {
    board?: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) =>
    board ? (
        <Link className={cls.boardcard} to={board.id}>
            <img
                className={cls.boardcard__cover}
                src={board.cover.url}
                alt="Image de couverture du tableau"
            />
            <h3 className={cls.boardcard__title}>{board.name}</h3>
            <ul className={cls.boardcard__avatar_list}>
                {board.participants.slice(0, 3).map((p, index) => (
                    <li key={index}>
                        <Avatar name={p.name} photoURL={p.avatarURL} />
                    </li>
                ))}

                {board.participants.length > 3 && (
                    <li className={cls.boardcard__avatar_list__more}>
                        +{board.participants.length - 3} Autres
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
                {[1, 2, 3].map((p, index) => (
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
