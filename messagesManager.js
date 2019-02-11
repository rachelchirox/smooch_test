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
    messagesManager.smoochCore = smoochCore;
}

messagesManager.handleWebhook = function (req, res) {
    try {
        const trigger = req.body.trigger;
        console.log('webhook trigger: ', trigger);
        switch (trigger) {
            case 'message:appUser':
                messagesManager.handleMessagesFromClient(req, res);
                break;

            case 'postback':
                messagesManager.handlePostback(req, res);
                break;

            case 'conversation:start':
                messagesManager.handleConversationStart(req, res);
                break;

            default:
                console.log('Ignoring unknown webhook trigger:', trigger);
                console.log('details:\n', JSON.stringify(req.body, null, 4));
        }
    }
    catch (err) {
        console.log('user: ' + req.body.appUser.userId || req.body.appUser._id);
        console.log('11req: ' + JSON.stringify(req.body, null, 4));
        console.log('11res: ' + JSON.stringify(res.body, null, 4));
        console.log('EXCEPTION - Failed on messagesManager.handleWebhook,\nerror:' + JSON.stringify(err));
    }
    finally {
        res.end();
    }
};

messagesManager.handleMessagesFromClient = function(req, res) {
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

        let language = req.body.appUser.clients && req.body.appUser.clients[0].info && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
        language = 'he';

        let userText = messages[0].text;
        if (messages[0].type == 'image'){
            userText = messages[0].mediaUrl;
            console.log('666');
        }

        messagesManager.sendRequestToServer('sendMessageToBot', userId, res, language, userText)
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
         messagesManager.sendRequestToServer('sendMessageToBot', userId, res, language, postback.action.text, cardType, cardValue);
     };

    messagesManager.handleConversationStart = function(req, res) {
        console.log('handleConversationStart:\n', JSON.stringify(req.body, null, 4));
        const userId = req.body.appUser.userId || req.body.appUser._id;

        let language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
        language = 'he';
        messagesManager.sendRequestToServer('initSession', userId, res, language, '')
    };

    messagesManager.sendRequestToServer = function (actionName, userId, res, language, userText, cardType='text', cardValue = null) {

        console.log('888');
    let body = {
        type : 'message',
        organization : organizationId,
        sessionId : userId,
        language : language,
        text : userText,
        cardType : cardType,
        value: cardValue
    }
    console.log('sendRequest to flow-manager -before:\n', JSON.stringify(body, null, 4));

    //     //rachel
    // requestToService.sendRequest(flow_manager_path + '/'+ actionName, 'post', body).then(data => {
    //
    //     let dataObject = JSON.parse(data);
    //     messagesManager.handleReponseFromServer(dataObject, userId);
        requestToService.sendRequest(flow_manager_path , 'post', body).then(data => {

            let dataObject = JSON.parse(data);
            messagesManager.handleReponseFromServer(dataObject, userId);
    }).catch(error => {
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


//old, good
// messagesManager.sendRequestToServer = function (userId, res, language, userText, cardType='text', cardValue = null) {
//
//     let body = {
//         type: 'message',
//         organization : organizationId,
//         sessionId : userId,
//         language : language,
//         text : userText,
//         cardType : cardType,
//         value: cardValue
//     }
//
//     console.log('sendRequest to flow-manager -before:\n', JSON.stringify(body, null, 4));
//
//     requestToService.sendRequest(flow_manager_path, 'post', body).then(data => {
//
//         let dataObject = JSON.parse(data);
//         messagesManager.handleReponseFromServer(dataObject, userId);
//
//     }).catch(error => {
//         let errorMessage = '';
//         if (!error || error.code === "ECONNRESET" || !error.body || error.statusCode === 520) {
//             errorMessage = "interfaceCommunicationError";
//         }
//         else {
//             errorMessage = error.body;
//         }
//         console.info(errorMessage);
//     });
// };

messagesManager.handleReponseFromServer = function(dataObject, userId) {
    //let dataObject = JSON.parse(data);
    console.log('data.actions: ' + JSON.stringify(dataObject, null, 4));

    // for (let action of dataObject.actions) {
    //     if (action.type === 'addBotText') {
    //         console.log('addBotText');
    //         if (action.payload.chats.constructor === Array) {
    //             console.log('Array');
    //             let actions = [];
    //             action.payload.chats.forEach(function (btn) {
    //                 console.log('btn: ' + JSON.stringify(btn, null, 4));
    //                 actions.push({
    //                     text: btn.str,
    //                     type: 'postback',
    //                     payload: btn.value + '_',
    //                     metadata: {cardType: btn.type, cardValue: btn.value}
    //                 });
    //             });
    //             //btn.value
    //             console.log('actions: ' + actions);
    //             let messageData = messagesManager.createMessageCards(actions);
    //             messagesManager.sendMessageToClient(userId, messageData, res);
    //         }
    //         else {
    //             let messageData = messagesManager.createMessageText(action.payload.chats.str, action.payload.chats.type);
    //             messagesManager.sendMessageToClient(userId, messageData, res);
    //         }
    //     }
    // }

    //for (let action of dataObject.actions) {
    if (dataObject.actions && dataObject.actions.length){
        let action = dataObject.actions[0];
        if (action.type === 'addBotText') {
            console.log('addBotText');
            let messageData = null;
            if (action.payload.chats.constructor === Array) {
                console.log('Array');
                let actions = [];
                action.payload.chats.forEach(function (btn) {
                    console.log('btn: ' + JSON.stringify(btn, null, 4));
                    // actions.push({
                    //     text: btn.str,
                    //     type: 'postback',
                    //     payload: btn.value + '_',
                    //     metadata: {cardType: btn.type, cardValue: btn.value}
                    // });

                    // actions.push({
                    //     title: 'required. what write here',
                    //     actions:[{
                    //         text: btn.str,
                    //         type: 'postback',
                    //         payload: btn.value + '_',
                    //         metadata: {cardType: btn.type, cardValue: btn.value}}],
                    //     });

                    actions.push({
                            text: btn.str,
                            type: 'postback',
                            payload: btn.value + '_',
                            metadata: {cardType: btn.type, cardValue: btn.value}
                        });
                });

                let items = [{
                    title: 'which title..',
                    actions: actions
                }];

                console.log('actions: ' + actions);
                messageData = messagesManager.createMessageCards(items);
            }
            else {
                messageData = messagesManager.createMessageText(action.payload.chats.str, action.payload.chats.type);
            }

            messagesManager.sendMessageToClient(userId, messageData).then((response)=>{

                //let leftItems = dataObject.actions.shift();
                let leftItems = dataObject.actions.slice(1,dataObject.actions.length);

                console.log('leftItems: ' + JSON.stringify(leftItems, null, 4));
                if (leftItems.length > 0) {

                    messagesManager.handleReponseFromServer({actions : leftItems}, userId);
                }
             });
        }
    }
};



messagesManager.sendMessageToClient= function(userId, message, res) {
    return new Promise((resolve, reject) => {
        try {
            console.log('message: ' + JSON.stringify(message, null, 4));
            messagesManager.smoochCore.appUsers.sendMessage({
                appId: appId,
                userId: userId,
                message: message
            }).then((response) => {
                    console.log('sendMessage by smooch - succeeded:\n');
                    return resolve();
                },
                (error) => {
                    console.log('sendMessage by smooch - failed:\n');
                    console.log(JSON.stringify(error, null, 4));
                    return reject(error);
                });
        }
        catch (err) {
            console.log('EXCEPTION - Failed finished httpServiceLocator - send function,\nerror:' + JSON.stringify(err));
            return reject(err);
        }
    });
};


messagesManager.createMessageText = function(text){
    let messageData = {
        role: 'appMaker',
        type: 'text',
        text: text
    };
    return messageData;

}

messagesManager.createMessageCards = function(items){
    let messageData = {
        role: 'appMaker',
        type: 'list',
        items:items

    };
    return messageData;
}

module.exports = messagesManager;