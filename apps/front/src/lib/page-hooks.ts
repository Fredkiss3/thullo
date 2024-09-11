import { useParams } from 'react-router-dom';
import {
    useSingleBoardQuery,
    useSingleCardQuery,
    useUserQuery,
} from '@/lib/queries';
import { BoardDetails, CardDetails } from '@/lib/types';

export function useCardDetailsData(): {
    board?: BoardDetails | null;
    card?: CardDetails | null;
    parentListName?: string;
    isLoading: boolean;
    canEditCard: boolean;
} {
    const { boardId, cardId } = useParams<{
        boardId: string;
        cardId: string;
    }>();
    const { data: board } = useSingleBoardQuery(boardId!);
    const { data: card, isLoading } = useSingleCardQuery(boardId!, cardId!);
    const { data: user } = useUserQuery();

    const parentListName = board?.lists.find(
        (list) => list.id === card?.parentListId
    )?.name;

    const isBoardAdmin = user?.id === board?.admin.id;
    const canEditCard =
        board?.participants.some(
            (participant) => participant.id === user?.id
        ) || isBoardAdmin;

    return {
        board,
        card,
        isLoading,
        parentListName,
        canEditCard,
    };
}
