import React from "react";
import TodoList from "./components/TodoList";
import "./style/main_style.css"
import Context from './context'
import AddTaskForm from "./components/AddTaskForm";
import EditTaskForm from "./components/EditTaskForm";
import axios from "axios";


function App() {

  const [tasks, setTasks] = React.useState([]);
  const [mode, setMode] = React.useState({ "status": "Default", "task": null, "showAddForm": false });

  React.useEffect(() => {
    getFetch()
  })

  const deleteFetch = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "DELETE"
    });
  }

  const getFetch = () => {
    fetch('http://localhost:3001/tasks', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(newTasks => {
        setTasks(newTasks)
      })
  }

  function addTaskFetch(title, date, text, file) {
    let task = { 'title': title, 'date': date, 'text': text, 'status': 'Processing' };
    if (file.name !== "Load file") {
      task['file_name'] = file.name;
      const filedata = new FormData();
      filedata.append('file', file);
      axios.post(`http://localhost:3001/tasks/upload`, filedata);
    }
    let taskDeadline = new Date(task.date);
    let today = Date.now();
    if (today > taskDeadline) {
      task.status = 'Expired';
    }
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(task)
    });
  }

  function editTask(title, date, text, file, id, fileName) {
    let task = { 'id': id, 'title': title, 'date': date, 'text': text, 'status': 'Processing' };
    if (file.name !== "Load file" && file.name !== fileName) {
      task['file_name'] = file.name;
      const filedata = new FormData();
      filedata.append('file', file);
      axios.post(`http://localhost:3001/tasks/upload`, filedata);
    }
    let taskDeadline = new Date(task.date);
    let today = Date.now();
    if (today > taskDeadline) {
      task.status = 'Expired';
    }
    updateFetch(task);
  }

  function updateFetch(task) {
    fetch(`http://localhost:3001/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
  }

  function checkStatus() {
    let taskList = tasks;
    taskList.map(task => {
      let taskDeadline = new Date(task.date);
      let today = Date.now();
      if (today > taskDeadline && task.status !== 'Done' && task.status !== 'Expired') {
        let newTask = task;
        newTask.status = 'Expired';
        let formattedDate = new Date(task.date);
        newTask.date = formattedDate.getFullYear()
          + '-' + String(formattedDate.getMonth() + 1).padStart(2, '0')
          + '-' + String(formattedDate.getDate()).padStart(2, '0');
        updateFetch(newTask);
      }
    })
  }

  setInterval(checkStatus, 100000)

  function makeTaskStatusDone(task) {
    if (task.status !== 'Done') {
      task.status = 'Done'
    } else {
      let taskDeadline = new Date(task.date);
      let today = Date.now();
      task.status = today > taskDeadline ? 'Expired' : 'Processing';
    }
    let dt = new Date(task.date);
    task.date = dt.getFullYear()
      + '-' + String(dt.getMonth() + 1).padStart(2, '0')
      + '-' + String(dt.getDate()).padStart(2, '0');
    updateFetch(task);
  }


  return (
    <Context.Provider value={{ deleteFetch, makeTaskStatusDone, setMode }}>
      <div className="d-flex flex-column align-items-center">
        {mode.status === 'Default' ?
          (<div>
            <div className="block"><h className="title">Todo list</h></div>
            {mode.showAddForm ? <div className="block"><AddTaskForm onCreate={addTaskFetch} /></div> :
              <button className="btn-success"
                onClick={setMode.bind(null, { "showAddForm": true, "task": null, "status": "Default" })} >Add task</button>}
            <div className="block"><TodoList tasks={tasks} /></div>
          </div>)
          :
          <div className="block"><EditTaskForm mode={mode} onEdit={editTask} /></div>}
      </div>
    </Context.Provider >
  );
}

export default App;
