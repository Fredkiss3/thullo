export class MemberAlreadyInBoardError extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MemberAlreadyInBoardError);
    }

    // For custom errors, we should explicitly set prototypes
    // Or else it will considers this as an "Error"
    Object.setPrototypeOf(this, MemberAlreadyInBoardError.prototype);
    this.name = 'MemberAlreadyInBoardError';
  }
}

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


export class ListPositionOutOfBoundsError extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ListPositionOutOfBoundsError);
    }

    // For custom errors, we should explicitly set prototypes
    // Or else it will considers this as an "Error"
    Object.setPrototypeOf(this, ListPositionOutOfBoundsError.prototype);
    this.name = 'ListPositionOutOfBoundsError';
  }
}