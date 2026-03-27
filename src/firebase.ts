// firebase.ts — Firebase SDK removed.
// Components import { auth } from '../firebase' for backward compatibility.
// All data operations use src/services/dataService.ts instead.

export { authStore as auth } from './services/authService';
export { OperationType, handleDataError as handleFirestoreError } from './services/dataService';
