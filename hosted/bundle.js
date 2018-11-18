"use strict";

var handleTask = function handleTask(e) {
    e.preventDefault();
    $("#taskMessage").animate({ width: 'hide' }, 350);
    if ($("#taskName").val() == '' || $("#taskDescription").val() == '' || $("#taskDueDate").val() == '') {
        handleError("All fields are required.");
        return false;
    }
    document.querySelector("#taskForm").action = e.target.action;
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
        loadTasksFromServer();
        document.querySelector("#tasks").className = "list";
    });
    return false;
};

var handleChangePassword = function handleChangePassword(e) {
    e.preventDefault();
    $("#taskMessage").animate({ width: 'hide' }, 350);
    if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }
    if ($("#pass").val() != $("#pass2").val()) {
        handleError("Passwords do not match.");
        return false;
    }
    sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);
    return false;
};

var TaskForm = function TaskForm(props) {
    return React.createElement(
        "form",
        { id: "taskForm", name: "taskForm",
            onSubmit: handleTask,
            action: "/createTask",
            method: "POST",
            className: "taskForm"
        },
        React.createElement(
            "h2",
            { className: "pageTitle" },
            "Create a new task"
        ),
        React.createElement(
            "h5",
            { className: "inputLabels" },
            "Task Name:"
        ),
        React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name" }),
        React.createElement(
            "h5",
            { className: "inputLabels" },
            "Description:"
        ),
        React.createElement("textarea", { id: "taskDescription", name: "description", placeholder: "Description" }),
        React.createElement(
            "h5",
            { className: "inputLabels" },
            "Due Date:"
        ),
        React.createElement("input", { id: "taskDueDate", type: "datetime-local", name: "dueDate" }),
        React.createElement("input", { id: "currentCSRF", type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { type: "submit", className: "formSubmit" },
            "Create Task"
        )
    );
};

var EditTaskForm = function EditTaskForm(props) {
    //console.dir(props);
    var date = new Date(props.tasks.dueDate);
    var dateStr = date.toISOString(); //"2018-06-12T19:30"
    var dateArray = dateStr.split(':');
    dateStr = dateArray[0] + ":" + dateArray[1];
    return React.createElement(
        "form",
        { id: "taskForm", name: "taskForm",
            onSubmit: handleTask,
            action: "/updateTask",
            method: "POST",
            className: "taskForm"
        },
        React.createElement(
            "h2",
            { className: "pageTitle" },
            "Edit existing task"
        ),
        React.createElement(
            "h5",
            { className: "inputLabels" },
            "Task Name:"
        ),
        React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name", defaultValue: props.tasks.name }),
        React.createElement(
            "h5",
            { className: "inputLabels" },
            "Description:"
        ),
        React.createElement("textarea", { id: "taskDescription", name: "description", placeholder: "Description", defaultValue: props.tasks.description }),
        React.createElement(
            "h5",
            { className: "inputLabels" },
            "Due Date:"
        ),
        React.createElement("input", { id: "taskDueDate", type: "datetime-local", name: "dueDate", defaultValue: dateStr }),
        React.createElement("input", { id: "hiddenID", type: "hidden", name: "id", value: props.tasks._id }),
        React.createElement("input", { id: "currentCSRF", type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { type: "submit", className: "formSubmit" },
            "Update Task"
        )
    );
};

var SingleTask = function SingleTask(props) {
    var someDueDate = new Date(props.tasks.dueDate);
    var someCreatedDate = new Date(props.tasks.createdDate);
    //document.querySelector("#tasks").className = "taskCreateForm";
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            { className: "pageTitle" },
            props.tasks.name
        ),
        React.createElement(
            "div",
            { key: props.tasks._id, className: "singleTask", name: props.tasks.name },
            React.createElement(
                "h5",
                { className: "taskLabels" },
                "Name:"
            ),
            React.createElement(
                "h3",
                { className: "taskName" },
                props.tasks.name
            ),
            React.createElement(
                "h5",
                { className: "taskLabels" },
                "Description:"
            ),
            React.createElement(
                "h3",
                { className: "taskDescription" },
                props.tasks.description
            ),
            React.createElement(
                "h5",
                { className: "taskLabels" },
                "Due:"
            ),
            React.createElement(
                "h3",
                { className: "taskDueDate" },
                someDueDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
            ),
            React.createElement(
                "h5",
                { className: "taskLabels" },
                "Created:"
            ),
            React.createElement(
                "h3",
                { className: "taskCreatedDate" },
                someCreatedDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
            ),
            React.createElement(
                "div",
                { id: "singleTaskButtons" },
                React.createElement(
                    "button",
                    { type: "button", className: "formSubmit", onClick: function onClick() {
                            onTaskEdit(props.tasks);
                        } },
                    "Edit Task"
                ),
                React.createElement(
                    "button",
                    { type: "button", className: "formSubmit", onClick: function onClick() {
                            onTaskDelete(props.tasks);
                        } },
                    "Delete Task"
                )
            ),
            React.createElement(
                "h3",
                { className: "hiddenID" },
                props.tasks._id
            )
        )
    );
};

