'use strict';

const config = require('config'),
    flow_manager_path = config.get('flow_manager_path'),
    appId = config.get('appId');

// const smoochBot = require('smooch-bot');
//const MemoryLock = smoochBot.MemoryLock;
//const SmoochApiStore = smoochBot.SmoochApiStore;
// const SmoochApiBot = smoochBot.SmoochApiBot;
// const StateMachine = smoochBot.StateMachine;
// const script = require('../script');

    const app = require('../app');

    const SmoochCore = require('smooch-core');

    const jwt = require('../jwt');


    console.log('errorrrrrrr')

//const requestToService = require('../requestToService');
const messagesManager = require('../messagesManager');
//const appId = '5c6007ce383ee5002262e55d';
// const name = 'SmoochBot';
// const avatarUrl = 'https://s.gravatar.com/avatar/f91b04087e0125153623a3778e819c0a?s=80';
// const store = new SmoochApiStore({
//     jwt
// });
// const lock = new MemoryLock();
// const webhookTriggers = ['message:appUser', 'postback'];
//
// function createWebhook(smoochCore, target) {
//     return smoochCore.webhooks.create({
//         target,
//         triggers: webhookTriggers
//     })
//         .then((res) => {
//             console.log('Smooch webhook created with target', res.webhook.target);
//         })
//         .catch((err) => {
//             console.error('Error creating Smooch webhook:', err);
//             console.error(err.stack);
//         });
// }
//
// function updateWebhook(smoochCore, existingWebhook) {
//     return smoochCore.webhooks.update(existingWebhook._id, {
//         triggers: webhookTriggers
//     })
//         .then((res) => {
//             console.log('Smooch webhook updated with missing triggers', res.webhook.target);
//         })
//         .catch((err) => {
//             console.error('Error updating Smooch webhook:', err);
//             console.error(err.stack);
//         });
// }



// smoochCore.appUsers.getMessages({
//     appId: appId,
//     userId: 'c7f6e6d6c3a637261bd9656f',
//     query: {
//         before: 1471995721
//     }
// }).then((response) => {
//     // async code
// });

// const userId = 'bc30d7230657c83bebb6d5fa';
const smoochCore = new SmoochCore({
        jwt: jwt,
    });

console.log('new smooch')

try {
    messagesManager.setSmoochCore(smoochCore);
    console.log('setSmoochCore')

}catch (e) {
    console.log('err:'+e);

}



app.get('/testSmooch', function(req, res, next) {

    console.log('testSmooch');
    // console.log(smoochCore.integrations);
    let messageData = {
        role: 'appMaker',
        type: 'text',
        text: 'test only2'
    };
    // messagesManager.sendMessageToClient('905939d0c6e420b000ac969f', messageData).then((response) => {
    //     console.log('sendMessageToClient: ' + JSON.stringify(response));
    // });

    smoochCore.integrations.list({appId: '5c9741745e53740010af989f'}).then((response) => {
        console.log(JSON.stringify(response));
        res.json(response);
    });
});

//works!
app.post('/webhook', function(req, res, next) {




    // let currentOrganizationId = req.query.organizationId;
    // let currentLanguage = req.query.language;
    messagesManager.handleWebhook(req, res);

});

var server = app.listen(process.env.PORT || 8000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Smooch Bot listening at http://%s:%s', host, port);
});

// Create a webhook if one doesn't already exist
//if (process.env.SERVICE_URL) {
//     const target = "https://racheltest.herokuapp.com" + '/webhook';//process.env.SERVICE_URL.replace(/\/$/, '') + '/webhook';

//
//     smoochCore.webhooks.list()
//         .then((res) => {
//             const existingWebhook = res.webhooks.find((w) => w.target === target);
//
//             if (!existingWebhook) {
//                 return createWebhook(smoochCore, target);
//             }
//
//             const hasAllTriggers = webhookTriggers.every((t) => {
//                 return existingWebhook.triggers.indexOf(t) !== -1;
//             });
//
//             if (!hasAllTriggers) {
//                 updateWebhook(smoochCore, existingWebhook);
//             }
//         },
//         (error)=>{
//
//         });




    // smoochCore.appUsers.get({
    //     appId: appId,
    //     userId: 'steveb@channel5.com'
    // }).then((response) => {
    //         // async code
    //         smoochCore.appUsers.sendMessage({
    //             appId: appId,
    //             userId: 'steveb@channel5.com',
    //             message: {
    //                 text: 'Just put some vinegar on it',
    //                 role: 'appUser',
    //                 type: 'text'
    //             }
    //         }).then((response) => {
    //             // async code
    //         },
    //     (error)=>{
    //
    //     });
    //     },
    //     (error)=>{
    //
    //     });

