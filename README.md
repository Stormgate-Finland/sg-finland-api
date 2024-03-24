# REST API for Stormgate.fi

The main purpose of this API is to provide external data to stormgate.fi.

Currently the API is providing

- Stormgate ladder data through Stormgate World's API
- live stream data through Twitch and YouTube APIs

This project was bootstrapped with Cloudflare Worker example using OpenAPI.

# Prerequisites

- Node >=20
- Possibly CloudFlare.com account

This project uses CloudFlare Workers. Local development without deployment is possible.

To get started see: https://developers.cloudflare.com/workers/get-started/guide/

# Setup

Create `.dev.vars` file which is for local secrets with:

```
cp .dev.vars.example .dev.vars
```

And fill in the variables.

Create `wrangler.toml` file with:

```
cp wrangler.toml.example wrangler.toml
```

Create D1 database with:

```
npx wrangler d1 create sg-finland-d1
```

And fill in the provided `database_id` to `wrangler.toml`.

Create KV store with:

```
wrangler kv:namespace create sg-finland-kv
```

And fill in the provided KV `id` to `wrangler.toml`.

# Develop locally

```
npm run dev
```

# Deploy to CloudFlare.com

```
npm run deploy
```

Remmebr to add secrets to CloudFare with:

```
wrangler secret put <ENV_NAME>
```

# DB Migrations

Refer to https://developers.cloudflare.com/d1/reference/migrations/

Run local migrations with:

```
npm run migrations:apply
```

Run remote migrations with:

```
npm run migrations:apply -- --remote
```

# Eternal API docs

- Stormgate World API docs: https://api.stormgateworld.com/rapidoc
- Twitch.tv docs: https://dev.twitch.tv/docs/api/reference/
- YouTube Data API docs: https://developers.google.com/youtube/v3/docs

# Template info

## Cloudflare Workers OpenAPI 3.1

This is a Cloudflare Worker with OpenAPI 3.1 using [itty-router-openapi](https://github.com/cloudflare/itty-router-openapi).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

### Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

### Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [itty-router-openapi official documentation](https://cloudflare.github.io/itty-router-openapi/).

### Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:9000/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.
