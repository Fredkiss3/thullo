import * as React from 'react';
import { Dropdown, DropdownProps } from './dropdown';
import { Icon, IconName } from './icon';

import cls from '../styles/components/dropdown-menu.module.scss';
import { Link } from 'react-router-dom';
import { Button } from './button';

export type DropdownMenuItem = {
    label: string;
    link: string;
    icon: IconName;
};

export type DropdownMenuButton = {
    label: string;
    icon: IconName;
    onClick?: () => void;
    danger?: boolean;
};

export type DropdownDivider = {
    divider: true;
};

function isDropdownDivider(
    item: DropdownMenuItem | DropdownDivider | DropdownMenuButton
): item is DropdownDivider {
    return (item as DropdownDivider).divider;
}

function isDropdownMenuButton(
    item: DropdownMenuItem | DropdownMenuButton | DropdownDivider
): item is DropdownMenuButton {
    return (item as DropdownMenuButton).onClick !== undefined;
}

function getComponentFromType(
    item: DropdownMenuItem | DropdownDivider | DropdownMenuButton
): React.ReactElement {
    if (isDropdownDivider(item)) {
        return <li className={cls.dropdown_menu__divider} />;
    }

    if (isDropdownMenuButton(item)) {
        return (
            <li className={cls.dropdown_menu__item}>
                <Button
                    onClick={item.onClick}
                    className={`
                        ${cls.dropdown_menu__item__button}
                        ${
                            item.danger
                                ? cls[`dropdown_menu__item__button--danger`]
                                : ''
                        }
                    `}
                >
                    <Icon
                        icon={item.icon}
                        className={cls.dropdown_menu__item__link__icon}
                    />
                    <span className={cls.dropdown_menu__item__link__label}>
                        {item.label}
                    </span>
                </Button>
            </li>
        );
    }

    return (
        <li className={cls.dropdown_menu__item}>
            <Link to={item.link} className={cls.dropdown_menu__item__link}>
                <Icon
                    icon={item.icon}
                    className={cls.dropdown_menu__item__link__icon}
                />
                <span className={cls.dropdown_menu__item__link__label}>
                    {item.label}
                </span>
            </Link>
        </li>
    );
}

export type DropdownItem =
    | DropdownMenuItem
    | DropdownMenuButton
    | DropdownDivider;

export type DropdownMenuProps = Omit<DropdownProps, 'children'> & {
    items: DropdownItem[];
};

export function DropdownMenu({
    items,
    align = 'left',
    className,
}: DropdownMenuProps) {
    return (
        <Dropdown className={className} align={align}>
            <ul className={cls.dropdown_menu}>
                {items.map((item, i) => (
                    <React.Fragment key={i}>
                        {getComponentFromType(item)}
                    </React.Fragment>
                ))}
            </ul>
        </Dropdown>
    );
}
