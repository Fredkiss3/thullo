export class OperationUnauthorizedError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OperationUnauthorizedError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, OperationUnauthorizedError.prototype);
        this.name = 'OperationUnauthorizedError';
    }
}

export class InvalidPositionError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidPositionError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, InvalidPositionError.prototype);
        this.name = 'InvalidPositionError';
    }
}

export class ListNotFoundError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ListNotFoundError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, ListNotFoundError.prototype);
        this.name = 'ListNotFoundError';
    }
}

export class MemberNotInBoardError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MemberNotInBoardError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, MemberNotInBoardError.prototype);
        this.name = 'MemberNotInBoardError';
    }
}

export class CardNotFoundError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CardNotFoundError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, CardNotFoundError.prototype);
        this.name = 'CardNotFoundError';
    }
}

export class LabelNotFoundError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LabelNotFoundError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, LabelNotFoundError.prototype);
        this.name = 'LabelNotFoundError';
    }
}
