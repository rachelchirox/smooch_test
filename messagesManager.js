"use strict";
const config = require('config'),
    flow_manager_path = config.get('flow_manager_path'),
    appId = config.get('appId'),
    defaultLanguage = config.get('defaultLanguage');
const EventEmitter = require('events');

const requestToService = require('./requestToService');
let messagesManager = function () {
};

messagesManager.clientPlatformsToSessions = [];
messagesManager.smoochCore = null;

messagesManager.setSmoochCore = function (smoochCore){
    messagesManager.smoochCore = smoochCore;
};

class MyEmitter extends EventEmitter {}

messagesManager.myEmitter = new MyEmitter();


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

            // case 'delivery:success':
            //     console.log('delivery:success:\n', JSON.stringify(req.body, null, 4));
            //     messagesManager.myEmitter.emit('event', req);
            //     break;

                case 'message:appMaker':
                    console.log('message:appMaker:\n', JSON.stringify(req.body, null, 4));
                    messagesManager.myEmitter.emit('event', req);
                    break;

            default:
                console.log('Ignoring unknown webhook trigger:', trigger);
                console.log('details:\n', JSON.stringify(req.body, null, 4));
        }
    }
    catch (err) {
        console.log('user: ' + req.body.appUser.userId || req.body.appUser._id);
        console.log('11req: ' + JSON.stringify(req.body, null, 4));
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

        let clientPlatform = messages[0].source.type;

        let userText = messages[0].text;
        if (messages[0].type == 'image'){
            userText = 'handle: ' + messages[0].mediaUrl;
            //userText = "handle: https://s3-us-west-2.amazonaws.com/membit-uploads/4459-a2d6-20f941526e96.jpeg";

            console.log('666');
        }

        console.log('4***');
        messagesManager.sendRequestToServer('sendMessageToFlow', req, clientPlatform, userText);
    };

    messagesManager.handlePostback = function(req, res) {
         console.log('handlePostback:\n', JSON.stringify(req.body, null, 4));

         const postback = req.body.postbacks[0];
         if (!postback || !postback.action) {
             res.end();
         }

         let cardType = postback.action.metadata.cardType ? postback.action.metadata.cardType : 'text';
         let cardValue = postback.action.metadata.cardValue ? postback.action.metadata.cardValue : null;
         let clientPlatform = postback.source.type;
         messagesManager.sendRequestToServer('sendMessageToFlow', req, clientPlatform, postback.action.text, cardType, cardValue);
     };

    messagesManager.handleConversationStart = function(req, res) {
        console.log('handleConversationStart:\n', JSON.stringify(req.body, null, 4));

        let clientPlatform = req.body.source.type;
        messagesManager.sendRequestToServer('initSession', req, clientPlatform, '')
    };

    messagesManager.sendRequestToServer = function (actionName, req, clientPlatform, userText, cardType='text', cardValue = null) {

        console.log('sendRequest to flow-manager -before:\n', JSON.stringify(req.body, null, 4));

        const userId = req.body.appUser.userId || req.body.appUser._id;

        let organizationId = req.query.organizationId;
        let language = req.query.language;
        if (!language) {
            language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : defaultLanguage;
        }

        // let clientPlatform = req.body.appUser.clients && req.body.appUser.clients[0].platform;

        //TODO: not good enough for multi clients to the same user
        let foundItem = messagesManager.clientPlatformsToSessions.find(item => item.sessionId == userId);
        if (!foundItem) {
            messagesManager.clientPlatformsToSessions.push({sessionId: userId, clientPlatform: clientPlatform});
        }

        let body = {
            organization: organizationId,
            sessionId: userId,
            language: language,
            text: userText,
            cardType: cardType,
            value: cardValue
        };

        requestToService.sendRequest(flow_manager_path + '/' + actionName , 'post', body).then(data => {
             let dataObject = JSON.parse(data);
             console.log('response from ' + flow_manager_path + ' :' + JSON.stringify(dataObject));
            // messagesManager.handleResponseFromServer(dataObject, userId);

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

messagesManager.handleResponseFromServer = function(dataObject, userId) {
    console.log('data.actions: ' + JSON.stringify(dataObject, null, 4));

    let platform = null;
    let foundItem = messagesManager.clientPlatformsToSessions.find(item => item.sessionId == userId);
    if (foundItem) {
        platform = foundItem.clientPlatform;
    }
    else {
        console.log('problem: messagesManager.clientPlatformsToSessions not contains the sessionId ' + userId);
    }

    let messageData = null;
    if (dataObject.actions && dataObject.actions.length) {
        let action = dataObject.actions[0];
        if (platform == 'messenger') {
            messageData = messagesManager.createMessageData_Facebook(action);
        }
        else {
            messageData = messagesManager.createMessageData(action);
        }

        let leftItems = dataObject.actions.slice(1, dataObject.actions.length);
        console.log('leftItems: ' + JSON.stringify(leftItems, null, 4));

        if (messageData) {
            messagesManager.sendMessageToClient(userId, messageData).then((response) => {
                if (leftItems.length > 0) {
                    messagesManager.handleResponseFromServer({actions: leftItems}, userId);
                }
            });
        }
        else {
            if (leftItems.length > 0) {
                messagesManager.handleResponseFromServer({actions: leftItems}, userId);
            }
        }
    }

};

messagesManager.createMessageData = function(action) {
    console.log('createMessageData');
    let messageData = null;

    if (action.type === 'addBotText') {
        console.log('addBotText');

        if (action.payload.chats.constructor === Array) {
            console.log('Array');
            let items = [];
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

                // actions.push({
                //     text: btn.str,
                //     type: 'link',
                //     default: true,
                //     uri: 'https://racheltest.herokuapp.com/webhook?organizationId=5a840642b1c48e11c07fbea31&language=he' + btn.value,
                //     payload: btn.value + '_',
                //     metadata: {cardType: btn.type, cardValue: btn.value, x:1}
                // });


                // items.push({
                //     title: 'which title..',
                //     actions: [{
                //         text: btn.str,
                //         type: 'postback',
                //         payload: btn.value + '_',
                //         metadata: {cardType: btn.type, cardValue: btn.value}
                //     }]
                // });
            });

            console.log('actions: ' + actions);
            messageData = messagesManager.createMessageCards(actions);
        }
        else {
            messageData = messagesManager.createMessageText(action.payload.chats.str, action.payload.chats.type);
        }
        return messageData;
    }
}

messagesManager.createMessageData_Facebook = function(action) {
    console.log('createMessageData_Facebook');
    let messageData = null;

    if (action.type === 'addBotText') {
        console.log('addBotText');

        if (action.payload.chats.constructor === Array) {
            console.log('Array');
            let items = [];
            let actions = [];
            action.payload.chats.forEach(function (btn) {
                console.log('btn: ' + JSON.stringify(btn, null, 4));

                items.push({
                    title: btn.str,
                    actions: [{
                        text: btn.str,
                        type: 'postback',
                        payload: btn.value + '_',
                        metadata: {cardType: btn.type, cardValue: btn.value}
                    }]
                });


            });

            console.log('actions: ' + actions);
            //messageData = messagesManager.createMessageCarousel(actions);
            messageData = {
                role: 'appMaker',
                type: 'carousel',
                items: items
            };
            //return messageData;
        }
        else {
            messageData = messagesManager.createMessageText(action.payload.chats.str, action.payload.chats.type);
        }
        return messageData;
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
                    console.log('123***response: ' + JSON.stringify(response));

                    messagesManager.myEmitter.on('event', function(req) {
                        let messageId = response.message._id;
                        console.log('messageId' + messageId);
                        //console.log('123***req:' + JSON.stringify(req.body));
                        console.log('123***');
                        if (req.body.messages[0]._id == messageId) {
                            console.log('456***');

                            messagesManager.smoochCore.appUsers.deleteMessage({
                                appId: appId,
                                userId: userId,
                                messageId: messageId
                            }).then(() => {
                                console.log('deleteMessage success ***');
                            });

                            console.log('deleteMessage sent***');
                            return resolve();//rachel
                        }
                    });


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

};


messagesManager.createMessageCards = function(actions){
    let messageData = {
        role: 'appMaker',
        type: 'text',
        text: '------',
        actions: actions
    };
    return messageData;
};

messagesManager.createMessageCarousel = function(items){
    let messageData = {
        role: 'appMaker',
        type: 'carousel',
        items: items
    };
    return messageData;
};

// messagesManager.createMessageCards = function(items){
//     let messageData = {
//         role: 'appMaker',
//         type: 'list',
//         actions:items
//
//     };
//     return messageData;
// }

module.exports = messagesManager;