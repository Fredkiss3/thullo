import * as React from 'react';
// Functions & Others
// ...

// components
import { Icon } from './icon';
import { Button, ButtonProps } from './button';

// styles
import cls from '@/styles/components/info-button.module.scss';

export interface InfoButtonProps
    extends Pick<
        ButtonProps,
        'onClick' | 'children' | 'type' | 'ariaLabel' | 'className'
    > {}

export function InfoButton({ children, ...rest }: InfoButtonProps) {
    return (
        <Button className={cls.info_button} {...rest}>
            {children} <Icon icon="plus" className={cls.info_button__icon} />
        </Button>
    );
}
