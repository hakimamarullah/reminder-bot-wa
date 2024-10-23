# Reminder Bot for WhatsApp

This project is a WhatsApp reminder bot that helps users keep track of their attendance and sends reminders based on specified schedules.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: This comes bundled with Node.js.

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/reminder-bot-wa.git
   cd reminder-bot-wa
   ```

2. **Install dependencies**:

   Run the following command to install the required Node.js packages:

   ```bash
   npm install
   ```

## Running the Bot

To start the reminder bot, execute the following command:

```bash
node main.js
```

### Authentication

- Upon first run, the bot will generate a QR code for WhatsApp Web authentication. Scan the QR code using your WhatsApp mobile app to log in.


## Usage

Once the bot is running, it will:

- Listen for messages in WhatsApp.
- Send reminders based on your defined schedule.
- Handle user registration and send personalized notifications.

### Commands

- Use the command `!register-YourName` to register your name with the bot.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

## Acknowledgments

- Thanks to [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) for the WhatsApp Web API.
- Thanks to [Node.js](https://nodejs.org/) for providing a runtime environment.
