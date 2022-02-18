
# 💠 [xiome.io](https://xiome.io/)

<br/>

## open source cloud-powered web components

- 🔌 xiome components are universal plugins for websites
- 🛡️ let your users enjoy a passwordless login experience
- 🙌 engage your users with cool features, like a questions board
- 💰 monetize your community with subscriptions and paywalls
- ☁️ let xiome cloud do the heavy lifting running the servers
- ⚡ jumpstart your app by using xiome's auth system

<br/>

## how to install xiome on your website

1. create your community at https://xiome.io/setup
2. copy-paste your community's html install snippet into your web page's html `<head>`
3. copy-paste any components you like from https://xiome.io/components into your website's `<body>`

<br/><br/>

# how to work on xiome as a developer

## 💡 getting started

<details><summary>(click to show details)</summary>

&nbsp; **fundamental skills**
- ℹ️ you don't have to master these skills. just be aware of them, so you know what to study when you encounter the need
- learn how to use git and github so you can collaborate
  - fork projects on github
  - use a visualization tool like `gitk` to understand git graphs
  - make and manage branches
  - add and reset staged changes, make and amend commits
  - manage git remotes, fetch, pull, and pull branches
  - interactive rebase to rewrite and cleanup history
  - keep your branches up to date by rebasing onto master regularly
  - resolve and merge conflicts
  - make pull requests on github, and respond to code reviews
- learn the basics of using a bash shell
- learn the basics of typescript
- learn npm to install dependencies and run npm package scripts
- learn how to write code that blends in with the style and formatting of the rest of the codebase
- please be aware of the whitespace you author (the vscode setting `Render whitespace` setting `Boundary` is great for this)

&nbsp; **technical prerequisites**
- if you're on windows, first, setup [wsl](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux) and learn how it works
  - or otherwise install a linux virtual machine for development (we recommend debian+kde on vmware)
