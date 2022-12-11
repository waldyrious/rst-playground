// Attempt to prevent caching of the iframe source
// https://stackoverflow.com/a/52507285/266309
// This seems to break the page upon reload...
// var myIFrame = document.getElementById("output-iframe");
// myIFrameUrl = myIFrame.contentWindow.location.href;
// myIFrame.src = myIFrameUrl + '?timestamp=' + new Date().getTime();

const output = document.getElementById("html-output");
const input = document.getElementById("rst-input");

output.value = "Initializing...\n";

// init Pyodide
async function main() {
  let pyodide = await loadPyodide();
  output.value += "Ready!\n";
  return pyodide;
}
let pyodideReadyPromise = main();

async function rstToHtml() {
  let pyodide = await pyodideReadyPromise;
  try {
    // TODO: also load pygments for syntax highlighting
    await pyodide.loadPackage("docutils");

    pyodide.globals.set('input_text', input.value);

    let result = await pyodide.runPythonAsync(`
      # https://stackoverflow.com/a/6654576/266309
      from docutils.core import publish_string
      # https://stackoverflow.com/a/606199/266309 → decode bytestring to plain string
      publish_string(input_text, writer_name='html5').decode("utf-8")
      # TODO: change to publish_doctree() + cleanup + publish_from_doctree()
      #       (see https://docutils.sourceforge.io/docs/api/publisher.html)
      #       so that the output can be just the plain inner content and not have to be placed in an iframe
    `);
    // Set HTML document as the contents of an iframe
    // https://stackoverflow.com/a/4199540/266309
    iframe = document.getElementById("iframe0").contentDocument;
    iframe.open();
    iframe.write(result);
    iframe.close();
  } catch (err) {
    output.value = err;
  }
}
