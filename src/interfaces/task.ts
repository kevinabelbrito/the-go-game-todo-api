export interface Task {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    status: 'pending' | 'completed';
    userId?: string;
}