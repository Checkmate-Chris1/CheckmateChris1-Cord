# CheckmateChris1-Cord 💬

**CheckmateChris1-Cord** is a real-time, anonymous chat application built with Flask. Inspired by platforms like Discord, it offers users the ability to communicate instantly without the need for accounts or sign-ups. Users are assigned the default nickname "Anon" but can change it at any time. The application also supports media attachments and includes AFK status functionalities.

## 🔑 Features

- **Anonymous Chat**: Users join as "Anon" by default.
- **Custom Nicknames**: Change your display name anytime.
- **Message Format**: Messages appear as `[NICKNAME] MESSAGE`.
- **Media Attachments**: Upload images or videos displayed on the right side; attachments become scrollable when numerous.
- **AFK Status**: Toggle AFK status with dedicated buttons, broadcasting `[USERNAME] is AFK` and `[USERNAME] came back`.

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Real-Time Communication**: Flask-SocketIO

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Checkmate-Chris1/CheckmateChris1-Cord.git
   cd CheckmateChris1-Cord
   ```
