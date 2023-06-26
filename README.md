# Web Security

## Client .env
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_AUTH0_DOMAIN=neu.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=ohcQaQqxY4EFypq2Wyzjtbx0a1KVIqxl
REACT_APP_AUTH0_AUDIENCE=https://api.todos
REACT_APP_JWT_NAMESPACE=https://api.todos
```

## API .env
```
DATABASE_URL="mysql://root:123456@localhost:3306/tododb"
AUTH0_JWK_URI="https://neu.us.auth0.com/.well-known/jwks.json"
AUTH0_AUDIENCE="https://api.todos"
AUTH0_ISSUER="https://neu.us.auth0.com/"
```

1. Use following command to create database using prisma:
npx prisma init
npx prisma migrate dev --name init
npm install @prisma/client
npx prisma studio
npx prisma db push

Commands to manage mysql:
mysql -u root -p
show databases;
DROP DATABASE todo;
DROP DATABASE `to-do`;

2. Use this command to run api:
npx nodemon index.js

3. Use this command to run client:
npm run start

4. google cloud
The steps to install it using the Google Cloud SDK installer are:

Enter the following at a command prompt:
curl https://sdk.cloud.google.com | bash

(remain .zshrc path as default)
Restart your shell:
exec -l $SHELL

Run gcloud init to initialize the gcloud environment:
gcloud init
gcloud app create
gcloud app deploy

gcloud app browse ?

5. planet scale:
https://planetscale.com/docs/tutorials/planetscale-quick-start-guide
macOS
pscale is available via a Homebrew Tap, and as downloadable binary from the releases page:

brew install planetscale/tap/pscale
Optional: pscale requires the MySQL Client for certain commands. You can install it by running:

brew install mysql-client

To upgrade to the latest version:
brew upgrade pscale

6. vercel:
npm install vercel
npm --version

To redeloy client:
vercel --prod

