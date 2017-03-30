# CONTRIBUTING guidelines

## Tooling

* Node v6+
* [yarn package manager](https://yarnpkg.com) but you can still use NPM 3+
* [vue.js](https://vuejs.org/)

## Hacking

1. get code `git clone git@github.com:realreality/reality-plugin.git`
1. inside run `yarn` to install dependencies
1. `yarn start` starts a dev servers and creates a `./build` directory in `<project-root>` which can be loaded as unpacked extension in Chrome (type to url bar `chrome://extensions`)
1. `<your-code-here>`
1. to get the production version run `yarn build`
1. check the code style with `yarn lint` / `npm run lint`
1. when your changes are considered to be pushed to repo use `git add <files-to-be-added>`
1. we use conventional changelog messages so you can use `yarn commit`
1. `git push`


## Compiled extension structure

```bash
build
├── _locales
├── background.bundle.js
├── contentscript.bundle.js # main script containing all logic
├── css
├── fonts
├── images
└── manifest.json
```

## Environment variables

  This project supports [dotenv](https://www.npmjs.com/package/dotenv) variables, by creating a `.env` file, you can put your secrets there. All `env` variables are then available in `./config/env.js` where you can export them and use in webpack `DefinePlugin` in `webpack.conf.js`
 
  * `GMAPS_API_KEY` - user your own please
  * `IPR_REST_API` - endpoint for real-reality

Quick and dirty [source code of IPR Data Rest API Server](https://github.com/bedla/praguehacks-realreality).

Main script is in **./src/js/contentscript.js**

IPR API is backed by [IPR Data Rest API Server](https://github.com/realreality/reality-backend).



## Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the AngularJS change log**.

The commit message formatting can be added using a typical git workflow or through the use of a CLI
wizard ([Commitizen](https://github.com/commitizen/cz-cli)). To use the wizard, run `yarn run commit`
in your terminal after staging your changes in git.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change.

You can use `*` when the change affects more than a single scope.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
[reference GitHub issues that this commit closes](https://help.github.com/articles/closing-issues-via-commit-messages/).

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.
