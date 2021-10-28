
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

### **ops** — *loading spinners everywhere*

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

<br/>

### **snapstate** — *tiny state management*

- snapstate is an experimental little state management library. it is the successor to `autowatcher` and `happystate` which were previous incarnations in snapstate's lineage.
- the concept of snapstate, is that we create a `readable` and `writable` version of a state object.
- this allow us to write functions that have write access to the state via `writable`, but then we only expose the `readable` to the outside
- example
  ```ts
  function makeCounterModel() {

    const state = snapstate({
      count: 0,
    })

    function increment() {
      state.writable.count += 1
    }

    return {
      subscribe: state.subscribe,
      state: state.readable,
      increment,
    }
  }

  const counterModel = makeCounterModel()
  console.log(counterModel.state.count) // 0

  counterModel.increment()
  console.log(counterModel.state.count) // 1

  counterModel.subscribe(() => console.log(counterModel.state.count))
  counterModel.increment()
  //> 2

  counterModel.state.count = 4 // ERROR readonly
  ```
  - we return the readable state, which provides read-only access to the state object.
  - we also return action functions that have exclusive access to the writable state.
  - we also return a subscribe function, to subscribe to state changes
- snapstate changes are debounced
  ```ts
  const counterModel = makeCounterModel()
  counterModel.subscribe(() => console.log(counterModel.state.count))
  counterModel.increment()
  counterModel.increment()
  counterModel.increment()
  //> 3
  ```
  - this is very important to understand. this means changes don't instantly trigger the subscribed listeners
  - instead, many changes to the state can be queued up in a single tick, then subscribe is called afterwards
- snapstate returns a `wait` function
  ```ts
  async function example() {
    const counterModel = makeCounterModel()
    let sideEffect = false

    counterModel.subscribe(() => {
      sideEffect = true
    })

    counterModel.increment()

    console.log(sideEffect) // false
    await counterModel.wait()
    console.log(sideEffect) // true
  }
  ```
  - this allows you to wait for the debounced subscribed effects to fire
- snapstate returns a `track` function
  ```ts
  const counterModel = makeCounterModel()
  counterModel.track(() => console.log(counterModel.state.count))
  //> 0
  counterModel.increment()
  //> 1
  ```
  - track is similar to subscribe, but works like mobx autorun
    - track will immediately execute the listener function, and internally record which state properties are read
    - then, whenever those specific state properties are written to, it will fire the affected listener function
    - this can be efficient, because your track won't be triggered for unrelated changes to other state properties
- both `subscribe` and `track` return stop functions to unsubscribe
  ```ts
  const counterModel = makeCounterModel()

  const unsubscribe = counterModel.subscribe(
    () => console.log(counterModel.state.count)
  )

  const untrack = counterModel.track(
    () => console.log(counterModel.state.count)
  )
  //> 0

  counterModel.increment()
  //> 1
  //> 1

  unsubscribe()
  untrack()
  counterModel.increment()
  //> (sweet silence)
  ```

<br/>

### **dbby** — *agnostic mock-ready database adapter*

- dbby is xiome's database adapter.
- we can write drivers for mongodb, postgres, or any kind of database.
- most importantly, dbby has drivers written for
  - in memory
  - localStorage
  - json file on disk
- this allows us to test the entire backend and provide a 'mock' database instead of a real one
- this is what powers xiome's powerful mock modes, during development, and testing
- dbby basically implements classic `crud` functionality
- let's assume the xiome system has passed you a dbby table for your work, like this
  ```ts
  import {find, findAll, and, or} from "./s/toolbox/dbby/dbby-helpers.js"
  async function doSomeDatabaseWork(
        table: DbbyTable<{alpha: number, bravo: string}>
      ) {

    // ...and you'll do some database work here...
  }
  ```
- creating rows in the table
  ```ts
  await table.create({alpha: 1, bravo: "canada"})
  await table.create(
    {alpha: 2, bravo: "america"},
    {alpha: 3, bravo: "mexico"},
  )
  ```
- reading rows from the table
  ```ts
  // read all the data in the table, unconditionally
  const rows1 = await table.read({conditions: false})

  // add pagination details to any read operation
  const rows1 = await table.read({
    conditions: false,
    limit: 100,
    offset: 0,
    order: {alpha: "descend", bravo: "ascend"},
  })

  // simple query, find rows with matching data
  const rows2 = await table.read(find({alpha: 2}))

  // same exact query, but without the `find` helper
  const rows3 = await table.read({
    conditions: and({equal: {alpha: 2}})
  })

  // many different conditions are possible
  const rows4 = await table.read({conditions: and({greater: {alpha: 2}})})
  const rows5 = await table.read({conditions: and({notGreater: {alpha: 2}})})
  const rows6 = await table.read({conditions: and({search: {bravo: /nad/i}})})

  // use 'and' when multiple conditions must be met
  const rows7 = await table.read({
    conditions: and({greater: {alpha: 2}}, {equal: {bravo: "mexico"}})
  })

  // use 'or' when only one condition must be met
  const rows8 = await table.read({
    conditions: or({greater: {alpha: 2}}, {equal: {bravo: "canada"}})
  })

  // get wild, chain lots of and/or's together
  const rows9 = await table.read({
    conditions: and(
      or({less: {alpha: 2}}, {equal: {bravo: "mexico"}}),
      or({notEqual: {alpha: 5}}, {search: {bravo: /nad/i}}),
    )
  })

  // helper to find many records (just makes 'or-equal' conditions)
  await table.read(findAll([1, 2, 3], alpha => ({alpha})))
  ```
