# Time tracker
tenant is like the highest tracker of the users for us, it can be an organization, a person, or an enterprise
## Setting up prisma in a nextjs APP
1. `npm install prisma`
2. `npx prisma init`
3. `npx prisma db pull` , NOT `prisma db pull`
4. `npx prisma db generate`

## Authentication
We'll do authentication on a different branch than the main

- `git branch auth`
- `git checkout auth`

We're going to use next Auth for authorization
1. `npm install next-auth`
2. Go to google console and setup a project
    1. We can provide `http://localhost:3000` as the website url and for callback url, `http://localhost:3000/api/auth/callback/google`, replace "google" by the provider , e.g github, twitter or some else built in oauth provider
    2. Get the client id and client secret and save it as environment variable
    3. Configure the handler in `app/api/auth/[...nextauth]/route.ts`, and can use `||` for the typescript error for clientId and clientSecret
3. Go to localhost and navigate to `api/auth/sigin`, you can see the auth prebuilt auth page, although it is just for "sigin", if you put "login" after the `api/auth`, it is not supported out of the box by NextAuth.js, so you'll not see the prebuilt page
4. Add that in `middleware.ts` to use it as a middleware

### Redirect callbacks
<!-- TODO -->

## Getting user id for the server-side
We want to insert the user id in user's jwt, when after we've created user in the serverside/database using the sigin callback
1. Need to updae session token to have user's and tenat's info in it
2. Use that to create activities