// smoochCore.appUsers.get({
//     appId: appId,
//     userId: userId
// }).then((response) => {
//         // async code
//         smoochCore.appUsers.sendMessage({
//             appId: appId,
//             userId: userId,
//             message: {
//                 text: 'app_user222',
//                 role: 'appUser',
//                 type: 'text'
//             }
//         }).then((response) => {
//                 // async code
//             },
//             (error)=>{
//
//             });
//
//         smoochCore.appUsers.sendMessage({
//             appId: appId,
//             userId: userId,
//             message: {
//                 text: 'app_maker',
//                 role: 'appMaker',
//                 type: 'text'
//             }
//         }).then((response) => {
//                 // async code
//             },
//             (error)=>{
//
//             });
//     },
//     (error)=>{
//
//     });

// smoochCore.appUsers.getMessages({
//     appId: appId,
//     userId: userId,
//     query: {
//
//     }
// }).then((response) => {
//         // async code
//     },
//     (error)=>{
//
//     });

// smoochCore.appUsers.get({
//     appId: appId,
//     userId: 'rut@i-rox.net'
// }).then((response) => {
//
//     // smoochCore.appUsers.create({
//     //     appId: appId,
//     //     appUser: {
//     //         userId: 'steveb@channel5.com',
//     //         givenName: 'Steve',
//     //         properties: {
//     //             favoriteFood: 'prizza'
//     //         }
//     //     }
//     // }).then((response) => {
//     //     // async code
//     // },
//     // (error)=>{
//     //
//     // });
//
// });
//}

// function createBot(appUser) {
//     const userId = appUser.userId || appUser._id;
//     return new SmoochApiBot({
//         name,
//         avatarUrl,
//         lock,
//         store,
//         userId
//     });
// }

//messages that received from client
// function handleMessages2(req, res) {
//     const messages = req.body.messages.reduce((prev, current) => {
//         if (current.role === 'appUser') {
//             prev.push(current);
//         }
//         return prev;
//     }, []);
//
//     if (messages.length === 0) {
//         return res.end();
//     }
//
//     const userId = req.body.appUser.userId || req.body.appUser._id;
//
//     // const language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
//     // sendRequest(userId, res, language, messages[0].text)
//
//
//     smoochCore.appUsers.sendMessage({
//         appId: appId,
//         userId: userId,
//         message: {
//             text: 'reply to: ' + messages[0].text + ' {userId: ' + userId + '}',
//             role: 'appMaker',
//             type: 'text'
//         }
//     }).then((response) => {
//             res.end();
//             // async code
//         },
//         (error)=>{
//
//         });
//
//     // const stateMachine = new StateMachine({
//     //     script,
//     //     bot: createBot(req.body.appUser)
//     // });
//     //
//     // stateMachine.receiveMessage(messages[0])
//     //     .then(() => res.end())
//     //     .catch((err) => {
//     //         console.error('SmoochBot error:', err);
//     //         console.error(err.stack);
//     //         res.end();
//     //     });
// }

//messages that received from client
// function handleMessages_byFM(req, res) {
//     const messages = req.body.messages.reduce((prev, current) => {
//         if (current.role === 'appUser') {
//             prev.push(current);
//         }
//         return prev;
//     }, []);
//
//     if (messages.length === 0) {
//         return res.end();
//     }
//
//     const userId = req.body.appUser.userId || req.body.appUser._id;
//
//     let language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
//     language = 'he';
//     sendRequest(userId, res, language, messages[0].text)
//     res.end();
// }


//const flow_manager_path = "https://192.168.10.132:8081/flow-manager/request";
//const flow_manager_path = "https://flow-manager.membitbot.com/flow-manager/request";
//const flow_manager_path = 'https://messenger-manager.membitbot.com/messenger-manager/request/'
//const organizationId = '5a840642b1c48e11c07fbea2';

// const testBody = {"type":"message","organization":"5a840642b1c48e11c07fbea2","sessionId":"7cf48d14106b853a0586ec30","language":"en-US","text":"התחל"};
// requestToService.sendRequest(flow_manager_path, 'post', testBody).then(data => {
//
// });
//initChat


// function createMessageText(text){
//     let messageData = {
//         role: 'appMaker',
//         type: 'text',
//         text: text
//     };
//     return messageData;
//
// }
//
// function createMessageCards(actions){
//     let messageData = {
//         role: 'appMaker',
//         type: 'text',
//         actions: actions
//     };
//     return messageData;
// }

