# Some experiment stuff

## Feedback
If you read this and have any ideas or feedback on how to do things better, please let me know.

Some goals in this repo are not properly supported by some of the tooling. Like prisma and nest with esm, or monorepos by bun, and so on. We'll update this repo in the future when the support drops to end up using all the technologies I like (see Goals).

## Prerequisits
- Pull this repo
- Make sure to have the latest bun and deno installed.

## Goals
- [x] Use (latest) bun
- [x] Use (latest) nestjs
- [ ] Use (latest) prisma working with sqlite
- [ ] Have the project be esm (nestjs and prisma both don't support esm as of 2024-03-18)
- [ ] Try to package with bun build. Single file? We'll probably need esm just for the proper bundling experience.
- [x] All testing is 'bun test'. (test both integration and unit tests).
- [x] Use 'deno fmt' and 'deno lint' instead of eslint and prettier. Later, when bun has these things we'll switch over to the bun variants. (But we're watching deno if it ever becomes a drop-in replacement for node and if it can do all the work)
- [x] Strip out all unnecessary files. No lint, no prettier, do all with standard tooling like deno or bun. (Do we need nest-cli.json?) Do we need a tsconfig.json or invoke the bun cli with the proper flags and use the typescript settings from bun?
- [ ] Containerize
- [ ] Serverless (api gateway proxy? or multiple lambdas?)
- [ ] Convert to mono repo. (packages/server and packages/client)
- [ ] This client will be react/vite/typescript (latest). Also bundle with bun?
- [ ] Add a library (lib) in the same repo to abstract some services away like:
      [ ] the logger;
      [ ] a package json service (using glob to search for base libraries) and package.json files;
      [ ] maybe an axios service based on nestjs HttpModule with some interceptors I like. (like elapsed time and x-correlation-id and x-request-id)
- [ ]