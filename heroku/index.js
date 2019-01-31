'use strict';

const smoochBot = require('smooch-bot');
const MemoryLock = smoochBot.MemoryLock;
const SmoochApiStore = smoochBot.SmoochApiStore;
const SmoochApiBot = smoochBot.SmoochApiBot;
const StateMachine = smoochBot.StateMachine;
const app = require('../app');
const script = require('../script');
const SmoochCore = require('smooch-core');
const jwt = require('../jwt');

const appId = '5c46da91005ceb0028febd3d';
const name = 'SmoochBot';
const avatarUrl = 'https://s.gravatar.com/avatar/f91b04087e0125153623a3778e819c0a?s=80';
const store = new SmoochApiStore({
    jwt
});
const lock = new MemoryLock();
const webhookTriggers = ['message:appUser', 'postback'];

function createWebhook(smoochCore, target) {
    return smoochCore.webhooks.create({
        target,
        triggers: webhookTriggers
    })
        .then((res) => {
            console.log('Smooch webhook created with target', res.webhook.target);
        })
        .catch((err) => {
            console.error('Error creating Smooch webhook:', err);
            console.error(err.stack);
        });
}

function updateWebhook(smoochCore, existingWebhook) {
    return smoochCore.webhooks.update(existingWebhook._id, {
        triggers: webhookTriggers
    })
        .then((res) => {
            console.log('Smooch webhook updated with missing triggers', res.webhook.target);
        })
        .catch((err) => {
            console.error('Error updating Smooch webhook:', err);
            console.error(err.stack);
        });
}



// smoochCore.appUsers.getMessages({
//     appId: appId,
//     userId: 'c7f6e6d6c3a637261bd9656f',
//     query: {
//         before: 1471995721
//     }
// }).then((response) => {
//     // async code
// });

const userId = 'bc30d7230657c83bebb6d5fa';

// Create a webhook if one doesn't already exist
//if (process.env.SERVICE_URL) {
    const target = "https://racheltest.herokuapp.com" + '/webhook';//process.env.SERVICE_URL.replace(/\/$/, '') + '/webhook';
    const smoochCore = new SmoochCore({
        jwt: jwt,
    });

    smoochCore.webhooks.list()
        .then((res) => {
            const existingWebhook = res.webhooks.find((w) => w.target === target);

            if (!existingWebhook) {
                return createWebhook(smoochCore, target);
            }

            const hasAllTriggers = webhookTriggers.every((t) => {
                return existingWebhook.triggers.indexOf(t) !== -1;
            });

            if (!hasAllTriggers) {
                updateWebhook(smoochCore, existingWebhook);
            }
        },
        (error)=>{

        });




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

    // smoochCore.appUsers.create({
    //     appId: appId,
    //     appUser: {
    //         userId: 'steveb@channel5.com',
    //         givenName: 'Steve',
    //         properties: {
    //             favoriteFood: 'prizza'
    //         }
    //     }
    // }).then((response) => {
    //     // async code
    // },
    // (error)=>{
    //
    // });


//}

function createBot(appUser) {
    const userId = appUser.userId || appUser._id;
    return new SmoochApiBot({
        name,
        avatarUrl,
        lock,
        store,
        userId
    });
}

//messages that received from client
function handleMessages2(req, res) {
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


    smoochCore.appUsers.sendMessage({
        appId: appId,
        userId: userId,
        message: {
            text: 'reply to: ' + messages[0].text,
            role: 'appMaker',
            type: 'text'
        }
    }).then((response) => {
            // async code
        },
        (error)=>{

        });

    // const stateMachine = new StateMachine({
    //     script,
    //     bot: createBot(req.body.appUser)
    // });
    //
    // stateMachine.receiveMessage(messages[0])
    //     .then(() => res.end())
    //     .catch((err) => {
    //         console.error('SmoochBot error:', err);
    //         console.error(err.stack);
    //         res.end();
    //     });
}

function handleMessages(req, res) {
    const messages = req.body.messages.reduce((prev, current) => {
        if (current.role === 'appUser') {
            prev.push(current);
        }
        return prev;
    }, []);

    if (messages.length === 0) {
        return res.end();
    }



    const stateMachine = new StateMachine({
        script,
        bot: createBot(req.body.appUser)
    });

    stateMachine.receiveMessage(messages[0])
        .then(() => res.end())
        .catch((err) => {
            console.error('SmoochBot error:', err);
            console.error(err.stack);
            res.end();
        });


}

function handlePostback(req, res) {
    const postback = req.body.postbacks[0];
    if (!postback || !postback.action) {
        res.end();
    }

    createBot(req.body.appUser).say(`You said: ${postback.action.text} (payload was: ${postback.action.payload})`)
        .then(() => res.end());
}

app.post('/webhook', function(req, res, next) {
    const trigger = req.body.trigger;

    switch (trigger) {
        case 'message:appUser':
            //console.log('webhook.message:appUser' + );
            console.log('webhook.message:appUser:\n', JSON.stringify(req.body, null, 4));
            handleMessages2(req, res);


            //handleMessages(req, res);
            break;

        case 'postback':
            console.log('webhook.postback');
            //handlePostback(req, res);
            break;

        default:
            console.log('Ignoring unknown webhook trigger:', trigger);
    }
});

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

var server = app.listen(process.env.PORT || 8000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Smooch Bot listening at http://%s:%s', host, port);
});
