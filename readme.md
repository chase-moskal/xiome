
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
2. copy-paste your community's install snippet into your web page's html `<head>`
3. copy-paste any components you want from https://xiome.io/components into your website's `<body>`

<br/>

<br/>

---
---

<br/>

# how to work on xiome as a developer

<br/>

## 💡 getting started

&nbsp; **prerequisites**
- install `git`, `nodejs`, `vscode`, and [connect github with ssh keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- if you're on windows, setup [wsl](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux)

&nbsp; **initial setup**
- fork the xiome project on github, and git clone your fork
- open a terminal in your cloned directory, and run these commands
  - `npm install` to install the project's dependencies
  - `npm run build` to build the project

&nbsp; **during your development session**
- run these background processes, each in their own terminal
  - `npm run watch` to continually rebuild source files on save
  - `npm start` to run a local http server at http://localhost:5000/  
    *(if npm start fails, try it again, it often works the second time)*
  - *note:* [tmux](https://en.wikipedia.org/wiki/Tmux) is a great way to split terminal windows
  - *note:* of course, when you're done, end each process by pressing `ctrl+c`
- open vscode by running `code .`
  - you should be able to see the xiome platform website at http://localhost:5000/x/
  - and the app development mocksite at http://localhost:5000/x/mocksite/
  - now you are ready to code
  - when you save a typescript or pug file, the watch routine will automatically rebuild it, so you can press refresh in the browser to see the changes
  - you can press vscode hotkey `ctrl+shift+b` to run the typescript build, which allows vscode to nicely highlight typescript errors for you to address

&nbsp; **things to understand**
- mock mode
  - the watch routine builds xiome into a "mock" mode
  - in mock mode, you don't need to run the xiome server, or connect to any databases
  - all of xiome, including the backend business logic, is running in the browser (and is easily debuggable there)

<br/>

## 🦅 xiome's codebase from a bird's eye view

everything about xiome is fully contained in this single git repository.  
let's take a stroll through the codebase.
- `.github/`  
  this is where the github actions live.  
  they do continuous integration and deployments.  
- `.vscode/`  
  this is where the settings for the vscode editor live.  
  it makes sure you'll indent with tabs as jesus intended.  
- `helm/`  
  this is where the scary kubernetes code lives.  
  it orchestrates the node servers in the cloud.  
- `s/`  
  this is where all the typescript source code lives.  
  there is where most development happens.  
  - `s/assembly/`  
    this is where all the pieces of xiome are assembled, much like legos, into a working backend and frontend.  
    this place is frightening.  
  - `s/features/`  
    this is where the feature development happens.  
    each feature contains all its backend and frontend code.  
    you should feel cozy here.  
  - `s/framework/`  
    this is where xiome defines its own lingo.  
    important base classes, like component, which is based on lit-element.  
  - `s/toolbox/`  
    this is a big collection of assorted utilities.  
    these might be useful outside of xiome for something totally unrelated.  
    these tools are candidates to become independent libraries one day.  
  - `s/types/`  
    these are where some common system-wide types go.  
    honestly these should be moved into the toolbox.  
- `scripts/`  
  just some handy shell scripts.  
  i use `randomid` a lot to generate new ids.  
- `web/`  
  this is where the https://xiome.io/ website lives.  
  and also the mocksite during development.  
- `x/`  
  these are build artifacts.  
  don't write code here. it gets deleted during each build.  

<br/>

## 🦵 the anatomy of a feature

xiome's cool code is organized into conceptual features.  
this is probably what you want to work on.  
here's what's in a feature directory:

### frontend
- `feature/components/`  
  web components live here.  
  html/css/js that the user interacts with.  
  components are wired up to models.  
  models give the components the state they should render.  
  models also provide functions that components can use to do smart things.  
- `feature/models/`  
  models are the brains behind components.  
  models coordinate state for components to render.  
  models act as a liaison between components and the backend.  
  often, models are locally caching information loaded from the backend.  
  there's only one instance of each model on the page.  
  models coordinate for components on a page-wide level.  
  generally, we want components to be dumb, leaving the smart logic to the models.  

### backend
- `feature/api/`  
  here's where you'll find the api services.  
  a service is a segment of the api, that has its own auth policy.  
  an auth policy a bouncer, that only lets certain users use the service.  
  here in the api directory, you'll also find definitions for the database tables.  

### testing
- `feature/testing/`  
  this is where testing setup, utilities, and mocks belong.  

<br/>

## ⚔️ how to survive within the xiome onion

if you think about xiome like an onion, you'll notice some distinct layers.  
each layer has its own little landscape of concepts and tools you'll need to learn to get anything done.  

### components — *what users interact with*
- learn about modern web development
  - learn about web components
  - learn about the shadow dom
  - learn about css custom properties, and css parts
  - learn https://lit.dev/
- learn about `ops`
  - the components commonly use a system called `ops` for loading spinners
  - anything that needs a loading spinner (many things) uses `ops`
  - they're everywhere
  - read how `ops` work further down the readme
- learn about xio vs xiome components
  - component with names starting with `xiome` are "wired up" with models and state management
  - components with names starting with `xio` are simpler standalone components without any wirings
- learn about xiome component wirings
  - xiome components have a property called `this.share`, which is a bag of goodies, like models and other facilities
  - xiome components are wired up with state management, so components will re-render whenever the relevant model state is changed
  - wirings happen in files with names like `integrate-blah-components.ts`
- learn that the `theme.css.ts` exists
  - all components inherit common css in `s/framework/theme.css.ts`

### models — *the brains on the frontend*
- learn about services
  - models are provided service objects, which contain async api functions
  - you just call the functions. those are api calls
- learn about `snapstate`
  - snapstate is the state management library for xiome
  - a model must return the relevant snapstate `subscribe` or `track` function
  - learn more about `snapstate` further below
- learn about `ops`
  - they're for loading spinners
  - they're everywhere because lots of things load
  - read more aboutn `ops` further below

### api services — *do servery things and talk with the database*
- learn `renraku` and how xiome uses it
  - xiome's api is built with https://github.com/chase-moskal/renraku
  - every async function in `expose` takes a first argument called `auth`
  - `auth` is where you'll find info about the current user
  - `auth` is where you'll find the database tables you need to use
  - `auth` is returned by the `policy` that each service has
- learn `dbby` to interact with the database
  - never forget that every id must be a `DamnId` instance in the database
  - dbby is what powers the magical serverless mock mode for development
  - learn more about `dbby` further down
- learn `darkvalley` for validation
  - it's just some functions for validating user inputs
  - learn more about `darkvalley` further down

<br/>

## ⚙️ systems to learn

<br/>

### &nbsp; **ops** — *loading spinners everywhere*

- "ops" is xiome's system for displaying loading spinners for asynchronous operations
- it's designed to be highly compatbile with state management libraries — this is why ops are simple object literals, instead of fancy class instances with methods and stuff
- ```ts
  import {ops, Op} from "./s/framework/ops.js"
  ```
- an `op` is an object that can be in one of four states:
  - `none` — the op is uninitialized
  - `loading` — the op is loading
  - `error` — an error has occurred
  - `ready` — loading is done, the data is ready
- `ops` is a toolkit with functions to create or interpret op objects
- create ops
  - `ops.none()` — create an op in `none` state
  - `ops.loading()` — create an op in `loading` state
  - `ops.error("thing failed lol")` — create an op in `error` state, provide a reason string
  - `ops.ready(value)` — create an op in `ready` state, provide the data value
  - `ops.replaceValue(op, newValue)` — create an op with the same state as another op
- check the current state of an op (return a boolean)
  - `ops.isNone(op)`
  - `ops.isLoading(op)`
  - `ops.isError(op)`
  - `ops.isReady(op)`
- extract the value out of an op (or return undefined)
  - `ops.value(op)`
- typescript types
  ```ts
  let textOp: Op<string> //<-- specify the typescript type of an op
  textOp = ops.ready("hello")
  ```
- select (return different values based on the state of an op)
  ```ts
  const value = ops.select(op, {
    none: () => 1,
    loading: () => 2,
    error: reason => 3,
    ready: value => 4,
  })
  ```
- running async operations  
  (perform an async operation, while updating an op property)
  ```ts
  let textOp: Op
  const text = await ops.operation({
    setOp: op => textOp = op,
    promise: fetchTextFromSomewhere(),
    errorReason: "failed to fetch the text",
  })
  ```
- consolidate many ops into one  
  (only in terms of state, value is discarded)
  ```ts
  const op = ops.combine(op1, op2, op3)
  ```
- debugging tools
  - `ops.mode(op)` — return an op's mode expressed as a string
  - `console.log(ops.debug(op))` — log the op's details for console debugging
- usage in components
  - the xio-op component is for low-level control of op rendering  
    (you can customize the loading spinner and more)
    ```js
    html`<xio-op .op=${op}></xio-op>`
    ```
    - renders a loading spinner when the op is loading
    - has a slot for each op state
  - use renderOp to render a proper `<xio-id>` component for an op
    ```ts
    import {renderOp} from "./s/framework/render-op.js"
    render() {
      return renderOp(op, value => html`
        <p>${value}</p>
      `)
    }
    ```
  - render an op-wrapped value, but without any loading spinner  
    (no `<xio-op>` component)
    ```ts
    import {whenOpReady} from "./s/framework/when-op-ready.js"
    render() {
      return whenOpReady(op, value => html`
        <p>${value}</p>
      `)
    }
    ```

### **snapstate** — *tiny state management*

- coming soon lol

### **dbby** — *agnostic mock-ready database adapter*

- coming soon lol

### **darkvalley** — *minimalistic validation*

- coming soon lol

<br/>

## 💰 bitcoin bounties

- **how to get involved and win a bounty**
  - find an open issue with the `bitcoin bounty` label
  - comment on the issue, and say you want to do the work. this allows us to assign you, so others know you're working on it
  - in the comment, post a public bitcoin wallet deposit address. this makes bounty transactions transparent and publicly verifiable
  - do the work. then submit a pull request for code review. expect to be asked to make changes.
- **if we merge the work, we pay the bounty**
  - the idea is to reward good work done fast. you'll know it's good work if we merge it.
  - if your work isn't good enough to merge, we might discard it and not pay the bounty. we might even choose somebody else's work over yours, and they'll win the bounty instead.
  - chase moskal makes the final decision on whether to merge any work.
- **bounties are rewards, not contracts**
  - chase moskal makes the final decision on whether to pay a bounty or not. you are not entitled to anything. all of these rules might change at any time.
- **bounties decay in value over time**
  - each bounty will have its own decay schedule, detailed in each issue
  - typically, starting on a certain date, a posted bounty will fall in value (decay) by a certain amount each day, until it reaches zero
  - after good work is merged, we calculate the bounty value based on the work author's last commit timing.
  - all date are expressed in pacific standard time
- **assignments are not reservations**
  - anybody could complete better work faster, and win the bounty — that's fair game
  - somebody could go on a bounty-hunting rampage, and beat everybody on their own assignments. if it's good work, done fast, they might win all the bounties.
  - in rare cases, chase moskal might deem it fair game for somebody to take over another's work, even building off their commits to continue where they left off. this might happen on high-priority work if the original author disappears partway through, or something like that. we might decide to split the bounty to reward both authors.
- **teamwork is cool**
  - it's cool if people mutually agree to work together on a single bounty. if people agree to split a bounty in some reasonable way, we'll honor that agreement.
  - chase moskal will arbitrate any disputes.
- **cheating and trickery is frowned upon**
  - any behavior that chase moskal deems uncool, unfair, or deceptive, may disqualify you from winning any bounty or participating in the future
  - obviously, goulish behavior like stealing work, or cheating by changing commit dates/times, anything like this will disqualify you from winning a bounty or participating in the future
