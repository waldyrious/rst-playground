const inputTextarea = document.getElementById("rst-input");
const outputFrame = document.getElementById("html-output");

outputFrame.contentDocument.write("<!DOCTYPE html> Initializing...\n");

// Initialize Pyodide
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

    // We pass the textarea contents as a variable
    // instead of interpolating them into the code below.
    // For the reasoning, see the description of commit 40037ef37.
    pyodide.globals.set('input_text', inputTextarea.value);

    // Python code to parse a rST string into HTML using docutils
    // as recommended in https://stackoverflow.com/a/6654576/266309.
    // Note: the `decode()` is needed to convert `publish_string()`'s output
    // from a bytestring to a plain string. See https://stackoverflow.com/a/606199/266309.
    let result = await pyodide.runPythonAsync(`
      from docutils.core import publish_string
      publish_string(input_text, writer_name='html5').decode("utf-8")
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
