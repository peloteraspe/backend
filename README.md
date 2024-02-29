<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Peloteras Backend

## Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env.development```
4. Llenar las variables de entorno

5. Ejecutar la aplicacion en dev: 
```
yarn start:dev
```

## Conventional commits para JIRA y Github control

1. Select the type of change that you're committing: feat: A new feature? (For more information see the Commitizen type changes section below)
2. What is the scope of this change (e.g. component or filename): (press enter to skip)
3. Write a short, imperative tense description of the change (max 82 chars):
4. Provide a longer description of the change: (press enter to skip):
5. Are there any breaking changes? yes/no
6. Does this change affect any open issues? yes/no

**Commitizen type changes**

| Type     |                          Description                          |
|:-------- |:-------------------------------------------------------------:|
| feat     |                         A new feature                         |
| fix      |                           A bug fix                           |
| docs     |                  Documentation only changes                   |
| style    |      Changes that do not affect the meaning of the code       |
| refactor |   A code change that neither fixes a bug nor adds a feature   |
| perf     |            A code change that improves performance            |
| test     |       Adding missing tests or correcting existing tests       |
| build    | Changes that affect the build system or external dependencies |
| ci       |       Changes to our CI configuration files and scripts       |
| chore    |       Other changes that don't modify src or test files       |
| revert   |                   Reverts a previous commit                   |

## Execute conventional commits

The way to create and commit branches is the next:

1. Create the branch indicating the type from the table above, and after the ID of the task from JIRA
  ```bash
  git checkout -b <type>/<card-id>
  ```

2. Add your changes
  ```bash
  git add .
  ```

3. Do conventional commit
  ```bash
  yarn commit
  ```

4. Upload your changes
  ```bash
  git push -u origin <type>/<card-id>
  ```

<h2 align="center">
  <img src="https://raw.githubusercontent.com/digitalroute/cz-conventional-changelog-for-jira/master/images/demo.gif" width="750"></a>
</h2>

## Stack usado
* Nest
