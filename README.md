# chpl-website

[![Build Status](http://54.213.57.151:9090/job/andlar_chpl-website/badge/icon)](http://54.213.57.151:9090/job/andlar_chpl-website)
[![Test Coverage](https://codeclimate.com/github/andlar/chpl-website/badges/coverage.svg)](https://codeclimate.com/github/andlar/chpl-website/coverage)
[![Code Climate](https://codeclimate.com/github/andlar/chpl-website/badges/gpa.svg)](https://codeclimate.com/github/andlar/chpl-website)

The web UI for chpl

## Prerequisites

Git, Node.js, Yarn, and Webpack are required to install and test this project.

 * Git: [git][git]
 * Node.js: [nodejs][nodejs]
 * Yarn: [yarn][yarn]
 * Webpack: [webpack][webpack]

## Getting Started

Clone the repository using [git][git]:

### Install Node.js

See installation instructions here: [nodejs][nodejs]

### Install yarn and webpack

Yarn: [yarn][yarn]

### Install dependencies

```
yarn install
```

### Yarn scripts

* `yarn build`: Build deployable artifacts
* `yarn html-lint`: Run HTML Linter with rules that should all pass
* `yarn html-lint:verbose`: Run HTML Linter with rules that don't play well with AngularJS, so some errors are expected, but this can find some errors that need to be fixed
* `yarn start`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading
* `yarn start:dev`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but connecting to the DEV environment for data
* `yarn start:prod`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but using the production settings for js minification / packaging / etc.
* `yarn profile`: Generate a webpack statistics output file
* `yarn test`: Run the Karma-based unit tests once (tests based on the AngularJS components)
* `yarn test:auto`: Run the Karma-based unit tests continuously (tests based on the AngularJS components), re-running the tests on any file change
* `yarn test:ahrq`: Run Karma-based tests once in a fashion suitable for the deployment environment (tests based on the AngularJS components)
* `yarn test:ci`: Run Karma-based tests once in a fashion suitable for a Continuous Integration environment (tests based on the AngularJS components)
* `yarn test:react`: Run Jest-based unit tests once (tests based on the React components)
* `lint`: Run ESLint against all JavaScript files in the project
* `lint:fix`: Run ESLint against all JavaScript files in the project and fix any errors that ESLint can fix automatically. Especially useful when run as `yarn lint:fix src/app/path/to/file.js[x]` to automatically apply fixes against a single file
* `yarn e2e`: Run the end to end integration tests, as well as e2e linting
* `yarn e2e:lint`: Run code and syntax rules
* `yarn e2e:clean`: Clear out old E2E artifacts

#### Yarn environment parameters

Usable on `yarn build` and `yarn start`, these parameters control configuration of some properties

* `--env.NODE_ENV=production` or `--env.NODE_ENV=development` to indicate whether to build for development or production environments. Defaults to `development` if not provided
* `--env.style` to create a a style guide page at url/style.html. Defaults to "don't create" if not provided

#### Linting

On most Yarn commands the CSS Linter, JS Linter and HTML Linters will run. Webpack may fail to compile if any of the linters report issues, depending on the severity of the issue.

#### E2E testing

By default, E2E tests will be executed against http://localhost:3000/. To run against different environments, pass ENV variable with 'dev', 'qa' ,'stage' options. For example: `ENV='Environment you want to run on' yarn e2e` would set all tests to run against environment passed in.

If a single spec file should be tested, instead of all of them, the command `ENV='Environment you want to run on' yarn e2e --spec path/to/file.spec.js` will exercise only that spec file

To change the loglevel, test could be run as `ENV='Environment you want to run on' yarn e2e --l info`

To run a suite of tests, execute `ENV='Environment you want to run on' yarn e2e --suite suite-name`. For example, `ENV='Environment you want to run on' yarn e2e --suite components` will execute only the tests on the components. See `wdio.conf.js` for a list of the suites

When debugging, taking screenshots can be useful. The command `browser.saveScreenshot('path/to/file.png')` will save a screenshot to a location relative to the project root

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/en/
[webpack]: https://webpack.js.org/

#### Automation credetials set up

Copy `e2e/config/credentialsEXAMPLE.js` to the file `e2e/config/credentials.js` and set the passwords for the users in the file to be valid users

#### Automation environment Urls set up

Copy `e2e/config/urlsEXAMPLE.js` to the file `e2e/config/urls.js` and set the urls for each environments in the file
