import React from "react";
import FileItem from "./FileItem";
import Context from '../context'


const styles = {
    task: {
        marginBottom: '24px',
    },
    deleteBtn: {
        marginLeft: '8px',
    }
}

function TodoItem({ task }) {

    function taskDeadline(dateStr) {
        let date = new Date(dateStr);
        return String(date.getDate()).padStart(2, '0')
            + '.' + String(date.getMonth() + 1).padStart(2, '0')
            + '.' + date.getFullYear();
    }

    const { deleteFetch } = React.useContext(Context);
    const { makeTaskStatusDone } = React.useContext(Context);
    const { setMode } = React.useContext(Context);

    return (
        <div className="card" style={styles.task}>
            <h5 className="card-header d-flex flex-row align-items-center">
                <input checked={task.status === "Done"} className="form-check-input" type="checkbox" onChange={makeTaskStatusDone.bind(null, task)} />
                <b>{task.title}</b>
            </h5>
            <div className="card-body">
                <a className={task.status + " status"}>{task.status}</a>
                <p className="card-date">
                    {taskDeadline(task.date)}
                </p>
                <p className="card-text">{task.text}</p>

                {task.file_name && <FileItem task={task} />}

                <button href="#" className="btn-link" onClick={setMode.bind(null, ({ "status": "Edit", "task": task }))}>
                    Edit
                </button>
                <button href="#" className="btn-link" style={styles.deleteBtn} onClick={deleteFetch.bind(null, task.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TodoItem;
