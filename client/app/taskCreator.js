//check to see if the task data entered is valid
const handleTask = (e) => {
    e.preventDefault();
    $("#taskMessage").animate({width:'hide'},350);
    if($("#taskName").val() == '' || $("#taskDescription").val() == '' || $("#taskDueDate").val() == ''){
        handleError("All fields are required.");
        return false;
    }
    document.querySelector("#taskForm").action = e.target.action;
    sendAjax('POST',$("#taskForm").attr("action"), $("#taskForm").serialize(),function(){
        loadTasksFromServer();
        document.querySelector("#tasks").className = "list";
    });
    return false;
};

//check to see if the passwords entered are valid
const handleChangePassword = (e) => {
    e.preventDefault();
    $("#taskMessage").animate({width:'hide'},350);
    if($("#oldPass").val()=='' || $("#pass").val()=='' || $("#pass2").val()==''){
        handleError("All fields are required.");
        return false;
    }
    if($("#pass").val() != $("#pass2").val()){
        handleError("Passwords do not match.");
        return false;
    }
    sendAjax('POST',$("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(),redirect);
    return false;
};

//create the form used for creating new tasks
const TaskForm = (props) => {
    return (
        <form id="taskForm" name="taskForm"
            onSubmit={handleTask}
            action="/createTask"
            method="POST"
            className="taskForm"
        >
            <h2 className="pageTitle">Create a new task</h2>
            <h5 className="inputLabels">Task Name:</h5>
            <input id="taskName" type="text" name="name" placeholder="Task Name" />
            <h5 className="inputLabels">Description:</h5>
            <textarea id="taskDescription" name="description" placeholder="Description" ></textarea>
            <h5 className="inputLabels">Due Date:</h5>
            <input id="taskDueDate" type="datetime-local" name="dueDate" />
            <input id="currentCSRF" type="hidden" name="_csrf" value={props.csrf} />
            <button type="submit" className="formSubmit">Create Task</button>
        </form>
    );
};

//create the form used for editing tasks
const EditTaskForm = (props) => {
    //console.dir(props);
    let date = new Date(props.tasks.dueDate);
    let dateStr = date.toISOString(); //"2018-06-12T19:30"
    let dateArray = dateStr.split(':');
    dateStr = `${dateArray[0]}:${dateArray[1]}`;
    return (
        <form id="taskForm" name="taskForm"
            onSubmit={handleTask}
            action="/updateTask"
            method="POST"
            className="taskForm"
        >
            <h2 className="pageTitle">Edit existing task</h2>
            <h5 className="inputLabels">Task Name:</h5>
            <input id="taskName" type="text" name="name" placeholder="Task Name" defaultValue={props.tasks.name} />
            <h5 className="inputLabels">Description:</h5>
            <textarea id="taskDescription" name="description" placeholder="Description" defaultValue={props.tasks.description}></textarea>
            <h5 className="inputLabels">Due Date:</h5>
            <input id="taskDueDate" type="datetime-local" name="dueDate" defaultValue={dateStr} />
            <input id="hiddenID" type="hidden" name="id" value={props.tasks._id} />
            <input id="currentCSRF" type="hidden" name="_csrf" value={props.csrf} />
            <button type="submit" className="formSubmit">Update Task</button>
        </form>
    );
};

//create a single task expanded menu
const SingleTask = (props) => {
    let someDueDate = new Date(props.tasks.dueDate);
    let someCreatedDate = new Date(props.tasks.createdDate);
    //document.querySelector("#tasks").className = "taskCreateForm";
    return (
        <div>
            <h2 className="pageTitle">{props.tasks.name}</h2>
            <div key={props.tasks._id} className="singleTask" name={props.tasks.name} >
                <h5 className="taskLabels">Name:</h5>
                <h3 className="taskName">{props.tasks.name}</h3>
                <h5 className="taskLabels">Description:</h5>
                <h3 className="taskDescription">{props.tasks.description}</h3>
                <h5 className="taskLabels">Due:</h5>
                <h3 className="taskDueDate">{someDueDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</h3>
                <h5 className="taskLabels">Created:</h5>
                <h3 className="taskCreatedDate">{someCreatedDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</h3>
                <div id="singleTaskButtons">
                    <button type="button" className="formSubmit" onClick={() => {onTaskEdit(props.tasks);}}>Edit Task</button>
                    <button type="button" className="formSubmit" onClick={() => {onTaskDelete(props.tasks);}}>Delete Task</button>
                </div>
                <h3 className="hiddenID">{props.tasks._id}</h3>
            </div>
        </div>
    );
};

//generate the list of all user tasks
const TaskList = function(props){
    if(props.tasks.length === 0){
        return (
            <div className="taskList">
                <h3 className="emptyTasks">It appears that you have not created a task yet. Why don't you get started by clicking the "+" button in the top right?</h3>
            </div>
        );
    }
    const taskNodes = props.tasks.map(function(task){
        let someDueDate = new Date(task.dueDate);
        let someCreatedDate = new Date(task.createdDate);
        let croppedDesc = task.description;
        if(croppedDesc.length > 80) croppedDesc = croppedDesc.substring(0,80) + "...";
        return (
            <div className="taskOuterContainer" onClick={() => {onTaskClick(task);}}>
                <div key={task._id} className="task" name={task.name}>
                    <h5 className="taskLabels">Name:</h5>
                    <h3 className="taskName">{task.name}</h3>
                    <h5 className="taskLabels">Description:</h5>
                    <h3 className="taskDescription">{croppedDesc}</h3>
                    <h5 className="taskLabels">Due:</h5>
                    <h3 className="taskDueDate">{someDueDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</h3>
                    <h5 className="taskLabels">Created:</h5>
                    <h3 className="taskCreatedDate">{someCreatedDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</h3>
                    <h3 className="hiddenID">{task._id}</h3>
                </div>
            </div>
        );
    });

    return (
        <div>
            <h2 className="pageTitle">Your tasks</h2>
            <div className="taskList">
                {taskNodes}
            </div>
        </div>
    );
}

//generate the password change form
const ChangePassword = (props) => {
    return (
        <form id="changePasswordForm" name="changePasswordForm"
            onSubmit={handleChangePassword}
            action="/changePassword"
            method="POST"
            className="mainForm"
        >
            <h1 className="appTitle">Human Task Manager</h1>
            <h3 className="signInTitle">Change Password</h3>
            <div id="changePasswordFormInput">
                <div id="oldPassContainer">
                    <h5>Current Password:</h5>
                    <input id="oldPass" type="password" name="oldPass" placeholder="password" />
                </div>
                <div id="newPassContainer1">
                    <h5>New Password:</h5>
                    <input id="pass" type="password" name="pass" placeholder="password" />
                </div>
                <div id="newPassContainer2">
                    <h5>Confirm New Password:</h5>
                    <input id="pass2" type="password" name="pass2" placeholder="confirm password" />
                </div>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id="changePassButton" className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

//when a task is clicked, load new react page
const onTaskClick = (doc) => {
    document.querySelector("#createNewTask").style.display = "none";
    document.querySelector("#backButton").style.display = "inline-block";
    $("#taskMessage").animate({width:'hide'},350);
    sendAjax('POST','/getOneTask', `id=${doc._id}&_csrf=${document.querySelector('.hiddenCSRF').innerHTML}`, (data) => {
        ReactDOM.render(
            <SingleTask tasks={data.tasks[0]} />, document.querySelector("#tasks")
        );
    });
};

//when a task is selected to be edited, load new react page
const onTaskEdit = (doc) => {
    document.querySelector("#createNewTask").style.display = "none";
    document.querySelector("#backButton").style.display = "inline-block";
    document.querySelector("#tasks").className = "taskCreateForm";
    ReactDOM.render(
        <EditTaskForm tasks={doc} csrf={document.querySelector('.hiddenCSRF').innerHTML} />, document.querySelector("#tasks")
    );
    //sendAjax('POST','/editTask', `id=${doc._id}&_csrf=${document.querySelector('.hiddenCSRF').innerHTML}`, redirect);
};

//when a task is deleted, send post then redirect
const onTaskDelete = (doc) => {
    sendAjax('POST','/deleteTask', `id=${doc._id}&_csrf=${document.querySelector('.hiddenCSRF').innerHTML}`, redirect);
};

//load all of the user tasks from the server
const loadTasksFromServer = (csrf) => {
    document.querySelector("#backButton").style.display = "none";
    document.querySelector("#createNewTask").style.display = "inline-block";
    sendAjax('GET','/getTasks',null,(data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks} csrf={csrf} />, document.querySelector("#tasks")
        );
    });
};

//helper functions for loading react pages
const createChangePasswordWindow = (csrf) => {
    ReactDOM.render(
        <ChangePassword csrf={csrf} />, 
        document.querySelector("#tasks")
    );
};

const createTaskListWindow = (csrf) => {
    ReactDOM.render(
        <TaskList tasks={[]} csrf={csrf} />, 
        document.querySelector("#tasks")
    );
};

const createNewTaskWindow = (csrf) => {
    document.querySelector("#createNewTask").style.display = "none";
    document.querySelector("#backButton").style.display = "inline-block";
    ReactDOM.render(
        <TaskForm csrf={csrf} />, 
        document.querySelector("#tasks")
    );
};

const setup = function(csrf){
    document.querySelector(".hiddenCSRF").innerHTML = csrf;
    const createNewTaskButton = document.querySelector("#createNewTask");
    const backButton = document.querySelector("#backButton");
    const changePasswordButton = document.querySelector("#changePasswordButton");

    changePasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        document.querySelector("#tasks").className = "";
        $("#taskMessage").animate({width:'hide'},350);
        return false;
    });

    createNewTaskButton.addEventListener("click",(e) => {
        e.preventDefault();
        createNewTaskWindow(csrf);
        document.querySelector("#tasks").className = "taskCreateForm";
        $("#taskMessage").animate({width:'hide'},350);
        return false;
    });

    backButton.addEventListener("click",(e) => {
        e.preventDefault();
        loadTasksFromServer(csrf);
        document.querySelector("#tasks").className = "list";
        $("#taskMessage").animate({width:'hide'},350);
        return false;
    });

    createTaskListWindow(csrf);

    loadTasksFromServer(csrf);
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});