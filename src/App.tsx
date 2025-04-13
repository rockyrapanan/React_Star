import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { templates } from './utils/templates';
import './App.css';

type Template = { // templates };
  [key: string]: {
    name: string;
    code: string;
  };
};

const typedTemplates = templates as Template; // Type assertion

const generateHtml = (code: string) => `
  <html>
    <body>
      <div id="root"></div>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script type="text/babel">
        ${code}
      </script>
    </body>
  </html>
`;
// This function generates the HTML structure for the iframe, including the React and Babel libraries.
// It takes the provided code as a string and wraps it in a script tag with type "text/babel".
const downloadCode = (code: string, filename: string) => {
  const blob = new Blob([code], { type: 'text/plain' }); // Create a new Blob object
  const a = document.createElement('a'); // Create a new anchor element
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};
 // This function allows users to download the code as a file.
// It creates a Blob object from the code string and generates a temporary link to download it.
// The filename is passed as an argument.
// The function is triggered when the user clicks the "Download" button.
// The code is passed as a string to the Blob constructor, and the link is clicked programmatically.
// The link is created using URL.createObjectURL, which generates a URL for the Blob object.
// The link is then clicked programmatically to trigger the download.
// The filename is set to the provided filename argument.
const App = () => {
  const [code1, setCode1] = useState(typedTemplates.helloWorld.code);
  const [code2, setCode2] = useState('');
  const [width1, setWidth1] = useState('1280px');
  const [width2, setWidth2] = useState('1280px');

  return (
    <div className="app-container">
      <h1>ReactBox Dual Preview</h1>

      <div className="editor-preview-wrapper">
        {/* === Left Panel (Templates) === */}
        <div className="preview-wrapper">
          <select
            title="Select Template 1"
            onChange={(e) =>
              setCode1(typedTemplates[e.target.value].code)
            }
          >
            <option disabled selected>-- Select Template --</option>
            {Object.entries(typedTemplates).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
          <Editor
            height="300px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code1}
            onChange={(val) => setCode1(val || '')}
          />
          <iframe
            srcDoc={generateHtml(code1)}
            sandbox="allow-scripts"
            title="Preview 1"
            className="custom-preview"
            data-width={width1}
          />
          {/* This iframe displays the generated HTML content based on the provided code. */}
          {/* The sandbox attribute allows scripts to run in a secure environment. */}
          {/* The title attribute provides an accessible name for the iframe. */}
          <div className="device-buttons">
            <button onClick={() => setWidth1('375px')}>📱</button>
            <button onClick={() => setWidth1('768px')}>📲</button>
            <button onClick={() => setWidth1('1280px')}>💻</button>
            <button onClick={() => downloadCode(code1, 'template1.js')}>💾 Download</button>
          </div>
        </div>

        {/* === Right Panel (Blank Editor) === */}
        <div className="preview-wrapper">
          <p className="blank-editor-title">Blank Editor</p>
          <Editor
            height="300px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code2}
            onChange={(val) => setCode2(val || '')}
          />
          <iframe
            srcDoc={generateHtml(code2)}
            sandbox="allow-scripts"
            title="Preview 2"
            className="custom-preview"
            data-width={width2}
          />
          <div className="device-buttons">
            <button onClick={() => setWidth2('375px')}>📱</button>
            <button onClick={() => setWidth2('768px')}>📲</button>
            <button onClick={() => setWidth2('1280px')}>💻</button>
            <button onClick={() => setCode2('')}>🧼 Clear</button>
            <button onClick={() => downloadCode(code2, 'customCode.js')}>💾 Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};
// This component renders the main application interface.
// It includes a title, two panels for templates and a blank editor, and buttons for device previews and downloads.
// The left panel allows users to select a template from a dropdown menu.
// The right panel is a blank editor where users can write their own code.
export default App;