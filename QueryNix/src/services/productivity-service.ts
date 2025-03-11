
import { toast } from 'sonner';

export type Task = {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
};

// In-memory store for tasks (in a real app, this would be persisted)
let tasks: Task[] = [];

export const parseTaskFromText = async (text: string): Promise<Task | null> => {
  try {
    // Extract task details using regex
    const titleMatch = text.match(/(?:add|create)(?:\sa)?\stask(?:\scalled)?\s["']?([^"']+)["']?/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract priority if mentioned
    let priority: 'low' | 'medium' | 'high' = 'medium';
    if (text.match(/high priority/i)) {
      priority = 'high';
    } else if (text.match(/low priority/i)) {
      priority = 'low';
    }
    
    // Extract due date if mentioned
    let dueDate: Date | undefined;
    const tomorrowMatch = text.match(/(?:due|by)\s(?:tomorrow)/i);
    const todayMatch = text.match(/(?:due|by)\s(?:today)/i);
    const specificDateMatch = text.match(/(?:due|by)\s(?:on)?\s?(\d{1,2}(?:st|nd|rd|th)?\s(?:of\s)?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s\d{4})/i);
    
    if (tomorrowMatch) {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
    } else if (todayMatch) {
      dueDate = new Date();
    } else if (specificDateMatch) {
      // Simple date parsing - in a real app, use a proper date parsing library
      try {
        dueDate = new Date(specificDateMatch[1]);
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    }
    
    // If we have at least a title, create and add the task
    if (title) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        priority,
        dueDate,
        completed: false,
        createdAt: new Date()
      };
      
      tasks.push(newTask);
      toast.success('Task added successfully');
      return newTask;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing task:', error);
    toast.error('Failed to parse task from text');
    return null;
  }
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task => {
  const newTask: Task = {
    id: crypto.randomUUID(),
    ...task,
    completed: false,
    createdAt: new Date()
  };
  
  tasks.push(newTask);
  return newTask;
};

export const getTasks = (): Task[] => {
  return [...tasks].sort((a, b) => {
    // Sort by completed status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by due date if available
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    
    // Tasks with due dates come before those without
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally sort by creation date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return null;
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  return tasks[taskIndex];
};

export const completeTask = (id: string): Task | null => {
  return updateTask(id, { completed: true });
};

export const deleteTask = (id: string): boolean => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return false;
  }
  
  tasks.splice(taskIndex, 1);
  return true;
};

export const clearCompletedTasks = (): number => {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => !task.completed);
  return initialLength - tasks.length;
};
