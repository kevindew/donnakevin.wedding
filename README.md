# donnakevin.wedding

[![example workflow](https://github.com/kevindew/donnakevin.wedding/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kevindew/donnakevin.wedding/actions?query=branch%3Amain)

Wedding website for the marriage of
[Donna Carter](https://github.com/donnacarter) and
[Kevin Dew](https://github.com/kevindew) which took place on the
29th October 2021 (after a couple of pandemic setbacks).

The website is now in an archive state with the dynamic functionality (provided
by AWS Lambda functions) removed - this was because they were quite the target
of spam bots. At some point we'll free the domain up for future Donna's and
Kevin's to use for a marriage and move to hosting on GitHub pages.

## Running locally

Before running you'll need to have [nvm](https://github.com/nvm-sh/nvm)
installed or [Node.js](https://nodejs.org) of at least the version in
[.nvmrc](./.nvmrc).

1. Install dependencies with `npm install`
2. Run app with `npm run dev`
3. View site at http://localhost:8080

You can build the production version for deployment with `npm run build` which
will be created in the `./dist` directory.

## License

[MIT](./LICENSE)
