import * as React from 'react';
// Functions & Others
import { debounce, jsonFetch } from '@/lib/functions';
import type { ApiErrors, Photo } from '@/lib/types';

// Components
import { Skeletons } from '@/components/skeletons';
import { Button } from '@/components/button';
import { Dropdown } from '@/components/dropdown';
import { Icon } from '@/components/icon';
import { Input } from '@/components/input';

// Styles
import cls from '@/styles/components/photo-search.module.scss';

export interface PhotoSeachProps {
    show?: boolean;
    onSelect?: (photo: Photo) => void;
}

export function PhotoSearch({ show, onSelect }: PhotoSeachProps) {
    const [search, setSearch] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    const [photos, setPhotos] = React.useState<Photo[]>([]);

    const searchPhotos = React.useCallback(
        debounce(async (value: string) => {
            let data: Photo[] | null = null;
            let errors: ApiErrors = null;

            if (value.length === 0) {
                ({ data, errors } = await jsonFetch<Photo[] | null>(
                    `${import.meta.env.VITE_API_URL}/api/proxy/unsplash/list/`
                ));
            } else {
                ({ data, errors } = await jsonFetch<Photo[] | null>(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/proxy/unsplash/search?query=${value}`
                ));
            }

            if (errors !== null || data === null) {
                return;
            } else {
                setPhotos(data);
                setIsLoading(false);
            }
        }, 500),
        []
    );

    React.useEffect(() => {
        searchPhotos(search);
    }, [search]);

    const handleSearch = React.useCallback((value: string) => {
        setSearch((_) => {
            setIsLoading(true);
            searchPhotos(value);
            return value;
        });
    }, []);

    return (
        <Dropdown
            align="right"
            className={`${cls.photo_search} ${
                show && cls['photo_search--open']
            }`}
        >
            <div className={cls.photo_search__header}>
                <strong className={cls.photo_search__header__title}>
                    Photo Search
                </strong>
                <p className={cls.photo_search__header__description}>
                    Search unsplash for photos
                </p>
            </div>
            <Input
                value={search}
                className={cls.photo_search__input}
                onChange={handleSearch}
                placeholder="Keywords..."
                trailingElement={
                    <Button
                        square
                        variant="primary"
                        isStatic
                        renderLeadingIcon={(cls) => (
                            <Icon icon="search" className={cls} />
                        )}
                    />
                }
            />

            <ul className={cls.photo_search__list}>
                {isLoading ? (
                    <Skeletons
                        count={12}
                        as="li"
                        className={cls.photo_search__list__item}
                    />
                ) : photos.length === 0 ? (
                    <p className={cls.photo_search__list__empty}>
                        No photos found for the query &nbsp;
                        <strong>"{search}"</strong>
                    </p>
                ) : (
                    photos.map((photo) => (
                        <li
                            key={photo.id}
                            className={cls.photo_search__list__item}
                            title={`Photo by ${photo.authorName}`}
                            onClick={() => onSelect && onSelect(photo)}
                        >
                            <div
                                className={
                                    cls.photo_search__list__item__overlay
                                }
                            />
                            <img
                                src={photo.thumbnailURL}
                                alt={`Photo by ${photo.authorName}`}
                                className={cls.photo_search__list__item__image}
                            />
                        </li>
                    ))
                )}
            </ul>
        </Dropdown>
    );
}
