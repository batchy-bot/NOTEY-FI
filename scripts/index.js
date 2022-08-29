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

    if (message == '1'){
        newMessage = 
        `
        <div class="new-message bot-message">
            <img src="./res/images/bot-icon.png" alt="">
            ?<div class="message"><button onclick="window.open('${tokenRegistrationLink}')">Sign-in to Google Classroom</button></div>
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
    let response = ''

    if(lastMessage == 'bot'){
        response = 'Hello';
    }else if (lastMessage == 'get started'){
        response = 'Select a platform';
    }else if(lastMessage == 'subscribe to classroom'){
        response = 'subscribe to classroom'
    }else{
        response = '???';
    }

    setTimeout(() => {
        let message = "Select a platform:\n1) Google Classroom \n2) Moodle \n3) Schoology";

        if (response == 'Select a platform'){
            addNewMessage('bot', message, 'receive');
        }else if(response == 'subscribe to classroom'){
            addNewMessage('bot', tokenRegistrationLink, 'receive');
        }else{
            addNewMessage('bot', response, 'receive')
        }
    }, 1000);
}