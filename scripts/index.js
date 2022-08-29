const sendMessageBtn = document.querySelector('#send-message-btn');
const inputMessage = document.querySelector('#input-message');
const chatBoxContents = document.querySelector('#chat-box-content-container');


/** User sends messsage */
sendMessageBtn.addEventListener('click', e => {
    addNewMessage('user', inputMessage.value, 'send');
    botResponse();
});
inputMessage.addEventListener('keydown', e => {
    if (e.key == 'Enter'){
        addNewMessage('user', inputMessage.value, 'send');
        botResponse();
    }
})

let messageHistory = [
]
tokenRegistrationLink = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A65358%2F&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.coursework.me.readonly&response_type=code&client_id=524422024726-kbjdo5pbmant8nbnli4dppmbicc430ts.apps.googleusercontent.com'

function addNewMessage(sender, message, type){

    let newMessage = ``;

    if (sender == 'bot'){
        newMessage = 
        `
        <div class="new-message bot-message">
            <img src="./res/images/bot-icon.png" alt="">
            ${message}
        </div>
        `
    }else{
        newMessage = 
        `
        <div class="new-message ${sender}-message">
            <div class="message">${message}</div>
            <img src="./res/images/${sender}-icon.png">
        </div>
        `
    }


/*
    if (type == 'send'){
        newMessage = 
        `<div class="new-message ${sender}-message">
            <div class="message">${message}</div>    
            <img src="./res/images/${sender}-icon.png" alt="">
        </div>`
    }else{
        newMessage = 
        `<div class="new-message ${sender}-message">
            <img src="./res/images/${sender}-icon.png" alt="">
            <div class="message">${message}</div>
        </div>`
    }
*/

    chatBoxContents.innerHTML += newMessage
    
    messageHistory.push({sender: sender, message: message});
    chatBoxContents.scrollTop = chatBoxContents.scrollHeight;
    inputMessage.value = null;
}


function botResponse(){
    let lastMessage = messageHistory[messageHistory.length-1]['message'].toLowerCase();
    let resp = `<div class="message">???</div>`;

    setTimeout(() => {
        let message = "Select a platform:\n1) Google Classroom \n2) Moodle \n3) Schoology";
        let messageMode = "";

        if (lastMessage == '1'){
            resp = `<button class="message chat-button" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Google Classroom</button>`
        }else{
            resp = '<div class="message">Invalid Command</div>';
        }

        addNewMessage('bot', resp, 'receive');
    }, 1000);
}