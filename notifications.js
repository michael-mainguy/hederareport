require('dotenv').config();
const handlebars = require('handlebars');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_SECRET;
const smsClient = require('twilio')(accountSid, authToken);
const emailClient = require('@sendgrid/mail');

emailClient.setApiKey(process.env.SENDGRID_API_KEY);

const notification =
    {
        message: "1 Week: REMINDER: Your REVEL Moments experience with {{host_name}} on {{date}} is one week away! Click the link to view the full event details. {{link}}",
        recipients: [
            { phone: "12489358507", name:"Mike"},
            { email: "mike.mainguy@gmail.com", name: "Mike2" },
            { phone: "14404638059", name: "Palmer"},
            { phone: "19172321219", name: "Palmer"}

        ],
        host_name: "Chris Naegel",
        link: "https://revelmoments.com/collections/events/products/chris-naegel",
        date: "Monday, February 7 at 7 pm EST"
    };
sendNotification(notification);


function sendNotification(notification) {

    notification.recipients.forEach(function(recipient){
        if (recipient.phone) {
            let template = handlebars.compile(notification.message);
            let formattedMessage = template(
                {"host_name": notification.host_name,
                        "date": notification.date,
                        "link": notification.link});
            smsClient
                .messages
                .create({messagingServiceSid: process.env.TWILIO_MESSAGING_SID,
                    body: formattedMessage,
                    to: recipient.phone})
                .then(message => console.log(message.sid));
        }
    });
}


