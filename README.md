<p align="center">
  <a href="https://thullo-front.netlify.app">
    <img alt="Logo Thullo" src="logo.png" width="200" />
  </a>
</p>

![Build Status Domain](https://github.com/Fredkiss3/thullo/workflows/Continous%20Integration%20For%20Domain/badge.svg?branch=develop)
![Build Status Front](https://github.com/Fredkiss3/thullo/workflows/CI%2FCD%20For%20the%20Frontend/badge.svg?branch=develop)
![Build Status Express](https://github.com/Fredkiss3/thullo/workflows/CI%2FCD%20For%20Express%20API/badge.svg?branch=develop)
![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=thullo-front)
[![Netlify Status](https://api.netlify.com/api/v1/badges/0640fc2d-a1e7-4431-a079-d7fb8788dcac/deploy-status)](https://thullo-by-fredkiss.netlify.app/)

# Thullo : A Trello Clone

This project was made for a challenge Thullo by [devChallenges.io](https://devchallenges.io/challenges/wP0LbGgEeKhpFHUpPpDh).


# Requirements

- Node >= v16.6.2
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose](https://docs.docker.com/compose/install/)  
- [PNPM](https://pnpm.io/installation) >= v6.22.2
- [MongoDB](https://docs.mongodb.com/manual/installation/) >= v5.0.4

## 🚀 How to work on the project ?

1. First you have to clone the repository
    
    ```bash
    git clone https://github.com/Fredkiss3/thullo.git
    ```    

2. **Then, Install the dependencies :**

    ```bash
    pnpm install
    ```    

3. **Launch the docker-compose server to start a mongodb server :**

    ```bash
    docker-compose up -d
    ```
4. Rename the `.env.example` located in `packages/express/src/config` to `.env.local` And change the file to your needs, 
   by default you have :

    ```dotenv
   # server
   PORT = 3031

   # mongo database
   MONGO_URI='mongodb://root:password@localhost:27017/thullo?authSource=admin'
   ```

5. **And launch the project :**

    ```bash
    pnpm run dev --parallel
    ```

    The express API will be available at [http://localhost:3031](http://localhost:3031) and the frontend client at [http://localhost:3000](http://localhost:3000).

6. **Open the source code and start rocking ! 😎**


## 🧐 Project structure

A quick look at the top-level files and directories you will see in this project.

    .
    ├── .github/
    │    └── workflows
    │        ├── express.yml
    │        ├── domain.yml
    │        └── front.yml
    ├── packages/
    │   ├── domain
    │   ├── express
    │   ├── adapters
    │   └── front
    ├── .prettierrc
    ├── jest.config.json
    ├── lerna.json
    ├── pnpm-lock.yaml
    └── tsconfig.json

1. **`.github/`**: this folder contains the GitHub Actions workflow configuration for Continuous Integration/Continuous Deployment.
   Given that this project is a [monorepo](https://www.wikiwand.com/en/Monorepo), there is muliples workflows for the different packages, with each one targeting a specific environment :
   
    1. **`domain.yml`** : this workflow is used to test the domain.
   
    2. **`express.yml`** : this workflow is used to deploy the express app to [heroku](https://heroku.com/).
   
    3. **`front.yml`** : this workflow is used to test and deploy the frontend app to [netlify](https://netlify.com/).
   
2. **`packages/`**: this folder contains the monorepo packages, each package is a sub-folder :

    1. **`domain`** : this package contains the domain logic used by the express App
   
    2. **`express`** : this package contains the express API.
   
    3. **`adapters`** : this package contains the implementations of all the interfaces in the domain that the express API will use.
   
    4. **`front`** : this package contains the frontend app written in React.
    
3. **`.prettierrc`**: this file contains the configuration for prettier to enable autoformatting.

4. **`jest.config.json`**: this file contains the configuration for Jest, that are used by the all the underlying packages

5. **`lerna.json`**: this file contains the configuration for the monorepo.

6. **`pnpm-lock.yaml`**: this file contains the dependencies lock for the monorepo.

7. **`tsconfig.json`**: this file contains the configuration for typescript, that are used by the all the underlying packages
