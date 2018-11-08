"use strict";

var handleCharacter = function handleCharacter(e) {
    e.preventDefault();
    $("#characterMessage").animate({ width: 'hide' }, 350);
    if ($("#characterName").val() == '') {
        handleError("Character name is required.");
        return false;
    }
    document.querySelector("#characterForm").action = e.target.action;
    sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function () {
        loadCharactersFromServer();
    });
    return false;
};

/*
const handleDeleteCharacter = (e) => {
    e.preventDefault();
    $("#characterMessage").animate({width:'hide'},350);
    if($("#characterDeleteName").val() == ''){
        handleError("Character name for deletion is required.");
        return false;
    }
    sendAjax('POST',$("#characterDeleteForm").attr("action"), $("#characterDeleteForm").serialize(),function(){
        loadCharactersFromServer();
    });
    return false;
};
*/

var onCharacterClick = function onCharacterClick(e) {
    //console.dir(e.target.querySelector(".hiddenID").innerHTML);
    sendAjax('POST', '/loadGame', "id=" + e.target.querySelector(".hiddenID").innerHTML + "&_csrf=" + document.querySelector('#currentCSRF').value, redirect);
};

var CharacterForm = function CharacterForm(props) {
    return React.createElement(
        "form",
        { id: "characterForm", name: "characterForm",
            onSubmit: handleCharacter,
            action: "/createCharacter",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "characterName", type: "text", name: "name", placeholder: "Character Name" }),
        React.createElement("input", { id: "currentCSRF", type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { type: "submit", className: "makeDomoSubmit" },
            "Make Character"
        ),
        React.createElement(
            "button",
            { type: "submit", formaction: "/deleteCharacter", className: "makeDomoSubmit" },
            "Delete Character"
        )
    );
};

/*
const CharacterDeleteForm = (props) => {
    return (
        <form id="characterDeleteForm" name="characterDeleteForm"
            onSubmit={handleDeleteCharacter}
            action="/deleteCharacter"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="characterDeleteName" type="text" name="name" placeholder="Character Name" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Delete Character" />
        </form>
    );
};*/

var CharacterList = function CharacterList(props) {
    if (props.characters.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No characters yet"
            )
        );
    }

    var characterNodes = props.characters.map(function (character) {
        return React.createElement(
            "div",
            { key: character._id, className: "domo", onClick: onCharacterClick, name: character.name },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                character.name
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Level: ",
                character.level
            ),
            React.createElement(
                "h3",
                { className: "domoIQ" },
                "Experience: ",
                character.experience,
                " / 1000"
            ),
            React.createElement(
                "h3",
                { className: "characterBow" },
                "Bow: ",
                character.bow
            ),
            React.createElement(
                "h3",
                { className: "hiddenID" },
                character._id
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        characterNodes
    );
};

var loadCharactersFromServer = function loadCharactersFromServer() {
    sendAjax('GET', '/getCharacters', null, function (data) {
        ReactDOM.render(React.createElement(CharacterList, { characters: data.characters }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(CharacterForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    /*
    ReactDOM.render(
        <CharacterDeleteForm csrf={csrf} />, document.querySelector("#deleteDomo")
    );
    */

    ReactDOM.render(React.createElement(CharacterList, { characters: [], csrf: csrf }), document.querySelector("#domos"));

    loadCharactersFromServer();
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
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    console.dir(action + " " + data);
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
