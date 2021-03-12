
# regrettable technical debt

## admin management is bound to email addresses
- problems
  - admin system can't handle accounts that were initialized without email, eg, google
- solutions?
  - refactor the system to only work by userId by integrating user search component

## testing is falling behind
- problems
  - testing system is complicated and vestigial code is laying around
- solutions?
  - clean up the working tests
  - integrate and delete the bunk old tests

## project source code is getting disorganized and confusing
- problems
  - the growing project's source is getting unwieldy and inconsistent
    - assembly area is gross
    - feature directory structure is disorganized
    - generally speaking, too many sibling-level-imports, needs to be more top-down
    - `auth` should probably be renamed to `core`
- solutions?
  - just clean it up

## table namespacing is confusing
- problems
  - most tables are namespaced by appId, by the auth policies, before they are provided to the topics.  
    this is good, because it enforces app isolation, and removes the concern from the topic business logic.  
    however, not all tables are namespaced, because some topics must do work on multiple apps.
  - unfortunately, when you're holding a reference to a group of tables, it's impossible to know whether that table has already been namespaced or not.  
    this is straight up confusing, and keeps causing namespacing bugs (discovering that a table wasn't namespaced that should be, and vice-versa)
- solutions?
  1. expose the `_appId` column, instead of hiding it.  
    then the namespacer could use typescript `Omit` to zoink-out `_appId`, and intellisense would provide useful hints.
  2. naming conventions.  
    i kinda like `tablesForPlatform` and `tablesForApp` for namespaced tables to indicate where they are namespaced. i think unnamespaced tables should just be `tables`

## mobx is fat
- problems
  - mobx has become obese, it's the majority of our bundle
- solutions
  - replace it with a lean <5KB proxy observable replacement
