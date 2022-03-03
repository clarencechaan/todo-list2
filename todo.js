class Todo {

    done = false;

    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getDueDate() {
        return this.dueDate;
    }

    getPriority() {
        return this.priority;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    getDoneStatus() {
        return this.done;
    }

    toggleDoneStatus() {
        this.done = !this.done;
    }

    reconstructTodo(todoObject) {
        this.title = todoObject.title;
        this.description = todoObject.description;
        this.dueDate = todoObject.dueDate;
        this.priority = todoObject.priority;
        this.done = todoObject.done;
    }
};

export default Todo;