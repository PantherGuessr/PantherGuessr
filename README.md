
# PantherGuessr

PantherGuessr is the fun game where your directional skills are challenged.

## Installation

1. Run the following to make sure you are on the correct versions:

```bash
node -v # Should be v22.5.1
npm -v # Should be 10.8.3
npx -v # Should be 10.8.3
```

Note: If any of the versions do not match, please install the versions listed above. If you use `nvm`, you can run the following commands:

```bash
nvm install
nvm use
```

2. Install all node dependencies by running the following command in the project's root directory:

```bash
npm install
```

2. Start a development server of the backend by running the following command:

```bash
npx convex dev
```

Note: If this command does not work, you may be missing an .env.local file. You can read more about that by visiting [Environmental Variables](#environment-variables) section.

3. While keeping the old terminal running, open a new terminal and run a development server of the website by running the following command:

```bash
npm run dev
```

4. Open the website by visiting <http://localhost:3000> with your browser. When you make changes to a code file and save the file, the live preview will update on the url automatically.

Let @DylanDevelops know if you have any questions

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file if you don't already have them. Please contact [@DylanDevelops](https://www.github.com/dylandevelops) for how to get these.

1. `CONVEX_DEPLOYMENT`
2. `NEXT_PUBLIC_CONVEX_URL`
3. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## Feedback

If you have any feedback, bug reports, or anything else, please create an [issue](https://github.com/PantherGuessr/PantherGuessr/issues).

## Authors

- [@DylanDevelops](https://www.github.com/dylandevelops)
- [@dtsivkovski](https://www.github.com/dtsivkovski)
- [@ssparkpilot](https://www.github.com/ssparkpilot)

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
