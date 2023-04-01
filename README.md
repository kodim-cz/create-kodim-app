# create-kodim-app

Quickly create a scaffolding for various types of JavaScript projects

To create and run a fresh new React app:

```bash
npm init kodim-app my-app
cd my-app
npm start
```

If you want to have a vanilla JavaScript application without React use:

```bash
npm init kodim-app my-app vanilla
```
If you want to create an application in current directory, ude `.` as application name:

```bash
npm init kodim-app .
npm init kodim-app . vanilla
npm init kodim-app . html-css
npm init kodim-app . html-js
npm init kodim-app . html-css-js
```

Use `-e` or `--vscode` parameter to open created project in VS Code:

```bash
npm init kodim-app -e my-app
npm init kodim-app --vscode my-app vanilla
```

## Show all parameters

```bash
npm init kodim-app -- --help
```