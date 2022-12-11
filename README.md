# rst-playground

This is an attempt at providing a fully browser-based reStructuredText playground
that anyone can use without setting up a server.
Try it out (attention: very rough prototype!) at <https://waldyrious.github.io/rst-playground>.

## Motivation

This project was triggered by the two previous playgrounds
(<http://rst.ninjs.org> and <https://livesphinx.herokuapp.com>)
having stopped working as of December 2022,
and because I am more used to markdown and too lazy to learn rST properly,
so I find myself often needing such a playground
where I can try out the syntax and see how it renders.
(Also because I've been curious about Pyodide for a while, so it was an opportunity to give it a try.)

More detailed background:

- [Though there are various implementations of rST parsers](https://stackoverflow.com/questions/2746692/restructuredtext-tool-support),
  the reference/canonical one seems to be [docutils](https://docutils.sourceforge.io),
  which includes, among other modules, `rst2html` (converts from reStructuredText to HTML)
- [There doesn't seem to be](https://stackoverflow.com/questions/16335197/are-there-any-restructuredtext-to-html-parseror-library-perhaps-written-in-j) any JavaScript-only implementation which could be used in fully client-side browser app
- Existing browser-based playgrounds called back to a server-side renderer
  - Note: "called" is in the past tense because [rst.ninjs.org](http://rst.ninjs.org) ([anru/rsted](https://github.com/anru/rsted)), and [livesphinx.herokuapp.com](https://livesphinx.herokuapp.com/) ([readthedocs/livesphinx](https://github.com/readthedocs/livesphinx)), a fork of the former, are both defunct as of Dec 2022
- There is [seikichi.github.io/restructured](https://seikichi.github.io/restructured/) which does work fully in-browser, but it's incomplete and unmaintained
- [rst-live-preview](https://github.com/frantic1048/rst-live-preview) is a Node.js CLI tool that [relies](https://github.com/frantic1048/rst-live-preview/blob/42fac86586469964c06dcd867db714e35d97a3ec/rst-loader.js#L17) on a Python CLI tool ([rst2html5](https://github.com/marianoguerra/rst2html5/) — attention, this is not docutil's `rst2html`, though see [this](https://github.com/marianoguerra/rst2html5/issues/20) and [this](https://github.com/marianoguerra/rst2html5/issues/87))
- Since there doesn't seem to be a JavaScript rST renderer, perhaps [Pyodide](https://pyodide.org) could be used to run the Python-based `rst2html` directly the in the browser, using .
- Pyodide even has the relevant [packages](https://pyodide.org/en/0.19.1/usage/packages-in-pyodide.html)
  ([docutils](https://docutils.sourceforge.io) and [pygments](https://pygments.org)).
  See docs: [Loading packages](https://pyodide.org/en/0.19.1/usage/loading-packages.html#loading-packages).

## Status

Very rough prototype: The webpage is live at <https://waldyrious.github.io/rst-playground>,
and it does use Pyodide to call docutils and show the resulting HTML (in an iframe)
but there are several problems, most notably the inability to process multiline strings.
There are some comments and TODOs in the code,
which should be converted into proper issues.
