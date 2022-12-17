const inputTextarea = document.getElementById("rst-input");
const outputFrame = document.getElementById("html-output");

outputFrame.contentDocument.write("<!DOCTYPE html> Initializing...\n");

// init Pyodide
async function main() {
  let pyodide = await loadPyodide();
  outputFrame.contentDocument.write("Ready.\n");
  // This makes the browser favicon stop the loading spinner
  outputFrame.contentDocument.close();

  return pyodide;
}
let pyodideReadyPromise = main();

async function rstToHtml() {
  let pyodide = await pyodideReadyPromise;
  try {
    await pyodide.loadPackage("docutils");
    // Add pygments to support code blocks with language specifiers
    // (they automatically trigger syntax highlighting)
    await pyodide.loadPackage("pygments");

    pyodide.globals.set('input_text', inputTextarea.value);

    let result = await pyodide.runPythonAsync(`
      # https://stackoverflow.com/a/6654576/266309
      from docutils.core import publish_string
      # https://stackoverflow.com/a/606199/266309 → decode bytestring to plain string
      publish_string(input_text, writer_name='html5').decode("utf-8")
      # TODO: change to publish_doctree() + cleanup + publish_from_doctree()
      #       (see https://docutils.sourceforge.io/docs/api/publisher.html)
      #       so that the output can be just the plain inner content and not have to be placed in an iframe
    `);

    outputFrame.srcdoc = result;

    // Override Docutils' default style, which adds a grey background to the body element.
    // We need to wait until the iframe's load event; see https://stackoverflow.com/a/13959836/266309.
    outputFrame.addEventListener("load", event => {
      const newStyle = outputFrame.contentDocument.createElement("style");
      newStyle.textContent = "body { background-color: unset; }";
      event.target.contentDocument.head.appendChild(newStyle);
    });
  } catch (err) {
    const pre = document.createElement('pre');
    pre.textContent = err;
    outputFrame.srcdoc = pre.outerHTML;
  }
}