// function sendMessageToClient(userId, message, res) {
//     console.log('message: ' + message);
//     smoochCore.appUsers.sendMessage({
//         appId: appId,
//         userId: userId,
//         message: message
//     }).then((response) => {
//             res.end();
//             console.log('sendMessage by smooch -after success:\n');
//             // async code
//         },
//         (error)=>{
//             res.end();
//             console.log('sendMessage by smooch -after failure:\n');
//             console.log('fromAppUser:\n', JSON.stringify(error, null, 4));
//
//         });
//
//     // smoochCore.appUsers.sendMessage({
//     //     appId: appId,
//     //     userId: userId,
//     //     message: {
//     //         role: 'appMaker',
//     //         type: 'text',
//     //         text:'כותרת',
//     //
//     //         actions: [
//     //             {
//     //                 text: 'פעולה 1',
//     //                 type: 'postback',
//     //                 payload: 'Open_Ticket1'
//     //             },
//     //             {
//     //                 text: 'פעולה 2',
//     //                 type: 'postback',
//     //                 payload: 'Update_Ticket2'
//     //             }]
//     //     }
//     // }).then((response) => {
//     //         res.end();
//     //         console.log('sendMessage by smooch -after success:\n');
//     //         // async code
//     //     },
//     //     (error)=>{
//     //         res.end();
//     //         console.log('sendMessage by smooch -after failure:\n');
//     //         console.log('fromAppUser:\n', JSON.stringify(error, null, 4));
//     //
//     //     });
// }

// function sendRequest(userId, res, language, userText, cardType='text', cardValue = null) {
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
//     //text, event
//     console.log('sendRequest to flow-manager -before:\n', JSON.stringify(body, null, 4));
//
//     requestToService.sendRequest(flow_manager_path, 'post', body).then(data => {
//
//         console.log('sendRequest to flow-manager -after :\n', JSON.stringify(data, null, 4));
//
//         console.log('sendMessage by smooch -before:');
//
//         let dataObject = JSON.parse(data);
//         console.log('data.actions: '+ JSON.stringify(dataObject,null,4));
//
//         for (let action of dataObject.actions) {
//             if (action.type === 'addBotText') {
//                 console.log('addBotText');
//                 if (action.payload.chats.constructor === Array) {
//                     console.log('Array');
//                     let actions = [];
//                     action.payload.chats.forEach(function (btn) {
//                         console.log('btn: ' +JSON.stringify(btn, null, 4) );
//                         actions.push({
//                             text: btn.str,
//                             type: 'postback',
//                             payload: btn.value + '_',
//                             metadata:{cardType:btn.type, cardValue:btn.value} //rachel
//                         });
//                     });
//                     //btn.value
//                     console.log('actions: ' + actions);
//                     let messageData = createMessageCards(actions);
//                     sendMessageToClient(userId, messageData, res);
//                 }
//                 else {
//                     let messageData = createMessageText(action.payload.chats.str, action.payload.chats.type);
//                     sendMessageToClient(userId, messageData, res);
//                 }
//             }
//         }
//
//
//
//
//
//         //good also in facebook
//         // smoochCore.appUsers.sendMessage({
//         //     appId: appId,
//         //     userId: userId,
//         //     message: {
//         //         role: 'appMaker',
//         //         type: 'text',
//         //         text:'כותרת',
//         //
//         //         actions: [
//         //             {
//         //             text: 'פעולה 1',
//         //             type: 'postback',
//         //             payload: 'Open_Ticket1'
//         //         },
//         //             {
//         //                 text: 'פעולה 2',
//         //                 type: 'postback',
//         //                 payload: 'Update_Ticket2'
//         //             }]
//         //     }
//         // }).then((response) => {
//         //         res.end();
//         //         console.log('sendMessage by smooch -after success:\n');
//         //         // async code
//         //     },
//         //     (error)=>{
//         //         res.end();
//         //         console.log('sendMessage by smooch -after failure:\n');
//         //         console.log('fromAppUser:\n', JSON.stringify(error, null, 4));
//         //
//         //     });
//
//
//         // smoochCore.appUsers.sendMessage({
//         //     appId: appId,
//         //     userId: userId,
//         //     message: {
//         //         role: 'appMaker',
//         //         type: 'list',
//         //         items: [{
//         //             title: 'איטם 1',
//         //             size: 'large',
//         //             actions: [{
//         //                 text: 'פעולה 1',
//         //                 type: 'postback',
//         //                 payload: 'Open_Ticket'
//         //             },
//         //             {
//         //                 text: 'פעולה 2',
//         //                 type: 'postback',
//         //                 payload: 'Update_Ticket'
//         //             }]
//         //         },
//         //         {
//         //             title: 'איטם 2',
//         //             size: 'large',
//         //             actions: [{
//         //                 text: 'פעולה 1',
//         //                 type: 'postback',
//         //                 payload: 'Open_Ticket1'
//         //             },
//         //             {
//         //                 text: 'פעולה 2',
//         //                 type: 'postback',
//         //                 payload: 'Update_Ticket2'
//         //             }]
//         //         }
//         //         ]
//         //     }
//         // }).then((response) => {
//         //         //res.end();
//         //         console.log('sendMessage by smooch -after success:\n');
//         //         // async code
//         //     },
//         //     (error)=>{
//         //         console.log('sendMessage by smooch -after failure:\n');
//         //         console.log('fromAppUser:\n', JSON.stringify(error, null, 4));
//         //
//         //     });
//
//          // smoochCore.appUsers.sendMessage({
//          //     appId: appId,
//          //     userId: userId,
//          //     message: {
//          //         text: data,
//          //         role: 'appMaker',
//          //         type: 'text'
//          //     }
//          // }).then((response) => {
//          //         //res.end();
//          //         console.log('sendMessage by smooch -after success:\n');
//          //         // async code
//          //     },
//          //     (error)=>{
//          //         console.log('sendMessage by smooch -after failure:\n');
//          //     });
//
//
//
//
//     }).catch(error => {
//         res.end();
//         let errorMessage = '';
//         if (!error || error.code === "ECONNRESET" || !error.body || error.statusCode === 520) {
//             errorMessage = "interfaceCommunicationError";
//         }
//         else {
//             errorMessage = error.body;
//         }
//         console.info(errorMessage);
//     });
// }

