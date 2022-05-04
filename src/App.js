import React from "react";
import TodoList from "./components/TodoList";
import "./style/main_style.css"
import Context from './context'
import AddTaskForm from "./components/AddTaskForm";
import EditTaskForm from "./components/EditTaskForm";
import axios from "axios";
import SelectControl from "./components/SelectControl";
import formatDate from './api/Api';
import RegistrationForm from './components/RegistrationForm';
import AuthorizationForm from './components/AuthorizationForm';


function App() {

  const [tasks, setTasks] = React.useState([]);
  const [mode, setMode] = React.useState({ "status": "Default", "task": null, "showAddForm": false });
  const [order, setOrder] = React.useState("status");

  if (localStorage.getItem("token")) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  }

  React.useEffect(() => {
    getTasksQuery()
  })

  const deleteQuery = (id) => {
    axios.delete(`http://localhost:3001/tasks/${id}`);
  }

  const getTasksQuery = () => {
    axios.get(`http://localhost:3001/tasks/${order}`)
      .then(response => {
        if (response.status === 401) {

        } else {
          setTasks(response.data)
        }
      })
  }

  function addTaskQuery(title, date, text, file) {
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
    axios.post('http://localhost:3001/tasks', task);
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
    updateQuery(task);
  }

  function updateQuery(task) {
    axios.put(`http://localhost:3001/tasks/${task.id}`, task);
  }

  function checkStatus() {
    let taskList = tasks;
    taskList.map(task => {
      let taskDeadline = new Date(task.date);
      let today = Date.now();
      if (today > taskDeadline && task.status !== 'Done' && task.status !== 'Expired') {
        let newTask = task;
        newTask.status = 'Expired';
        newTask.date = formatDate(task.date);
      }
    })
  }

  setInterval(checkStatus, 100000);

  function register(login, password) {
    const data = {
      'login': login,
      'password': password
    }
    axios.post('http://localhost:3001/register', data).then(
      localStorage.removeItem("register_error")
    ).catch(
      error => {
        console.log(error.response.data.errors.errors[0].msg);
        localStorage.setItem("register_error", error.response.data.errors.errors[0].msg);
        setMode({ "status": "Register", "task": null });
      }
    )
  }

  function makeTaskStatusDone(task) {
    if (task.status !== 'Done') {
      task.status = 'Done'
    } else {
      let taskDeadline = new Date(task.date);
      let today = Date.now();
      task.status = today > taskDeadline ? 'Expired' : 'Processing';
    }
    task.date = formatDate(task.date);
    updateQuery(task);
  }

  function login(login, password) {
    const data = {
      'login': login,
      'password': password
    }
    axios.post('http://localhost:3001/login', data).then(
      response => {
        localStorage.removeItem("login_error");
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        setMode({ "status": "Default", "task": null });
      }
    ).catch(
      error => {
        localStorage.setItem("login_error", error.response.data.message);
        setMode({ "status": "Login", "task": null });
      }
    )
  }

  function logout() {
    setMode({ "status": "Login", "task": null });
    localStorage.removeItem("token");
    axios.defaults.headers.delete('Authorization');
  }


  return (
    <Context.Provider value={{ deleteFetch: deleteQuery, makeTaskStatusDone, setMode, setOrder }}>
      <div className="d-flex flex-column align-items-center">
        {mode.status === 'Register' ?
          <div className="block"><RegistrationForm mode={mode} onRegister={register} /></div>
          :
          (mode.status === 'Login' ?
            <div className="block"><AuthorizationForm mode={mode} onLogin={login} /></div>
            :
            (mode.status === 'Default' ?
              (<div>
                {localStorage.getItem("token") ?
                  <button className="delete-button" onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                      <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                    </svg>
                  </button>
                  : <div></div>}
                <div className="block"><h1 className="title">Todo list</h1></div>
                {localStorage.getItem("token") ? <div className="block"><SelectControl /></div> : <div></div>}
                {mode.showAddForm ? <div className="block"><AddTaskForm onCreate={addTaskQuery} /></div> :
                  <button className="btn-success"
                    onClick={setMode.bind(null, { "showAddForm": true, "task": null, "status": "Default" })} >Add task</button>}
                <div className="block"><TodoList tasks={tasks} /></div>
              </div>)
              :
              <div className="block"><EditTaskForm mode={mode} onEdit={editTask} /></div>))
        }
      </div>
    </Context.Provider>
  );
}

export default App;