- update rows in the table
  ```ts
  // update row, or insert whole new row if it's missing
  await table.update({
    conditions: and({equal: {alpha: 1}}),
    upsert: {alpha: 1, bravo: "netherlands"},
  })

  // exact same upsert, but using the 'find' helper
  await table.update({
    ...find({alpha: 1}),
    upsert: {alpha: 1, bravo: "netherlands"}, // must be whole row
  })

  // wholly replace found rows
  await table.update({
    ...find({alpha: 1}),
    whole: {alpha: 1, bravo: "spain"}, // must be whole row
  })

  // write partial data to found rows
  await table.update({
    ...find({alpha: 1}),
    write: {bravo: "india"}, // can be partial row
  })

  // there's also this 'assert' helper method,
  // it finds a row and returns it,
  // if the row is not found, it creates a row and returns it
  const row1 = await table.assert({
    ...find({alpha: 1}),
    make: async() => ({alpha: 1, bravo: "canada"}),
  })
  ```
- delete rows in the table
  ```ts
  // delete works like read, except, it deletes stuff, and returns nothing
  await table.delete(find({alpha: 1}))
  ```
- count rows in the table
  ```ts
  // count works like read, except it returns the number of rows
  const howMany = await table.count({conditions: false})
  ```
- dbby, xiome, and `DamnId`
  - xiome has this class called `DamnId` which is stores a 256-bit unique id in *binary form*
  - every id in all of xiome is one of these ids: users, posts, absolutely everything, is identified uniquely by this kind of id
  - usually, these ids are 64-character hex strings
  - but whenever we're doing database work, we must use `DamnId` instances instead of the hex strings -- when ids go in or out of a database table, they are damnids
  - the reason for this, is that binary ids are much more efficient to query in a database
  - dbby's database drivers recognize `DamnId` instances, and will treat these ids properly in binary form
  - we should *never* find an id anywhere in the database as a string, it should always be going through dbby as a `DamnId`
  - but everywhere else in the system, we simply pass the ids around as strings, because they are easier to work with in javascript, to run `===` comparisons and such
  - so, using DamnId should look like this
    ```ts
    const myId = "2e7a6458e3c74833f0b2c28d5fbb291b87b30e456f7e38e069cc42fdce6c9c26"

    await table.create({
      myId: DamnId.fromString(myId), // <-- only damnids go into the database
      whatever: "lol",
    })

    const data = await table.one(
      find({myId: DamnId.fromString(myId)}) // <-- use damnids for querying
    )

    // convert damnid to string when passing to other systems
    return data.myId.toString()
    ```
    - to reiterate: you should only see DamnId being used right where database work is happening. elsewhere in the system, you should see the ids as regular strings.

<br/>

### **darkvalley** — *minimalistic validation*

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

<br/>

## 💰 bitcoin bounties

- **how to get involved and win a bounty**
  - find an open issue with the `bitcoin bounty` label
  - comment on the issue, and say you want to do the work. this allows us to assign you, so others know you're working on it
  - on the github issue, post your public bitcoin wallet deposit address. this makes bounty transactions transparent and publicly verifiable
  - do the work. then submit a pull request for code review. expect to be asked to make changes.
- **if we merge the work, we pay the bounty**
  - the idea is to reward good work done fast. you'll know it's good work if we merge it.
  - if your work isn't good enough to merge, we might discard it and not pay the bounty. we might even choose somebody else's work over yours, and they'll win the bounty instead.
- **bounties decay in value over time**
  - each bounty will have its own decay schedule, detailed in each issue
  - typically, starting on a certain date, a posted bounty will fall in value (decay) by a certain amount each day, until it reaches zero
  - after good work is merged, we calculate the bounty value based on the work author's last commit timing.
  - all date are expressed in pacific standard time
- **assignments are not reservations**
  - anybody could complete better work faster, and win the bounty — that's fair game
  - somebody could go on a bounty-hunting rampage, and beat everybody on their own assignments. if it's good work, done fast, they might win all the bounties.
  - in rare cases, we might deem it fair game for somebody to take over another's work, even building off their commits to continue where they left off. this might happen on high-priority work if the original author disappears partway through, or something like that. we might decide to split the bounty to reward both authors.
- **teamwork is cool**
  - it's cool if people mutually agree to work together on a single bounty. if people agree to split a bounty in some reasonable way, we'll honor that agreement.
- **cheating and trickery is frowned upon**
  - any behavior that chase moskal deems uncool, unfair, or deceptive, may disqualify you from winning any bounty or participating in the future
  - obviously, goulish behavior like stealing work, or cheating by changing commit dates/times, anything like this will disqualify you from winning a bounty or participating in the future
- **bounties are rewards, not contracts**
  - chase moskal will arbitrate any disputes, and make the final decision on whether to pay any bounty or not. you are not entitled to anything. all of these rules might change at any time.
