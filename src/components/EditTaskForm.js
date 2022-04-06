import React, { useState } from "react";
import Context from '../context'

function EditTaskForm({ mode, onEdit }) {
    let task = mode.task;
    const { setMode } = React.useContext(Context);
    let fileName = task.file_name || "Load file";
    const [file, setFile] = useState({ name: fileName });
    const [title, setTitle] = useState(task.title);
    const [text, setText] = useState(task.text);
    let dt = new Date(task.date);
    let date1 = dt.getFullYear()
        + '-' + String(dt.getMonth() + 1).padStart(2, '0')
        + '-' + String(dt.getDate()).padStart(2, '0');
    const [date, setDate] = useState(date1);

    function submitHandler(event) {
        event.preventDefault();
        setMode({ "status": "Default", "task": null });
        onEdit(title, date, text, file, task.id, task.file_name);
    }

    function cancel() {
        setMode({ "status": "Default", "task": null });
    }

    return (
        <div>
            <div className="block"><h1>Edit task</h1></div>
            <form id="form" encType='multipart/form-data' onSubmit={submitHandler}>
                <div className="mb-3">
                    <input value={title} onChange={event => setTitle(event.target.value)} type="text" name="task-title" className="form-control" />
                </div>
                <div className="mb-3">
                    <input value={date} onChange={event => setDate(event.target.value)} type="date" name="task-deadline" className="form-control" />
                </div>
                <div className="mb-3">
                    <textarea value={text} onChange={event => setText(event.target.value)} name="task-text" className="form-control" rows="3"></textarea>
                </div>
                <div>
                    <label htmlFor="fileInput" className="file_loader form-control" id="file-upload-label" for="fileInput">
                        {file.name || "Load file"}
                    </label>
                    <input type="file" name="file" id="fileInput" onChange={(e) => setFile(e.target.files[0])} hidden />
                </div>
                <div className="d-flex flex-row buttons">
                    <button type="submit" className="btn-success" >Edit</button>
                    <button className="btn-outline-success d-flex flex-column justify-content-center"
                        onClick={cancel.bind(null)}>Cancel</button>
                </div>
            </form>
        </div >

    );
}

export default EditTaskForm;