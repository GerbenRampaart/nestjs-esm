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
- [x] Have the project be esm (nestjs and prisma both don't support esm as of 2024-03-18)
  - [x] nestjs now treated as esm.

![dependencies for bun build to work](<README/2024-03-20 09.50.58.png>)

  - [ ] --minify flag of bun build does not work, the app starts and functions, but the logging writes strange chars to stdout.

![weird logging](<README/2024-03-20 09.48.53.png>)

- [x] Try to package with bun build. Single file? We'll probably need esm just for the proper bundling experience.
  - [x] It now single files, without minify because that does not seem to fully work without side effects. See above. Though without minify it is about 6.6MB (everything included, no node_modules needed) for a vanilla nestjs 'Hello World' app. The original node_modules is 180MB. So that's pretty good.
- [x] All testing is 'bun test'. (test both integration and unit tests).
- [x] Use 'deno fmt' and 'deno lint' instead of eslint and prettier. Later, when bun has these things we'll switch over to the bun variants. (But we're watching deno if it ever becomes a drop-in replacement for node and if it can do all the work)
- [x] Strip out all unnecessary files. No lint, no prettier, do all with standard tooling like deno or bun. (Do we need nest-cli.json?) Do we need a tsconfig.json or invoke the bun cli with the proper flags and use the typescript settings from bun?
- [x] Containerize (https://bun.sh/guides/ecosystem/docker). Completed the simplest containerization I can come up with. Based on the oven/bun docker image. Just copied the app.js created with bun build and the package.json

- [ ] Serverless (api gateway proxy? or multiple lambdas?)
- [ ] Convert to mono repo. (apps/api and apps/web)
- [ ] The client will be react/vite/typescript (latest). Also bundle with bun?
- [ ] Add a library (lib) in the same repo to abstract some services away like:
  - [ ] the logger;
  - [ ] a package json service (using glob to search for base libraries) and package.json files;
  - [ ] maybe an axios service based on nestjs HttpModule with some interceptors I like. (like elapsed time and x-correlation-id and x-request-id)
- [ ] Generate docs for the nestjs services lib using compodoc to /docs/[lib-name]
- [ ] Generate docs and database diagram png for prisma to /docs/database