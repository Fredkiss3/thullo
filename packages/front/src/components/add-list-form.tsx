import { useToastContext } from '@/context/toast.context';
import { useAddListMutation } from '@/lib/queries';
import * as React from 'react';

// styles
import cls from '@/styles/components/column-section.module.scss';
import { Input } from './input';
import { Button } from './button';

export interface AddListFormProps {}

export function AddListForm({
    boardId,
    onCancel,
}: {
    boardId: string;
    onCancel: () => void;
}) {
    const { dispatch } = useToastContext();
    const mutation = useAddListMutation();
    const [listName, setListName] = React.useState('');
    const ref = React.useRef<HTMLInputElement>(null);

    const addList = React.useCallback(() => {
        mutation.mutate({
            boardId,
            name: listName,
            onSuccess: () => {
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: `board-add-list-${new Date().getTime()}`,
                    message: 'List successfully added to the board.',
                });
            },
        });

        setListName('');
        onCancel();
    }, [listName]);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <>
            <form
                data-test-id="add-list-form"
                className={cls.column_section__list__add_form}
                onSubmit={(e) => {
                    e.preventDefault();
                    addList();
                }}
            >
                <Input
                    ref={ref}
                    placeholder="New List name"
                    value={listName}
                    className={cls.column_section__list__add_form__input}
                    onChange={(newName) => setListName(newName)}
                />
                <div className={cls.column_section__list__add_form__buttons}>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={listName.length === 0}
                    >
                        Add List
                    </Button>

                    <Button
                        square
                        className={
                            cls.column_section__list__add_form__cancel_btn
                        }
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </>
    );
}
