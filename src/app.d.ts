declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	} // interface Error {}
} // interface Locals {}
// interface PageData {}

// interface PageState {}
// interface Platform {}
export {};
