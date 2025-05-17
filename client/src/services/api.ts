import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    // baseURL: 'https://fitunite-diplom.onrender.com/api',
});

export const getAssignedProgram = () => axios.get('/assigned-programs/my-program');
export const assignProgram = (data: { program_id: number; client_id: number }) => axios.post('/assigned-programs/assign', data);
export const unassignProgram = (data: { client_id: number }) => axios.post('/assigned-programs/unassign', data);
export const getClientsWithPrograms = () => axios.get('/assigned-programs/clients');

// Add these new exports
export const getClientAssignedWorkouts = (clientId: number) => api.get(`/workouts/client/${clientId}/assigned`);
export const markWorkoutCompleted = (workoutId: number) => api.put(`/workouts/${workoutId}/status`, { status: 'completed' });
export const markWorkoutNotCompleted = (workoutId: number) => api.put(`/workouts/${workoutId}/status`, { status: 'skipped' });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    if (token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;