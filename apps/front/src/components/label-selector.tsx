import * as React from 'react';
// Functions & others
import type { Color, Label } from '@/lib/types';
import { TAG_COLORS } from '@/lib/constants';
// components
import { Dropdown } from '@/components/dropdown';

// Styles
import cls from '@/styles/components/label-selector.module.scss';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Input } from '@/components/input';
import { Tag } from '@/components/tag';

export interface LabelSelectorProps {
    availableLabels: Label[];
    onSelect: (args: { id: string | null; color: Color; name: string }) => void;
}

export function LabelSelector({
    onSelect,
    availableLabels,
}: LabelSelectorProps) {
    const [name, setName] = React.useState('');
    const [currentColor, setCurrentColor] = React.useState<Color | null>(null);
    const [selectedLabel, setSelectedLabel] = React.useState<Label | null>(
        null
    );

    return (
        <Dropdown
            testId="label-selector"
            align="right"
            className={cls.label_selector}
        >
            <div className={cls.label_selector__header}>
                <strong className={cls.label_selector__header__title}>
                    Label
                </strong>
                <p className={cls.label_selector__header__description}>
                    Select a name and color, or choose one of the available
                </p>
            </div>

            <Input
                value={name}
                className={cls.label_selector__input}
                onChange={(newValue) => {
                    setName(newValue);
                    setSelectedLabel(null);
                }}
                testId="label-selector-input"
                placeholder="Label..."
            />

            {availableLabels.length > 0 && (
                <div className={cls.label_selector__available}>
                    <div className={cls.label_selector__available__header}>
                        <Icon
                            icon="tag"
                            className={
                                cls.label_selector__available__header__icon
                            }
                        />
                        <small>Available</small>
                    </div>

                    <ul className={cls.label_selector__available__list}>
                        {availableLabels.map((label) => (
                            <li
                                key={label.id}
                                className={
                                    cls.label_selector__available__list__item
                                }
                            >
                                <Tag
                                    selected={selectedLabel?.id === label.id}
                                    onSelect={() => {
                                        setSelectedLabel(label);
                                        setName('');
                                        setCurrentColor(null);
                                    }}
                                    color={label.color}
                                    text={label.name}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <ul className={cls.label_selector__colors}>
                {Object.entries(TAG_COLORS).map(([key, color]) => (
                    <button
                        key={key}
                        className={cls.label_selector__colors__item}
                        style={{
                            // @ts-ignore
                            '--bg-color': color.fg,
                            '--fg-color': color.bg,
                        }}
                        title={key.toLocaleLowerCase()}
                        onClick={() => {
                            setSelectedLabel(null);
                            setCurrentColor(key as Color);
                        }}
                    >
                        {currentColor === key && (
                            <Icon
                                className={
                                    cls.label_selector__colors__item__icon
                                }
                                icon="check"
                            />
                        )}
                    </button>
                ))}
            </ul>

            <Button
                variant={'primary'}
                className={cls.label_selector__button}
                onClick={() => {
                    if (selectedLabel) {
                        onSelect(selectedLabel);
                    } else {
                        onSelect({
                            id: null,
                            name,
                            color: currentColor as Color,
                        });
                    }
                }}
                disabled={
                    (name.trim().length === 0 || !currentColor) &&
                    !selectedLabel
                }
            >
                {selectedLabel ? 'Select' : 'Add'}
            </Button>
        </Dropdown>
    );
}
