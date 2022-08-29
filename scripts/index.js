const sendMessageBtn = document.querySelector('#send-message-btn');
const inputMessage = document.querySelector('#input-message');
const chatBoxContents = document.querySelector('#chat-box-content-container');

tokenRegistrationLink = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A65358%2F&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.coursework.me.readonly&response_type=code&client_id=524422024726-kbjdo5pbmant8nbnli4dppmbicc430ts.apps.googleusercontent.com'

let messageHistory = [];
let botStates = {
    1: `<button class='message chat-button get-started-btn'>Get Started</button>`,
    2: `
    <div class="message">
        Select a VLE Platform
        <button class="message chat-button select-vle-btn" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Google Classroom</button>
        <button class="message chat-button select-vle-btn" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Moodle</button>
        <button class="message chat-button select-vle-btn" onclick="window.open('${tokenRegistrationLink}')">Sign-in to Schoology</button>
    </div>
    `
}
let currentBotState = 1;

/** User sends messsage */
sendMessageBtn.addEventListener('click', e => {
    userSendMessage('user', inputMessage.value, 'send')
});
inputMessage.addEventListener('keydown', e => {
    if (e.key == 'Enter'){
        userSendMessage('user', inputMessage.value, 'send')
    }
})


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


    chatBoxContents.innerHTML += newMessage
    
    messageHistory.push({sender: sender, message: message});
    chatBoxContents.scrollTop = chatBoxContents.scrollHeight;
    inputMessage.value = null;
}

addNewMessage('bot', botStates[currentBotState], 'receive');

const getStartedBtn = document.querySelectorAll('.get-started-btn')

getStartedBtn.forEach( startBtn => {
    startBtn.addEventListener('click', e => {
        userSendMessage('user', 'get started', 'send');
        currentBotState++;
    })
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
            botStates[currentBotState];
        }else{
            resp = '<div class="message">Invalid Command</div>';
        }


        addNewMessage('bot', resp, 'receive');
        document.querySelectorAll('.select-vle-btn').forEach( btn => {
            btn.addEventListener('click', e => {
                let platformName = btn.innerHTML.split('Sign-in to')
                platformName = platformName[platformName.length - 1]
                addNewMessage('bot', `<div class='message'>You have successfully signed in to \n'${platformName}'</div>`, 'receive');
                addNewMessage('bot', `<div class='message'>You will now receive notifications activities, announcements and quizzes from '${platformName}'</div>`, 'receive');
            });
        });
    }, 1000);
}