var TaskList = function TaskList(props) {
    if (props.tasks.length === 0) {
        return React.createElement(
            "div",
            { className: "taskList" },
            React.createElement(
                "h3",
                { className: "emptyTasks" },
                "It appears that you have not created a task yet. Why don't you get started by clicking the \"+\" button in the top right?"
            )
        );
    }
    var taskNodes = props.tasks.map(function (task) {
        var someDueDate = new Date(task.dueDate);
        var someCreatedDate = new Date(task.createdDate);
        var croppedDesc = task.description;
        if (croppedDesc.length > 80) croppedDesc = croppedDesc.substring(0, 80) + "...";
        return React.createElement(
            "div",
            { className: "taskOuterContainer", onClick: function onClick() {
                    onTaskClick(task);
                } },
            React.createElement(
                "div",
                { key: task._id, className: "task", name: task.name },
                React.createElement(
                    "h5",
                    { className: "taskLabels" },
                    "Name:"
                ),
                React.createElement(
                    "h3",
                    { className: "taskName" },
                    task.name
                ),
                React.createElement(
                    "h5",
                    { className: "taskLabels" },
                    "Description:"
                ),
                React.createElement(
                    "h3",
                    { className: "taskDescription" },
                    croppedDesc
                ),
                React.createElement(
                    "h5",
                    { className: "taskLabels" },
                    "Due:"
                ),
                React.createElement(
                    "h3",
                    { className: "taskDueDate" },
                    someDueDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
                ),
                React.createElement(
                    "h5",
                    { className: "taskLabels" },
                    "Created:"
                ),
                React.createElement(
                    "h3",
                    { className: "taskCreatedDate" },
                    someCreatedDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
                ),
                React.createElement(
                    "h3",
                    { className: "hiddenID" },
                    task._id
                )
            )
        );
    });

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            { className: "pageTitle" },
            "Your tasks"
        ),
        React.createElement(
            "div",
            { className: "taskList" },
            taskNodes
        )
    );
};

var ChangePassword = function ChangePassword(props) {
    return React.createElement(
        "form",
        { id: "changePasswordForm", name: "changePasswordForm",
            onSubmit: handleChangePassword,
            action: "/changePassword",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            { className: "appTitle" },
            "Human Task Manager"
        ),
        React.createElement(
            "h3",
            { className: "signInTitle" },
            "Change Password"
        ),
        React.createElement(
            "div",
            { id: "changePasswordFormInput" },
            React.createElement(
                "div",
                { id: "oldPassContainer" },
                React.createElement(
                    "h5",
                    null,
                    "Current Password:"
                ),
                React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "password" })
            ),
            React.createElement(
                "div",
                { id: "newPassContainer1" },
                React.createElement(
                    "h5",
                    null,
                    "New Password:"
                ),
                React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" })
            ),
            React.createElement(
                "div",
                { id: "newPassContainer2" },
                React.createElement(
                    "h5",
                    null,
                    "Confirm New Password:"
                ),
                React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "confirm password" })
            )
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { id: "changePassButton", className: "formSubmit", type: "submit", value: "Change Password" })
    );
};

