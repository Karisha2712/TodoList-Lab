import React, { useState } from "react";
import Context from "../context";

function AddTaskForm({ onCreate }) {
    const [file, setFile] = useState({ name: "Load file" });
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [date, setDate] = useState('');
    const { setMode } = React.useContext(Context);

    function submitHandler(event) {
        event.preventDefault();
        setMode({ "showAddForm": false, "task": null, "status": "Default" });
        onCreate(title, date, text, file);
        setTitle('');
        setText('');
        setDate('');
        setFile({ name: "Load file" })
    }

    function cancel() {
        setMode({ "status": "Default", "task": null });
    }

    return (
        <form id="form" encType='multipart/form-data' onSubmit={submitHandler}>
            <h5>New task</h5>
            <div className="mb-3">
                <input value={title} onChange={event => setTitle(event.target.value)} type="text" name="task-title" className="form-control" placeholder="Title" />
            </div>
            <div className="mb-3">
                <input value={date} onChange={event => setDate(event.target.value)} type="date" name="task-deadline" className="form-control" />
            </div>
            <div className="mb-3">
                <textarea value={text} onChange={event => setText(event.target.value)} name="task-text" className="form-control" rows="3"></textarea>
            </div>
            <div>
                <label htmlFor="fileInput" className="file_loader form-control" id="file-upload-label">
                    {file.name}
                </label>
                <input type="file" name="file" id="fileInput" onChange={(e) => setFile(e.target.files[0])} hidden />
            </div>
            <div className="d-flex flex-row buttons">
                <button type="submit" className="btn-success">Create task</button>
                <button className="btn-outline-success d-flex flex-column justify-content-center"
                        onClick={cancel.bind(null)}>Cancel</button>
            </div>
        </form>
    );
}

export default AddTaskForm;