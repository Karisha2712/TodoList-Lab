import React from "react";
import FileItem from "./FileItem";
import Context from '../context'
import formatDate from "../api/Api";


function TodoItem({ task }) {

    const { deleteFetch } = React.useContext(Context);
    const { makeTaskStatusDone } = React.useContext(Context);
    const { setMode } = React.useContext(Context);

    return (
        <div className="card task">
            <h5 className="card-header d-flex flex-row align-items-center">
                <input checked={task.status === "Done"} className="form-check-input"
                    type="checkbox" onChange={makeTaskStatusDone.bind(null, task)} />
                <b>{task.title}</b>
            </h5>
            <div className="card-body">
                <a className={task.status + " status"}>{task.status}</a>
                <p className="card-date">
                    {formatDate(task.date)}
                </p>
                <p className="card-text">{task.text}</p>

                {task.file_name && <FileItem task={task} />}

                <button className="btn-link"
                    onClick={setMode.bind(null, ({ "status": "Edit", "task": task }))}>
                    Edit
                </button>
                <button className="btn-link delete-btn"
                    onClick={deleteFetch.bind(null, task.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}


export default TodoItem;
