export interface IResponse {
	result: 'error' | 'success';
	message?: string;
}

export interface IErrorResponse extends IResponse {
	result: 'error';
	message: string;
	error?: any;
}

export interface ISuccessResponse<T> extends IResponse {
	result: 'success';
	data: T;
}

function error(message: string, error?: any): IErrorResponse {
	return { error, message, result: 'error' };
}

function success<T>(data: T, message?: string): ISuccessResponse<T> {
	return { result: 'success', data, message };
}

export const res = { error, success };
