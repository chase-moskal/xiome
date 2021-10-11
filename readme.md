
# 💠 [xiome.io](https://xiome.io/)

<br/>

## open source cloud-powered web components

- 🔌 xiome components are universal plugins for websites
- 🛡️ let your users enjoy a passwordless login experience
- 🙌 engage your users with cool features, like a questions board
- 💰 monetize your audience with subscriptions and paywalls
- ☁️ let xiome cloud do the heavy lifting running the servers
- ⚡ jumpstart your app by using xiome's auth system

<br/>

## xiome installation

1. create your community at https://xiome.io/setup
2. copy-paste your community's insall snippet into your web page's html `<head>`
3. copy-paste any components you want from https://xiome.io/components into your website's `<body>`

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
