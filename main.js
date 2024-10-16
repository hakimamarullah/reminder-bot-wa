import whatsappWeb, {Client} from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import {insertSenderId, selectAllSenderIds} from './db.js';
import cron from 'node-cron';

const {LocalAuth} = whatsappWeb;


const getMessage = (nama) => {
    return `
*📅 Pengingat Kehadiran*

Yth. Bapak/Ibu ${nama},

Kami ingin mengingatkan Anda untuk melakukan *clock-in* dan *clock-out* sesuai dengan waktu yang telah ditentukan. Kehadiran Anda sangat penting untuk kelancaran operasional perusahaan.

*🕘 Waktu Clock-In:* 08:00 WIB  
*🕓 Waktu Clock-Out:* 17:00 WIB  

Mohon pastikan untuk selalu mencatat waktu kehadiran Anda. Terima kasih atas kerjasama dan dedikasi Anda.

Salam,  
Avengers HQ
`;
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Event when the client is ready
client.on('ready', () => {
    console.log('Client is ready!');
});

// Generate and display QR code for authentication
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// Handle registration messages
client.on('message_create', async message => {
    if (message.body?.startsWith('!register')) {
        const [, name] = message.body.split('-');

        if (!name) {
            await client.sendMessage(message.from, 'Please provide your name in the format: !register-YourName');
            return;
        }

        try {
            await insertSenderId(message.from, name);
            await client.sendMessage(message.from, `You have been registered successfully, ${name}. Thank you!`);
        } catch (error) {
            if (error === 'UniqueConstraint') {
                await client.sendMessage(message.from, 'You are already registered with this number.');
            } else {
                console.error('Registration error:', error);
                await client.sendMessage(message.from, 'An error occurred while registering. Please try again later.');
            }
        }
    }
});


// Function to send reminders
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendReminders = async () => {
    try {
        const receivers = await selectAllSenderIds();
        if (receivers.length > 0) {
            for (const { sender_id, name } of receivers) {
                try {
                    await client.sendMessage(sender_id, getMessage(name));
                    console.log(`Reminder sent to ${sender_id}`);

                    // Delay for 2 seconds
                    await delay(2000);
                } catch (sendError) {
                    console.error(`Error sending message to ${sender_id}:`, sendError);
                }
            }
        } else {
            console.log('No registered users to send reminders.');
        }
    } catch (error) {
        console.error('Error retrieving registered users:', error);
    }
};

// Schedule reminders at 07:30 AM and 04:30 PM (Asia/Jakarta timezone)
cron.schedule('30 7 * * *', async () => {
    console.log('Sending morning reminders...');
    await sendReminders();
}, {
    timezone: 'Asia/Jakarta'
});

cron.schedule('8 21 * * *', async () => {
    console.log('Sending afternoon reminders...');
    await sendReminders();
}, {
    timezone: 'Asia/Jakarta'
});


// Initialize the WhatsApp client
client.initialize();