var onTaskClick = function onTaskClick(doc) {
    document.querySelector("#createNewTask").style.display = "none";
    document.querySelector("#backButton").style.display = "inline-block";
    $("#taskMessage").animate({ width: 'hide' }, 350);
    sendAjax('POST', '/getOneTask', "id=" + doc._id + "&_csrf=" + document.querySelector('.hiddenCSRF').innerHTML, function (data) {
        ReactDOM.render(React.createElement(SingleTask, { tasks: data.tasks[0] }), document.querySelector("#tasks"));
    });
};

var onTaskEdit = function onTaskEdit(doc) {
    document.querySelector("#createNewTask").style.display = "none";
    document.querySelector("#backButton").style.display = "inline-block";
    document.querySelector("#tasks").className = "taskCreateForm";
    ReactDOM.render(React.createElement(EditTaskForm, { tasks: doc, csrf: document.querySelector('.hiddenCSRF').innerHTML }), document.querySelector("#tasks"));
    //sendAjax('POST','/editTask', `id=${doc._id}&_csrf=${document.querySelector('.hiddenCSRF').innerHTML}`, redirect);
};

var onTaskDelete = function onTaskDelete(doc) {
    sendAjax('POST', '/deleteTask', "id=" + doc._id + "&_csrf=" + document.querySelector('.hiddenCSRF').innerHTML, redirect);
};

var loadTasksFromServer = function loadTasksFromServer(csrf) {
    document.querySelector("#backButton").style.display = "none";
    document.querySelector("#createNewTask").style.display = "inline-block";
    sendAjax('GET', '/getTasks', null, function (data) {
        ReactDOM.render(React.createElement(TaskList, { tasks: data.tasks, csrf: csrf }), document.querySelector("#tasks"));
    });
};

var createChangePasswordWindow = function createChangePasswordWindow(csrf) {
    ReactDOM.render(React.createElement(ChangePassword, { csrf: csrf }), document.querySelector("#tasks"));
};

var createTaskListWindow = function createTaskListWindow(csrf) {
    ReactDOM.render(React.createElement(TaskList, { tasks: [], csrf: csrf }), document.querySelector("#tasks"));
};

var createNewTaskWindow = function createNewTaskWindow(csrf) {
    document.querySelector("#createNewTask").style.display = "none";
    document.querySelector("#backButton").style.display = "inline-block";
    ReactDOM.render(React.createElement(TaskForm, { csrf: csrf }), document.querySelector("#tasks"));
};

var setup = function setup(csrf) {
    document.querySelector(".hiddenCSRF").innerHTML = csrf;
    var createNewTaskButton = document.querySelector("#createNewTask");
    var backButton = document.querySelector("#backButton");
    var changePasswordButton = document.querySelector("#changePasswordButton");

    changePasswordButton.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        document.querySelector("#tasks").className = "";
        $("#taskMessage").animate({ width: 'hide' }, 350);
        return false;
    });

    createNewTaskButton.addEventListener("click", function (e) {
        e.preventDefault();
        createNewTaskWindow(csrf);
        document.querySelector("#tasks").className = "taskCreateForm";
        $("#taskMessage").animate({ width: 'hide' }, 350);
        return false;
    });

    backButton.addEventListener("click", function (e) {
        e.preventDefault();
        loadTasksFromServer(csrf);
        document.querySelector("#tasks").className = "list";
        $("#taskMessage").animate({ width: 'hide' }, 350);
        return false;
    });

    createTaskListWindow(csrf);

    loadTasksFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#taskMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#taskMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    //console.dir(action + " " + data);
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
