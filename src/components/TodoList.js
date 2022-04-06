import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ tasks }) {
    return (
        <div>
            {
                tasks.map(task => {
                    return <TodoItem key={task.id} task={task} />
                })
            }
        </div>
    );
}

export default TodoList;
