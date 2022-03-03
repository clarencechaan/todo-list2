import Todo from "./todo.js";

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

    reconstructProject(projectObject) {
        this.name = projectObject.name;

        for (let todoObject of projectObject.todos) {
            const todo = new Todo();
            todo.reconstructTodo(todoObject);
            this.addTodo(todo);
        }
    }
}

export default Project;