// function handleMessages(req, res) {
//     const messages = req.body.messages.reduce((prev, current) => {
//         if (current.role === 'appUser') {
//             prev.push(current);
//         }
//         return prev;
//     }, []);
//
//     if (messages.length === 0) {
//         return res.end();
//     }
//
//
//
//     const stateMachine = new StateMachine({
//         script,
//         bot: createBot(req.body.appUser)
//     });
//
//     stateMachine.receiveMessage(messages[0])
//         .then(() => res.end())
//         .catch((err) => {
//             console.error('SmoochBot error:', err);
//             console.error(err.stack);
//             res.end();
//         });
//
//
// }

// function handlePostback(req, res) {
//     console.log('handlePostback:\n', JSON.stringify(req.body, null, 4));
//
//     const postback = req.body.postbacks[0];
//     if (!postback || !postback.action) {
//         res.end();
//     }
//
//
//     const userId = req.body.appUser.userId || req.body.appUser._id;
//      let language = req.body.appUser.clients && req.body.appUser.clients[0].info.browserLanguage ? req.body.appUser.clients[0].info.browserLanguage : "he";
//      language = 'he';
//
//     // metadata:{cardType:btn.type, cardValue:btn.value
//     // postback.action.metadata
//     // postback.action //rachel
//      let cardType = postback.action.metadata.cardType ? postback.action.metadata.cardType : 'text';
//      let cardValue = postback.action.metadata.cardValue ? postback.action.metadata.cardValue : null;
//      sendRequest(userId, res, language, postback.action.text, cardType, cardValue);
//     res.end();
//
//     // createBot(req.body.appUser).say(`You said: ${postback.action.text} (payload was: ${postback.action.payload})`)
//     //     .then(() => res.end());
// }



app.post('/fromAppUser', function(req, res) {
    console.log('fromAppUser:\n', JSON.stringify(req.body, null, 4));
    // const payload = req.body;
    // const message = payload.messages[0];
    // const text = message.text;
    // Translation magic happens here
    // ...
});

// Receive app maker messages
app.post('/fromAppMaker', function(req, res) {
    console.log('fromAppMaker:\n', JSON.stringify(req.body, null, 4));
    //
    // Translation magic
});

app.post('/appuser:message',(req, res) => {

    console.log('received appuser message');
    console.log(JSON.stringify(req.body, null, 4));
});




//not arrived here
app.post('/messages', function(req, res) {
    console.log('webhook PAYLOAD:\n', JSON.stringify(req.body, null, 4));

    const appUserId = req.body.appUser._id;
    // Call REST API to send message https://docs.smooch.io/rest/#post-message
    if (req.body.trigger === 'message:appUser') {
        smoochCore.appUsers.sendMessage(appUserId, {
            type: 'text',
            text: 'Live long and prosper',
            role: 'appMaker'
        })
            .then((response) => {
                console.log('API RESPONSE:\n', response);
                res.end();
            })
            .catch((err) => {
                console.log('API ERROR:\n', err);
                res.end();
            });
    }
});

