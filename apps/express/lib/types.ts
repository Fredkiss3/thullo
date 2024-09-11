import { FieldErrors } from "@thullo/domain";


export type ApiResult<T> = {
    data: T;
    errors: FieldErrors;
}
