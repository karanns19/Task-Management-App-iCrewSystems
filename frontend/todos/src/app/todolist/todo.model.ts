// Todo Interface
export interface Todo {
    id: number;
    title: string;
    description: string;
    priority: string;
    completed: boolean;
    due_date: Date | null;
}
