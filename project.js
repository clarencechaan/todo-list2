class Project {

    todos = [];

    constructor(name) {
        this.name = name;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodoAtIndex(index) {
        this.todos.splice(index, 1);
    }

    getName() {
        return this.name;
    }
}

export default Project;