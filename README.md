# rst-playground

This is an interactive [reStructuredText](https://docutils.sourceforge.io/rst.html) renderer
working entirely in the browser, allowing anyone to try out the rST syntax and see how it renders,
without needing to set up a server or install any software.

Try it out at <https://waldyrious.github.io/rst-playground>.

## How it works

The tool is a simple HTML page with a `<textarea>` and an `<output>` element side-by-side.
It uses [Pyodide](https://pyodide.org) to call [docutils](https://docutils.sourceforge.io)
to convert plain-text rST-formatted content into HTML-based rich-text.

## Motivation

This project was triggered by the two previous reStructuredText playgrounds
(<http://rst.ninjs.org> and <https://livesphinx.herokuapp.com>)
having stopped working as of December 2022,
and because I am more used to markdown and too lazy to learn rST properly,
so I find myself often needing such a playground
where I can try out the syntax and see how it renders.
(Also because I've been curious about [Pyodide](https://pyodide.org) for a while,
so it was an opportunity to give it a try.)

### Historical context

- [Though there are various implementations of rST parsers](https://stackoverflow.com/q/2746692/266309),
  the reference/canonical one is the original [docutils](https://docutils.sourceforge.io),
  which includes, among other modules, `rst2html` (which converts from reStructuredText to HTML).
- Existing browser-based playgrounds called back to a server-side renderer in Python, also relying on `docutils`.
  - Note: "called" is in the past tense because both
    [rst.ninjs.org](http://rst.ninjs.org)
    (source: [anru/rsted](https://github.com/anru/rsted)),
    and [livesphinx.herokuapp.com](https://livesphinx.herokuapp.com/), a fork of the former
    (source: [readthedocs/livesphinx](https://github.com/readthedocs/livesphinx))
    are defunct as of December 2022.
- [There doesn't seem to be](https://stackoverflow.com/q/16335197/266309)
  any pure JavaScript implementation which could be used in a fully client-side browser app.
  - There is [seikichi.github.io/restructured](https://seikichi.github.io/restructured/),
    which does work fully in-browser,
    but it's [incomplete](https://github.com/seikichi/restructured/#progress)
    and [unmaintained](https://github.com/seikichi/restructured/issues/15).
  - [docutils-js](https://github.com/docutils-js/docutils-js) is an attempt to port `docutils` to JavaScript,
    but it's also [incomplete](https://github.com/docutils-js/docutils-js#addendum),
    and appears to be abandoned as well.
  - [rst-live-preview](https://github.com/frantic1048/rst-live-preview) is written in JavaScript,
    but it [relies](https://github.com/frantic1048/rst-live-preview/blob/42fac8658/rst-loader.js#L17)
    on a local installation of the Python CLI tool
    [rst2html5](https://github.com/marianoguerra/rst2html5/)
    (attention, this is not `docutils`' `rst2html`)
    to do the actual conversion.
- Given the lack of a pure-JavaScript rST renderer,
  I figured that perhaps [Pyodide](https://pyodide.org) could be used
  to run the Python-based `rst2html` directly the in the browser.
  Pyodide even has the relevant [packages](https://pyodide.org/en/0.19.1/usage/packages-in-pyodide.html)
  ([docutils](https://docutils.sourceforge.io) and [pygments](https://pygments.org))
  to enable this. Hence, this project was born.

## Contributing

This is a collaborative project, and contributions are welcome!
Check the [open issues](https://github.com/waldyrious/rst-playground/issues) for planned improvements.
You can share feedback by opening new issues or commenting on existing ones.
If you want to contribute more directly, feel free to fork the repository and submit pull requests.

### Development principles

This project is meant to be straightforward, lightweight, and easy to hack.
If you're planning to submit changes, please keep the following principles in mind:

- **Simple web page.**
  The playground must remain fully functional as a plain HTML file loaded directly into the browser.
  No backend, no build steps, no need to run a local server.
- **Straightforward, readable code.**
  The code should be easy to follow for someone with basic programming knowledge,
  without requiring familiarity with modern tooling or trends.
  Avoid clever tricks, terse syntax or layered abstractions.
- **Helpful documentation.**
  Include comments that explain how and why things work, not just what they do.
  Aim to help the next person understand the _reasoning_ behind the implementation.
- **Single purpose.**
  The tool is meant to be a simple and accurate rST renderer — not a full-fledged editor, linter, etc.
  Following the [Unix principle](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well),
  it should resist [feature creep](https://en.wikipedia.org/wiki/Feature_creep)
  and avoid adding features beyond this core purpose.

The goal is a clean, maintainable codebase that’s easy to dive into and tweak.
Any contributions that adhere to this philosophy are most welcome!

### Development workflow

This project is hosted on GitHub, so you can contribute by forking the repository
and submitting pull requests (PRs) with your changes.
Simple changes like typos or minor improvements can be done directly in the GitHub web interface,
but for more substantial changes, it's best to clone your fork of the repository and work locally:

```shell
git clone --recurse-submodules https://github.com/<your-username>/rst-playground
```

Then, simply open the `index.xhtml` file in your browser.
There's no need to install anything, run a build step, or set up a local server.
Any edits you make in the HTML, CSS and JavaScript files will be applied by refreshing the page in the browser.

When you open a pull request, you can provide a live preview of your edited version
by setting up your GitHub fork to publish the branch where you are working using GitHub Pages.
Then, your version of the tool will be available at `https://<your-username>.github.io/rst-playground/`.

Code formatting is automatically checked on all pull requests using [Prettier](https://prettier.io/).
If you would like to check the syntax of new code locally before submitting a PR,
make sure you have Node.js installed, and run `npx prettier . --check`
(you can use `--write` instead of `--check` to automatically format the code).
Besides [Prettier's default configuration](https://prettier.io/docs/options),
the [.prettierrc.toml](.prettierrc.toml) file lists additional rules used in this project.

## License

This project is licensed under the [ISC License](LICENSE.md).