- install `git`, `nodejs`, `vscode`, and [connect github with ssh keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

&nbsp; **initial setup**
- fork the xiome project on github, and git clone your fork
- open a terminal in your cloned directory, and run these commands
  - `npm install` to install the project's dependencies
  - `npm run build` to run a full build of the project

&nbsp; **during your development sessions**
- run `npm install` if you've recently pulled any changes to the package json
- run these background processes, each in their own terminal
  - `npm run watch` to continually rebuild source files on save
  - `npm start` to run a local http server at http://localhost:8080/  
    *(if npm start fails, try it again, it often works the second time)*
  - *note:* [tmux](https://en.wikipedia.org/wiki/Tmux) is a great way to split terminal windows
  - *note:* of course, when you're done, end each process by pressing `ctrl+c`
- open vscode by running `code .`
- open your web browser
  - see the xiome website at http://localhost:8080/
  - see the mocksite at http://localhost:8080/mocksite/
  - disable your browser's caching
    - open chrome's developer tools
    - in the network tab, enable "disable cache" mode
    - or find the equivalent in your plebeian browser
- now you are ready to code
  - whenever you save a source file, the watch routine will automatically rebuild it, then you can refresh the browser to see your changes
  - you can press vscode hotkey `ctrl+shift+b` to run the typescript build, which allows vscode to nicely highlight typescript errors for you to address

&nbsp; **xiome's mock mode and the mocksite**
- xiome super-cool mock mode
  - the watch routine builds xiome into "mock" mode
  - in mock mode, no connections are made to any real apis, database, etc
  - 100% of the code, even the backend code, is running locally within the browser
  - this allows you to test xiome's features without the muss or fuss of externalities like running servers or databases
  - this mock mode also provides a unified debugging experience within the browser (even for backend business logic)
  - the "database" state is actually saved in `localStorage`
  - in the browser dev console, you can wipe clean all the state by calling `localStorage.clear()` then refreshing the page
- you can work on the xiome.io website itself at http://localhost:8080/
- you can develop new features in the "mocksite" at http://localhost:8080/mocksite/
  - the mocksite is a crappy-looking site that mimics a website that had installed xiome
  - it's a "proving grounds" for developing new features
  - you can login with a special email address `creative@xiome.io`, which is a special fake account on the mocksite that has administrator privileges

&nbsp; **the more you know**
- this is an open source project, all contributions are under the mit license

</details>

<br/>

## 🦅 xiome's codebase from a bird's eye view

<details><summary>(click to show details)</summary>

everything about xiome is fully contained in this single git repository.  
let's take a stroll through the codebase.
- `.github/`  
  this is where the github actions live.  
  they do continuous integration and deployments.  
- `.vscode/`  
  this is where the settings for the vscode editor live.  
  it makes sure you'll indent with tabs, as jesus intended.  
- `helm/`  
  this is where the scary kubernetes code lives.  
  it orchestrates the node servers in the cloud.  
- `s/`  
  this is where all the typescript source code lives.  
  there is where the fun development happens.  
  - `s/assembly/`  
    this is where all the pieces of xiome are assembled, much like legos, into a working backend and frontend.  
    this place is honestly frightening.  
  - `s/common/`  
    this is where we should put xiome code that many features can share.  
  - `s/features/`  
    this is where the feature development happens.  
    each feature contains all its backend and frontend code.  
    you should feel cozy here.  
  - `s/framework/`  
    this is where xiome defines fundamental standards for the whole system.  
    important base classes, like component, which is based on lit-element.  
  - `s/toolbox/`  
    this is a big collection of assorted utilities.  
    code here may be useful outside of xiome.  
    some of these tools are candidates to become independent libraries one day.  
    some of these are experimental.  
  - `s/types/`  
    these are where some common system-wide types should go.  
- `scripts/`  
  just some handy shell scripts.  
  sometimes i use `scripts/randomid` generate new ids.  
- `web/`  
  this is where the https://xiome.io/ website lives.  
  and also the mocksite we use during development.  
- `x/`  
  these are just build artifacts.  
  never write code here — it's deleted and regenerated every build.  

</details>

<br/>

## 🦵 the anatomy of a feature

<details><summary>(click to show details)</summary>

xiome's fun code is organized conceptually into features.  
these features are probably what you want to work on.  
so here's what's in a feature directory:

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
  models are objects that have properties and functions for the components to use.  
  often, models are locally caching information loaded from the backend.  
  there's only one instance of each model on the whole page.  
  models coordinate everything for components on a page-wide level.  
  generally, we want components to be dumb renderers, leaving the smart logic up to the models.  

### backend
- `feature/api/`  
  here's where you'll find the api services.  
  a service is part of the api. it exposes a bunch of functions.  
  each service has its own auth policy.  
  an auth policy is like a bouncer at a nightclub — it decides which users get access to the service's exposed functions.  
  here in the api directory, you'll find other backendy-things, like database table definitions and whatnot.  

### testing
- `feature/coolfeature.test.ts`  
  this is where we practice test driven development.  
  we're seriously trying to get better at this.  
- `feature/testing/`  
  this is where we keep utilities and mocks and stuff for the tests to use.  

<br/>

## ⚔️ how to survive within the xiome onion

if you think about xiome like an onion, you'll notice some distinct layers.  
each layer has its own little landscape of concepts and tools you'll need to learn, if you want to get anything done.  

### components — *html/css/js that users interact with*
- learn about modern web development
  - learn about web components
  - learn about the shadow dom
  - learn about css custom properties, and css parts
  - learn https://lit.dev/
- learn about xiome's `ops`
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

### models — *frontend brains behind the components*
- learn about services
  - we provide models with api service objects, which contain async api functions
  - you just call the functions. those are api calls
- learn about `snapstate`
  - snapstate is the state management library for xiome
  - a model should return `readable` state, but *not* the `writable` state
  - a model must return the relevant snapstate `subscribe` or `track` function
  - learn more about `snapstate` further below in the readme
- learn about `ops`
  - they're for loading spinners
  - they're everywhere because lots of things load
  - read more aboutn `ops` further below in the readme

### api services — *backend that talks with the database*
- learn `renraku` and how xiome uses it
  - xiome's api is built with https://github.com/chase-moskal/renraku
  - every async function in `expose` takes a first argument called `auth`
  - `auth` is where you'll find info about the current user
  - `auth` is where you'll find the database tables you need to use
  - `auth` is returned by the `policy` that each service has
- learn `dbmage` to interact with the database
  - never forget that every id must be a `dbmage.Id` instance in the database
  - dbmage is what powers the magical serverless mock mode for development
  - learn more about `dbmage` further down
- learn `darkvalley` for validation
  - it's just some functions for validating user inputs
  - learn more about `darkvalley` further down

</details>

<br/>

## ⚙️ systems to learn

<br/>

### **ops** — *loading spinners everywhere*

<details><summary>(click to show details)</summary>

- "ops" is xiome's system for displaying loading spinners for asynchronous operations
- it's designed to be compatbile with state management libraries — this is why ops are simple object literals, instead of fancy class instances with methods and stuff
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

</details>

<br/>

### **snapstate** — *tiny robust state management*

<details><summary>(click to show details)</summary>

- 🔮 snapstate is how xiome manages frontend application state
- see snapstate's readme on github: https://github.com/chase-moskal/snapstate

</details>

<br/>

### **dbmage** — *agnostic mock-ready database adapter*

<details><summary>(click to show details)</summary>

- 🧙‍♂️ dbmage is how xiome systems interact with the database.
- see dbmage's readme on github: https://github.com/chase-moskal/dbmage

</details>

<br/>

### **darkvalley** — *minimalistic validation*

<details><summary>(click to show details)</summary>

- darkvalley is xiome's validation system for user inputs
- it's used on the frontend and backend alike, for validating forms, and apis
- a darkvalley validator is a function that returns a "problems" array of strings
- the problem strings are meant to be user-readable
- darkvalley provides many functions that *return* validator functions
- let's make an example validator for a string
  ```ts
  import {validator, string, minLength, maxLength, notWhitespace}
    from "./s/toolbox/darkvalley.js"

  const validateCoolString = validator<string>(
     //                       ^
     //           create a standard validator,
     //           providing a typescript generic
     //           for the type that it will accept

    string(), // <--------- require input to be a string
    minLength(1), // <----- require input length is at least 1
    maxLength(10), // <---- require input length at most 10
    notWhitespace(), // <-- require input isn't all whitespace
  )

  const problems1 = validateCoolString("hello!")
   //= []

  const problems2 = validateCoolString("")
   //= ["too small"]
  
  const problems3 = validateCoolString("abcdefghijk")
   //= ["too big"]

  const problems4 = validateCoolString("   ")
   //= ["can't be all whitespace"]
  ```
- if the resulting problems array is empty (problems.length === 0), then the input has passed validation
- darkvalley has functions to prepare many kinds of validators
- for example, let's validate an array of numbers between 0 and 100
  ```ts
  import {validator, array, each, number, min, max}
    from "./s/toolbox/darkvalley.js"

  const validateNumberArray = validator<number[]>(
    array(),
    each(
      number(),
      min(0),
      max(100),
    ),
  )

  const problems1 = validate([1, 2, 99])
   //= []

  const problems2 = validate([1, 2, "99"])
   //= ["(3) must be a number"]
  
  const problems3 = validate([1, 2, -99])
   //= ["(3) too small"]

  const problems4 = validate([101, 2, 99])
   //= ["(1) too big"]
  ```
- okay, now let's validate a whole object, and all its contents
  ```ts
  import {schema, validator, string, number, minLength, maxLength}
    from "./s/toolbox/darkvalley.js"

  const validateUserObject = schema<{
        nickname: string
        karma: number
      }>(
    nickname: validator(string(), minLength(1), maxLength(10)),
    karma: validator(number()),
  )

  const problems1 = validateUserProblems({nickname: "chase", karma: 99})
   //= []
  ```
- darkvalley has a bunch of handy validator preppers
  ```ts
  import {validator, string, regex, url, origin, email}
    from "./s/toolbox/darkvalley.js"

  const validateLetters = validator<string>(
    string(),
    regex(/[a-zA-Z]+/i, "must be letters"),
  )
  const validateUrl    = validator<string>(string(), url())
  const validateOrigin = validator<string>(string(), origin())
  const validateEmail  = validator<string>(string(), email())
  ```
- `multi` allows multiple problems to be returned at once,  
  whereas `validator` stops and returns the first problem encountered.
  ```ts
  import {validator, multi, string, minLength, notWhitespace}
    from "./s/toolbox/darkvalley.js"

  const validateName = validator<string>(
    string(),
    multi( // <-- multi allows multiple problems to be returned at once
      minLength(3),
      notWhitespace(),
    ),
  )

  const problems1 = validateName(" ")
   //= ["too small", "can't be all whitespace"]
  ```
- `branch` is like an 'or' operator, ignoring problems in one branch if another passes
  ```ts
  import {validator, branch, string, url, https, localhost}
    from "./s/toolbox/darkvalley.js"

  const validateHttpsOrLocalhost = validator<string>(
    string(),
    url(),
    branch(
      https(),
      localhost(),
    ),
  )

  const problems1 = validateHttpsOrLocalhost("http://chasemoskal.com/")
   //= [
   //=   "must be secure, starting with 'https'",
   //=   "or, must be a localhost address"
   //= ]
  ```

</details>

<br/>

## 💰 bitcoin bounties

<details><summary>(click to show details)</summary>

we like to give little bitcoin rewards to show appreciation for good contributions.

how to participate:
- find a task on the issues page with a bounty
- post a comment and ask to be assigned
- do the work, make a good pull request
- post your public bitcoin deposit address into the issue

if we merge the work to master, you may be eligible to receive a reward.

but remember, there are no guarantees: bounties are fun rewards, not contracts. the rules became too complicated, so now all bounties and rewards are arbitrated by chase moskal based on subjective factors and personal honor code.

</details>
