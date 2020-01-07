# Setup

- [How to generate an auth token](#how-to-generate-an-auth-token)
- [Authenticate with a CLI arg](#authenticate-with-a-CLI-arg)
- [Authenticate with a `.env`](#authenticate-with-a-env)

## How to generate an auth token

- Log in to GitLab.
- In the upper-right corner, click your avatar and select Settings.
- On the User Settings menu, select Access Tokens.
- Choose a name and optional expiry date for the token.
- Choose the scope as api
- Click the Create personal access token button.
- Save the personal access token somewhere safe. Once you leave or refresh the page, you won’t be able to access it again

## Authenticate with a CLI arg

- Authentication can be accomplished  using the optional param `auth` as below:
`isren https://gitlab.com/user/project --auth da8asj40sdj41`

## Authenticate with a `.env`

- Authentication can be achieved using the `.env` file. Copy the `.env.example` file and modify the AUTH value to your 
personal access token. Place the `.env` under the root folder of your project.