const handleCharacter = (e) => {
    e.preventDefault();
    $("#characterMessage").animate({width:'hide'},350);
    if($("#characterName").val() == ''){
        handleError("Character name is required.");
        return false;
    }
    document.querySelector("#characterForm").action = e.target.action;
    sendAjax('POST',$("#characterForm").attr("action"), $("#characterForm").serialize(),function(){
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

const onCharacterClick = (e) => {
    //console.dir(e.target.querySelector(".hiddenID").innerHTML);
    sendAjax('POST','/loadGame', `id=${e.target.querySelector(".hiddenID").innerHTML}&_csrf=${document.querySelector('#currentCSRF').value}` ,redirect);
};

const CharacterForm = (props) => {
    return (
        <form id="characterForm" name="characterForm"
            onSubmit={handleCharacter}
            action="/createCharacter"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="characterName" type="text" name="name" placeholder="Character Name" />
            <input id="currentCSRF" type="hidden" name="_csrf" value={props.csrf} />
            <button type="submit" className="makeDomoSubmit">Make Character</button>
            <button type="submit" formaction="/deleteCharacter" className="makeDomoSubmit">Delete Character</button>
        </form>
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

const CharacterList = function(props){
    if(props.characters.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No characters yet</h3>
            </div>
        );
    }

    const characterNodes = props.characters.map(function(character){
        return (
            <div key={character._id} className="domo" onClick={onCharacterClick} name={character.name}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {character.name}</h3>
                <h3 className="domoAge">Level: {character.level}</h3>
                <h3 className="domoIQ">Experience: {character.experience} / 1000</h3>
                <h3 className="characterBow">Bow: {character.bow}</h3>
                <h3 className="hiddenID">{character._id}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {characterNodes}
        </div>
    );
}

const loadCharactersFromServer = () => {
    sendAjax('GET','/getCharacters',null,(data) => {
        ReactDOM.render(
            <CharacterList characters={data.characters} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <CharacterForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    /*
    ReactDOM.render(
        <CharacterDeleteForm csrf={csrf} />, document.querySelector("#deleteDomo")
    );
    */

    ReactDOM.render(
        <CharacterList characters={[]} csrf={csrf} />, document.querySelector("#domos")
    );

    loadCharactersFromServer();
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});