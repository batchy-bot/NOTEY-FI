const sendMessageBtn = document.querySelector('#send-message-btn');
const inputMessage = document.querySelector('#input-message');
const chatBoxContents = document.querySelector('#chat-box-content-container');

let messageHistory = [];

/** User sends messsage */
sendMessageBtn.addEventListener('click', e => {
    userSendMessage('user', inputMessage.value, 'send')
});
inputMessage.addEventListener('keydown', e => {
    if (e.key == 'Enter'){
        userSendMessage('user', inputMessage.value, 'send')
    }
})

tokenRegistrationLink = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A65358%2F&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.coursework.me.readonly&response_type=code&client_id=524422024726-kbjdo5pbmant8nbnli4dppmbicc430ts.apps.googleusercontent.com'

function userSendMessage(sender, message, type){
    messageHistory.push({sender: sender, message: message});
    let lastMessage = messageHistory[messageHistory.length-1]['message'];
    addNewMessage(sender, lastMessage, type);
    botResponse();
}

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

addNewMessage('bot', `<button class='message chat-button get-started-btn'>Get Started</button>`, 'receive')

const getStartedBtn = document.querySelector('.get-started-btn')

getStartedBtn.addEventListener('click', e => {
    userSendMessage('user', 'get started', 'send')
})

function botResponse(){
    let lastMessage = messageHistory[messageHistory.length-1]['message'].toLowerCase();
    let resp = `<div class="message">???</div>`;

    setTimeout(() => {
        let message = "Select a platform:\n1) Google Classroom \n2) Moodle \n3) Schoology";
        let messageMode = "";

        if (lastMessage == '1'){
            resp = `<button class="message chat-button" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Google Classroom</button>`
        }else if (lastMessage.toLowerCase() == 'get started'){
            resp = 
            `
            <div class="message">
                Select a VLE Platform
                <button class="message chat-button select-vle-btn" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Google Classroom</button>
                <button class="message chat-button select-vle-btn" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Moodle</button>
                <button class="message chat-button select-vle-btn" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Schoology</button>
            </div>
            `
        }else{
            resp = '<div class="message">Invalid Command</div>';
        }

        addNewMessage('bot', resp, 'receive');
        document.querySelectorAll('.select-vle-btn').forEach( btn => {
            btn.addEventListener('click', e => {
                let platformName = btn.innerHTML.split('Sign-in to')
                platformName = platformName[platformName.length - 1]
                addNewMessage('bot', `<div class='message'>You have successfully signed in to \n'${platformName}'</div>`, 'receive');
                addNewMessage('bot', `<div class='message'>You will receive notifications </div>`, 'receive');
            });
        });
    }, 1000);
}

