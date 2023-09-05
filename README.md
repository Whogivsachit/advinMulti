# AdvinMulti Discord Bot

AdvinMulti is a sleek and efficient Discord bot developed using discord.js. This bot provides real-time stock updates and notifications to users. Stay informed about stock changes effortlessly right in your discord server.

![AdvinMulti Banner](https://cdn.chit.sh/uploads/iuferopl7i6df6bk811tgthnypnjia.png)

## Features

- **Interactive Commands:** Engage your server members with fun and interactive commands that add a lively touch to your Discord community.

- **Dynamic Per Guild Settings:** Customize the bot's behavior on a per-guild basis, tailoring its features to your server's unique needs.

- **Real-time Stock Updates:** Utilize a bun ran API to pull accurate and up-to-date stock information directly from the AdvinServers website.

- **Subscription Notifications:** Receive stock notifications via DMs, ensuring that you're always informed about changes and updates.

- **Frequent Channel Embed Updates:** Keep your server informed with a dedicated channel embed that updates at regular intervals, providing the latest stock information.

- **Easy Customization:** Modify settings effortlessly using a simple `.env` file, allowing for quick and hassle-free customization.

- **High Availability:** Benefit from a remote database that ensures data availability and reliability.

- **Utilizing WOKCommands & Sequelize:** Built with WOKCommands and Sequelize, AdvinMulti is optimized for seamless command handling and efficient data management.

## Example Usage

Here are some examples of how to use AdvinMulti:

- View the current stock of a category:
  ```
  /stock <category>
  ```

- Subscribe to stock notifications:
  ```
  /subscribe <category> <product>
  ```

- Unsubscribe from stock notifications:
  ```
  /unsubscribe <product>
  ```

- List your current Subscriptions:
  ```
  /subscriptions
  ```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/whogivsachit/AdvinMulti
   cd AdvinMulti
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file and set your bot token and other configuration options:
   ```
    # Bot
    PNAME=
    LOGOURL=
    TOKEN=

    # API
    APIURL=
    APITOKEN=
    UPDATEINTERVAL=

    # DB
    DBHOST=
    DBPORT=
    DB=
    DBUSER=
    DBPASS=
   ```

4. Start the bot:
   ```
   node index.js
   ```
