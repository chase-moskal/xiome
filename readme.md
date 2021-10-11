
# 💠 [xiome.io](https://xiome.io/)

## open source cloud-powered web components

- 🔌 xiome components are universal plugins for websites
- 🛡️ let your users enjoy a passwordless login experience
- 🙌 engage your users with features like forums
- 💰 monetize your audience with subscriptions and paywalls
- ☁️ let xiome cloud do the heavy lifting running the servers
- ⚡ jumpstart your app by using xiome's auth system

<br/>

## xiome installation

1. **setup your community on https://xiome.io/setup**  
  xiome cloud needs to know your website's homepage

1. **copy-paste your community's installation snippet**  
  every page using xiome components needs the install snippet in your website's html `<head>`

1. **copy-paste components wherever you want!**  
  now you're ready to start pasting in components, from the reference below, however you wish. go crazy!

<br/>

## xiome component reference

### 🔐 **components for logins and accounts**

#### &nbsp;&nbsp;⚙️ ***\<xiome-login-panel\>***
- so users can login to your community
- can be used to hide content from users who are not-logged-in
- ```html
  <xiome-login-panel show-logout>
    <p>hello, you are logged in</p>
    <p slot="logged-out">sorry, you are logged out</p>
  </xiome-login-panel>
  ```
  - `show-logout` — show a logout button

#### &nbsp;&nbsp;⚙️ ***\<xiome-my-account\>***
- so users can edit their own profile
- ```html
  <xiome-my-account></xiome-my-account>
  ```

#### &nbsp;&nbsp;⚙️ ***\<xiome-my-avatar\>***
- display the user's own avatar
- ```html
  <xiome-my-avatar></xiome-my-avatar>
  ```

### 🕹️ **components to engage users**

#### &nbsp;&nbsp;⚙️ ***\<xiome-questions\>***
- a questions and answers board
- designed for influencers to communicate with their audience
- ```html
  <xiome-questions board="default"></xiome-questions>
  ```
  - `board="default"` — identify which board to display.  
    you can have as many boards as you want.

#### &nbsp;&nbsp;⚙️ ***\<xiome-video-display\>***
- display a video or livestream to your users
- admins get a control panel to customize which video is displayed
- *(a video hosting account must be linked using `<xiome-video-link>`)*
- ```html
  <xiome-video-display label="default"></xiome-video-display>
  ```
  - `label="default"` — identify which video you want to display.  
    give it any name you like.

### 🔧 **components for administrators**

#### &nbsp;&nbsp;⚙️ ***\<xiome-manage-users\>***
- search widget for finding users and changing their permissions
- ```html
  <xiome-manage-users></xiome-manage-users>
  ```

#### &nbsp;&nbsp;⚙️ ***\<xiome-permissions\>***
- customize permissions within your community
- ```html
  <xiome-permissions></xiome-permissions>
  ```

#### &nbsp;&nbsp;⚙️ ***\<xiome-video-link\>***
- admins can link a video hosting account to your community
- this allows admins to select any of the linked account's videos to display
- ```html
  <xiome-video-link></xiome-video-link>
  ```

### 🎷 **components that don't need cloud power to run**

- documentation for these coming soon

<br/>

## how to work on xiome as a developer

&nbsp;💡 **prerequisites**
- install `git`, `nodejs`, `vscode`, and [connect github with ssh keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- if you're on windows, setup [wsl](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux)

&nbsp;🛠️ **initial setup**
- fork the xiome project on github, and git clone your fork
- open a terminal in your cloned directory, and run these commands
  - `npm install` to install the project's dependencies
  - `npm run build` to build the project

&nbsp;⚙️ **during your development session**
- run these processes, each in their own terminal
  - `npm run watch` to continually rebuild source files on save
  - `npm start` to run a local http server at http://localhost:5000/
  - *note:* [tmux](https://en.wikipedia.org/wiki/Tmux) is a great way to split terminal windows
  - *note:* of course, when you're done, end each process by pressing `ctrl+c`
- open vscode by running `code .`
  - you should be able to see the xiome platform website at http://localhost:5000/x/
  - and the app development mocksite at http://localhost:5000/x/mocksite/
  - now you are ready to code
  - when you save a typescript or pug file, the watch routine will automatically rebuild it, so you can press refresh in the browser to see the changes
  - you can press vscode hotkey `ctrl+shift+b` to run the typescript build, which allows vscode to nicely highlight typescript errors for you to address

&nbsp;🧠 **things to understand**
- mock mode
  - the watch routine builds xiome into a "mock" mode
  - in mock mode, you don't need to run the xiome server, or connect to any databases
  - all of xiome, including the backend business logic, is running in the browser (and is easily debuggable there)
