# rst-playground

This is an attempt at providing a fully browser-based reStructuredText playground
that anyone can use without setting up a server.
Try it out at <https://waldyrious.github.io/rst-playground>.

## Motivation

This project was triggered by the two previous playgrounds
(<http://rst.ninjs.org> and <https://livesphinx.herokuapp.com>)
having stopped working as of December 2022,
and because I am more used to markdown and too lazy to learn rST properly,
so I find myself often needing such a playground
where I can try out the syntax and see how it renders.
(Also because I've been curious about Pyodide for a while, so it was an opportunity to give it a try.)

More detailed background:

- [Though there are various implementations of rST parsers](https://stackoverflow.com/q/2746692/266309),
  the reference/canonical one seems to be [docutils](https://docutils.sourceforge.io),
  which includes, among other modules, `rst2html` (converts from reStructuredText to HTML)
- Existing browser-based playgrounds called back to a server-side renderer in Python, also relying on `docutils`
  - Note: "called" is in the past tense because both
    [rst.ninjs.org](http://rst.ninjs.org)
    (source: [anru/rsted](https://github.com/anru/rsted)),
    and [livesphinx.herokuapp.com](https://livesphinx.herokuapp.com/), a fork of the former,
    (source: [readthedocs/livesphinx](https://github.com/readthedocs/livesphinx))
    are defunct as of December 2022
- [There doesn't seem to be](https://stackoverflow.com/q/16335197/266309)
  any pure JavaScript implementation which could be used in a fully client-side browser app
  - There is [seikichi.github.io/restructured](https://seikichi.github.io/restructured/),
    which does work fully in-browser,
    but it's [incomplete](https://github.com/seikichi/restructured/#progress)
    and [unmaintained](https://github.com/seikichi/restructured/issues/15)
  - [docutils-js](https://github.com/docutils-js/docutils-js) is an attempt to port `docutils` to JavaScript,
    but it's also [incomplete](https://github.com/docutils-js/docutils-js#addendum),
    and appears to be abandoned as well.
  - [rst-live-preview](https://github.com/frantic1048/rst-live-preview) is written in JavaScript,
    but it [relies](https://github.com/frantic1048/rst-live-preview/blob/42fac8658/rst-loader.js#L17)
    on the Python CLI tool [rst2html5](https://github.com/marianoguerra/rst2html5/)
    (attention, this is not `docutils`' `rst2html`,
    though see [this](https://github.com/marianoguerra/rst2html5/issues/20)
    and [this](https://github.com/marianoguerra/rst2html5/issues/87))
    to do the actual conversion.
- Given the lack of a pure-JavaScript rST renderer, perhaps [Pyodide](https://pyodide.org) could be used
  to run the Python-based `rst2html` directly the in the browser.
- Pyodide even has the relevant [packages](https://pyodide.org/en/0.19.1/usage/packages-in-pyodide.html)
  ([docutils](https://docutils.sourceforge.io) and [pygments](https://pygments.org)).
  See docs: [Loading packages](https://pyodide.org/en/0.19.1/usage/loading-packages.html#loading-packages).

## Status

A basic prototype is up and running.
The webpage is live at <https://waldyrious.github.io/rst-playground>.
It uses [Pyodide](https://pyodide.org) to call [docutils](https://docutils.sourceforge.io)
to convert rST content entered into the `<textarea>` on the left,
and shows the resulting HTML in the `<iframe>` on the right.

Check the [open issues](https://github.com/waldyrious/rst-playground/issues) for planned improvements.
Pull requests are welcome!
