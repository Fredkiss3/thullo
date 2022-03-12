import { useToastContext } from '@/context/toast.context';
import { useAddCardMutation } from '@/lib/queries';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { Icon } from './icon';
import cls from '@/styles/components/addcard-form.module.scss';

export function AddCardForm({
    listId,
    boardId,
    onCancel,
}: {
    listId: string;
    boardId: string;
    onCancel: () => void;
}) {
    const { dispatch } = useToastContext();
    const mutation = useAddCardMutation();
    const [title, setTitle] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const addCard = useCallback(() => {
        mutation.mutate({
            listId,
            boardId,
            title,
            onSuccess: () => {
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: `board-add-card-${new Date().getTime()}`,
                    message: 'New Card added successfully to the list',
                });
            },
        });
        setTitle('');
        onCancel();
    }, [title]);

    const focusInput = () => {
        if (ref.current) {
            ref.current.focus();
        }
    };

    useEffect(() => {
        focusInput();
    }, []);

    return (
        <form
            className={cls.add_card_form}
            onSubmit={(e) => {
                e.preventDefault();
                addCard();
            }}
        >
            <div className={cls.add_card_form__input}>
                <div
                    onPaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        if (text.length > 0 && ref.current) {
                            ref.current.innerText = text;
                            setTitle(text);
                        }
                    }}
                    ref={ref}
                    contentEditable
                    onInput={(ev) => {
                        setTitle((title) => {
                            if (ref.current) {
                                return ref.current.innerText;
                            }

                            return title;
                        });
                    }}
                    className={cls.add_card_form__input__field}
                />
                {title.length === 0 && (
                    <div
                        className={cls.add_card_form__input__placeholder}
                        onClick={focusInput}
                    >
                        Enter a title for this card...
                    </div>
                )}
            </div>
            <div className={cls.add_card_form__buttons}>
                <Button
                    variant="success"
                    type="submit"
                    disabled={title.trim().length === 0}
                    className={cls.add_card_form__buttons__btn}
                >
                    Save
                </Button>

                <Button
                    square
                    className={`
                        ${cls.add_card_form__buttons__cancel_btn}
                        ${cls.add_card_form__buttons__btn}`}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
