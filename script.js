const inputTextarea = document.getElementById("rst-input");
const outputFrame = document.getElementById("html-output");

// Activate controls that are inert if JavaScript is disabled
inputTextarea.disabled = false;
inputTextarea.placeholder = "Enter reStructuredText content here.";
outputFrame.contentDocument.write("<!DOCTYPE html> Initializing...\n");

// Check if the browser supports WebAssembly
function checkForWebAssembly() {
  if (!("WebAssembly" in window)) {
    throw new Error("This website requires WebAssembly because it depends on Pyodide to run docutils in the browser");
  }
}

// Initialize Pyodide
async function main() {
  const startTime = Date.now();
  // Load Pyodide along with the required packages to run docutils.
  // The `pygments` package is included to support code blocks with language specifiers
  // (they automatically trigger syntax highlighting)
  let pyodide = await loadPyodide({ packages: ["docutils", "pygments"] });
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  outputFrame.contentDocument.write(`Ready in ${elapsedTime}s.\n`);
  // This makes the browser favicon stop the loading spinner
  outputFrame.contentDocument.close();

  // Trigger rendering whenever the textarea content changes (typing, pasting, etc.)
  inputTextarea.addEventListener("input", debouncedConvert);

  return pyodide;
}
let pyodideReadyPromise = main();

// Define the conversion delay timer outside the delaying function itself
// so it can be reused (i.e. reset) across function calls.
let convertTimer;

// Debounced (delayed) auto-conversion function.
// This function runs whenever the input text changes,
// and schedules the rST-to-HTML conversion after a short delay.
// Each time it runs, it resets the delay timer — so the conversion
// only happens once the user stops typing for long enough.
// (Without this, the conversion would run on every keystroke.)
function debouncedConvert() {
  // Cancel the previous countdown, if any
  clearTimeout(convertTimer);
  // Start a new countdown of 300 milliseconds and call rstToHtml() when it ends
  convertTimer = setTimeout(rstToHtml, 300);
}

async function rstToHtml() {
  try {
    checkForWebAssembly();
    let pyodide = await pyodideReadyPromise;

    // We pass the textarea contents as a variable
    // instead of interpolating them into the code below.
    // For the reasoning, see the description of commit 40037ef37.
    pyodide.globals.set("input_text", inputTextarea.value);

    // Python code to parse a rST string into HTML using docutils
    // See: https://docutils.sourceforge.io/docs/api/publisher.html#publish-string
    // Note: the `decode()` is needed to convert `publish_string()`'s output
    // from a bytestring to a plain string. See https://stackoverflow.com/a/606199/266309.
    let htmlString = await pyodide.runPythonAsync(`
      from docutils.core import publish_string
      publish_string(input_text, writer_name="html5").decode("utf-8")
    `);

    // Modify the output HTML string to include the docutils.css file.
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const linkTag = doc.createElement("link");
    linkTag.rel = "stylesheet";
    linkTag.href = "docutils.css";
    doc.head.appendChild(linkTag);
    htmlString = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

    outputFrame.srcdoc = htmlString;
  } catch (err) {
    const pre = document.createElement("pre");
    pre.textContent = err;
    outputFrame.srcdoc = pre.outerHTML;
  }
}
