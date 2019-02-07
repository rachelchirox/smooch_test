"use strict";
const config = require('config'),
    flow_manager_path = config.get('flow_manager_path'),
    organizationId = config.get('organizationId'),
    appId = config.get('appId');

const requestToService = require('./requestToService');
let messagesManager = function () {
};

let smoochCore = null;
messagesManager.setSmoochCore = function (smoochCore){
    smoochCore = smoochCore;
}

messagesManager.handleWebhook = function (req, res) {
        const trigger = req.body.trigger;
        //console.log('webhook.trigger:\n', JSON.stringify(trigger, null, 4));
        switch (trigger) {
            case 'message:appUser':
                console.log('webhook.message:appUser:\n', JSON.stringify(req.body, null, 4));
                messagesManager.handleMessages_byFM(req, res);
                break;

            case 'postback':
                console.log('webhook.postback');
                messagesManager.handlePostback(req, res);
                break;

            default:
                console.log('Ignoring unknown webhook trigger:', trigger);
                console.log('details:\n', JSON.stringify(req.body, null, 4));
                res.end();
        }
    };

messagesManager.handleMessages_byFM = function(req, res) {
        const messages = req.body.messages.reduce((prev, current) => {
            if (current.role === 'appUser') {
                prev.push(current);
            }
            return prev;
        }, []);

        if (messages.length === 0) {
            return res.end();
        }

        const userId = req.body.appUser.userId || req.body.appUser._id;

        let language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
        language = 'he';
        messagesManager.sendRequest(userId, res, language, messages[0].text)
        res.end();
    };

messagesManager.handlePostback = function(req, res) {
         console.log('handlePostback:\n', JSON.stringify(req.body, null, 4));

         const postback = req.body.postbacks[0];
         if (!postback || !postback.action) {
             res.end();
         }


         const userId = req.body.appUser.userId || req.body.appUser._id;
         let language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
         language = 'he';

         let cardType = postback.action.metadata.cardType ? postback.action.metadata.cardType : 'text';
         let cardValue = postback.action.metadata.cardValue ? postback.action.metadata.cardValue : null;
         messagesManager.sendRequest(userId, res, language, postback.action.text, cardType, cardValue);
         res.end();

         // createBot(req.body.appUser).say(`You said: ${postback.action.text} (payload was: ${postback.action.payload})`)
         //     .then(() => res.end());
     };

messagesManager.sendRequest = function (userId, res, language, userText, cardType='text', cardValue = null) {
    let body = {
        type: 'message',
        organization : organizationId,
        sessionId : userId,
        language : language,
        text : userText,
        cardType : cardType,
        value: cardValue
    }

    //text, event
    console.log('sendRequest to flow-manager -before:\n', JSON.stringify(body, null, 4));

    requestToService.sendRequest(flow_manager_path, 'post', body).then(data => {

        let dataObject = JSON.parse(data);
        console.log('data.actions: '+ JSON.stringify(dataObject,null,4));

        for (let action of dataObject.actions) {
            if (action.type === 'addBotText') {
                console.log('addBotText');
                if (action.payload.chats.constructor === Array) {
                    console.log('Array');
                    let actions = [];
                    action.payload.chats.forEach(function (btn) {
                        console.log('btn: ' +JSON.stringify(btn, null, 4) );
                        actions.push({
                            text: btn.str,
                            type: 'postback',
                            payload: btn.value + '_',
                            metadata:{cardType:btn.type, cardValue:btn.value} //rachel
                        });
                    });
                    //btn.value
                    console.log('actions: ' + actions);
                    let messageData =  messagesManager.createMessageCards(actions);
                    messagesManager.sendMessageToClient(userId, messageData, res);
                }
                else {
                    let messageData = messagesManager.createMessageText(action.payload.chats.str, action.payload.chats.type);
                    messagesManager.sendMessageToClient(userId, messageData, res);
                }
            }
        }
    }).catch(error => {
        res.end();
        let errorMessage = '';
        if (!error || error.code === "ECONNRESET" || !error.body || error.statusCode === 520) {
            errorMessage = "interfaceCommunicationError";
        }
        else {
            errorMessage = error.body;
        }
        console.info(errorMessage);
    });
};

messagesManager.sendMessageToClient= function(userId, message, res) {
         console.log('message: ' + message);
         smoochCore.appUsers.sendMessage({
             appId: appId,
             userId: userId,
             message: message
         }).then((response) => {
                 res.end();
                 console.log('sendMessage by smooch -after success:\n');
                 // async code
             },
             (error) => {
                 res.end();
                 console.log('sendMessage by smooch -after failure:\n');
                 console.log('fromAppUser:\n', JSON.stringify(error, null, 4));

             });

         // smoochCore.appUsers.sendMessage({
         //     appId: appId,
         //     userId: userId,
         //     message: {
         //         role: 'appMaker',
         //         type: 'text',
         //         text:'כותרת',
         //
         //         actions: [
         //             {
         //                 text: 'פעולה 1',
         //                 type: 'postback',
         //                 payload: 'Open_Ticket1'
         //             },
         //             {
         //                 text: 'פעולה 2',
         //                 type: 'postback',
         //                 payload: 'Update_Ticket2'
         //             }]
         //     }
         // }).then((response) => {
         //         res.end();
         //         console.log('sendMessage by smooch -after success:\n');
         //         // async code
         //     },
         //     (error)=>{
         //         res.end();
         //         console.log('sendMessage by smooch -after failure:\n');
         //         console.log('fromAppUser:\n', JSON.stringify(error, null, 4));
         //
         //     });
     };

messagesManager.createMessageText = function(text){
    let messageData = {
        role: 'appMaker',
        type: 'text',
        text: text
    };
    return messageData;

}

messagesManager.createMessageCards = function(actions){
    let messageData = {
        role: 'appMaker',
        type: 'text',
        actions: actions
    };
    return messageData;
}

module.exports = messagesManager;