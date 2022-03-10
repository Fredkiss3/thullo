import { List as ListType } from '@/lib/types';
import cls from '@/styles/components/list.module.scss';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { useToastContext } from '@/context/toast.context';

export interface ListProps {
    list: ListType;
    className?: string;
}

export function List({ list: { cards, name }, className }: ListProps) {
    const { dispatch } = useToastContext();
    return (
        <div className={`${cls.list} ${className ?? ''}`}>
            <div className={cls.list__header}>
                <span>{name}</span>
                <Button
                    square
                    renderTrailingIcon={(cls) => (
                        <Icon icon="h-dots" className={cls} />
                    )}
                    onClick={() => {
                        dispatch({
                            type: 'ADD_WARNING',
                            key: 'list',
                            message: 'This feature is not implemented yet',
                        });
                    }}
                />
            </div>
            <div className={cls.list__cards}></div>
        </div>
    );
}
