Contributing to nPonysay
We greatly appreciate contributions to ponysay! There are several ways you can help make this project even more magical.
🦄 Populate Equestria
nPonysay always needs talented artists to create new pony artwork! We welcome ponies from:

My Little Pony: Friendship is Magic - Classic characters and scenes
Other My Little Pony shows - G4, G5, and beyond
Fan media - Original characters and community creations

Getting Started: Check out our documentation for detailed guidelines on creating and formatting pony art for the project. The contributing guide covers technical requirements, art standards, and submission processes.
📚 Maintain the Canterlot Library
Our documentation is continuously evolving and needs regular care:
Language & Style

The manual is written in ponified Queen's British English
Help us maintain consistency throughout all documentation
Report typos, spelling errors, or unclear sections
Suggest better phrasing and clearer explanations

Version Consistency
We maintain multiple formats of our documentation:

Primary version (main reference)
Info version (terminal/CLI format)
HTML version (web format)

If you notice inconsistencies between versions, please:

Submit a patch with corrections
Open an issue describing the problem
Leave detailed comments in commit messages

Translations
While the primary manual updates frequently (making full translations challenging), man page translations are incredibly valuable! We especially welcome contributions for languages where English comprehension varies across age groups.
✨ Create New Magic Spells
Ready to contribute code? Here's how to make your magic happen:
Submission Process

Fork the repository and create a feature branch
Make your changes following our coding standards
Submit a pull request with a clear description

Code Quality Standards
Documentation First

Document every new method, function, and class
Follow the same documentation style as existing code
Include usage examples where helpful

Maintainability Over Optimization

Write clear, readable code that others can understand
Avoid overly complex optimizations unless absolutely necessary
Add comments for complex logic or non-obvious code segments
Consider future maintainers who will work with your code

Testing & Validation

Test your changes thoroughly before submitting
Ensure compatibility with existing functionality
Include relevant test cases when appropriate

🤝 How to Get Started

Explore the codebase to understand the project structure
Check open issues for tasks that match your skills
Join the community discussions for guidance and support
Start small with documentation fixes or minor features
Ask questions - the community is here to help!

📝 Submission Guidelines
When contributing, please:

Use clear, descriptive commit messages
Reference related issues in your pull requests
Be patient during the review process
Be open to feedback and suggestions
Follow the project's code of conduct


Thank you for helping make ponysay more magical for everypony! 🌈

## Publishing to npm

To publish a new version of the package to [npmjs.com](https://www.npmjs.com/), follow these steps:

### 1. Prerequisites

- Ensure you have an npm account and are logged in:
  ```sh
  npm login
  ```
- Make sure your local branch is up to date and all changes are committed.

### 2. Update the Version

- Update the `version` field in [`package.json`](ponysay-node/package.json:1) according to [semantic versioning](https://semver.org/):
  ```sh
  npm version [patch|minor|major]
  ```
  This will also create a git tag.

### 3. Build and Test

- Run all tests and build the package to verify everything works:
  ```sh
  npm test
  npm run build
  ```

### 4. Publish

- Publish the package to npm:
  ```sh
  npm publish
  ```
  If publishing a public package for the first time, use:
  ```sh
  npm publish --access public
  ```

### 5. Verify

- Check the package on [npmjs.com](https://www.npmjs.com/) to ensure the new version is available.
- Install the package in a clean environment to verify:
  ```sh
  npm install ponysay-node
  ```

### 6. Common Gotchas

- Make sure you are publishing from the correct directory (where `package.json` is located).
- Ensure your `.npmignore` and [`package.json`](ponysay-node/package.json:1) files are correctly configured to avoid publishing unwanted files.
- If you encounter permission errors, check your npm account permissions and organization settings.
- Only publish stable, tested code—npm publishes are permanent.

For more details, see the [npm documentation](https://docs.npmjs.com/cli/v10/commands/npm-publish).
