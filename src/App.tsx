// ReactStar - A React Playground with a Custom Language
// This code is a simple React application that allows users to write and preview React code
// using a custom language. It includes features like code templates, a custom compiler,
// and the ability to share code via a URL. The app uses Monaco Editor for code editing
// and LZString for URL encoding/decoding.
// Last Updated: 04/10/2025
//Updated : 04/19/2025

import { Editor } from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import { templates } from './utils/templates';
import './App.css';
import LZString from 'lz-string';

const compileMyLang = (input: string): string => {
  return input
    .replace(/Component (\w+) \{([^}]+)\}/g, (_, comp, body) => {
      const props = Object.fromEntries(
        body
          .trim()
          .split(/\n|;/)
          .map((line: string) => line.trim())
          .filter(Boolean)
          .map((pair: string) => {
            const [key, value] = pair.split(':').map((s: string) => s.trim());
            return [key, value.replace(/^"|"$/g, '')];
          })
      );

      const events = Object.entries(props)
        .filter(([key]) => key.startsWith('on'))
        .map(([key, val]) => `${key}={() => ${val}}`)
        .join(' ');

      const otherProps = Object.entries(props)
        .filter(([key]) => !key.startsWith('on'))
        .map(([, val]) => `>${val}</${comp}>`);

      return `<${comp} ${events}${otherProps.length ? otherProps[0] : `></${comp}>`}`;
    })
    .replace(/print\(([^)]+)\)/g, 'ReactDOM.render($1, document.getElementById("root"))');
};
// === END: Custom Language Compiler ===

type Template = {
  [key: string]: {
    name: string;
    code: string;
  };
};

const typedTemplates = templates as Template;
typedTemplates.helloWorld.code = `function App() {
  return <h1>Hello, World!</h1>;
}

print(<App />);`;

typedTemplates.button = {
  name: 'Button with Alert',
  code: `Component Button {
  text: "Click me!"
  onClick: alert("You clicked the button!")
}`
};

typedTemplates.list = {
  name: 'Simple List',
  code: `function App() {
  return (
    <ul>
      {["Apple", "Banana", "Cherry"].map(fruit => <li>{fruit}</li>)}
    </ul>
  );
}

print(<App />);`
};

typedTemplates.form = {
  name: 'Basic Form',
  code: `function App() {
  return (
    <form onSubmit={e => { e.preventDefault(); alert('Submitted!'); }}>
      <input type="text" placeholder="Your Name" />
      <button type="submit">Submit</button>
    </form>
  );
}

print(<App />);`
};

const generateHtml = (code: string) => `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
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

const downloadCode = (code: string, filename: string) => {
  const blob = new Blob([code], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

const App = () => {
  const [code1, setCode1] = useState(typedTemplates.helloWorld.code);
  const [code2, setCode2] = useState('');
  const [iframeSize, setIframeSize] = useState<'small' | 'medium' | 'large'>('large');
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [mode, setMode] = useState<'tsx' | 'custom'>('tsx');

  useEffect(() => {
    const saved = localStorage.getItem('customCode');
    if (saved) setCode2(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('customCode', code2);
  }, [code2]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decompressedCode = LZString.decompressFromEncodedURIComponent(hash);
      if (decompressedCode) {
        setCode2(decompressedCode);
      }
    }
  }, []);

  const compiledCode = mode === 'custom' ? compileMyLang(code2) : code2;

  return (
    <div className="app-container">
      <h1>ReactStar</h1>
      <p>Write and preview React code with a custom language!</p>
      <div className="toolbar">
        <select
          title="Select Template"
          onChange={(e) => setCode1(typedTemplates[e.target.value].code)}
        >
          <option disabled selected>
            -- Select Template --
          </option>
          {Object.entries(typedTemplates).map(([key, { name }]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
        <select title="Select Mode" onChange={(e) => setMode(e.target.value as 'tsx' | 'custom')}>
          <option value="tsx">React/TSX</option>
          <option value="custom">MyLang</option>
        </select>
        <button onClick={() => setTheme((prev) => (prev === 'light' ? 'vs-dark' : 'light'))}>
          Toggle Theme
        </button>
        <button onClick={() => setCode2('')}>🧼 Clear</button>
      </div>

      <div className="editor-preview-wrapper">
        <div className="preview-wrapper">
          <Editor
            height="300px"
            defaultLanguage="typescript"
            theme={theme}
            value={code1}
            onChange={(val) => setCode1(val || '')}
          />
          <iframe
            srcDoc={generateHtml(code1)}
            sandbox="allow-scripts"
            title="Preview 1"
            className={`responsive-iframe ${iframeSize}`}
            
          />
          <div className="device-buttons">
            <button onClick={() => setIframeSize('small')}>📱</button>
            <button onClick={() => setIframeSize('medium')}>📲</button>
            <button onClick={() => setIframeSize('large')}>💻</button>
            <button onClick={() => downloadCode(code1, 'template1.tsx')}>💾 Download</button>
          </div>
        </div>

        <div className="preview-wrapper">
          <Editor
            height="300px"
            defaultLanguage="typescript"
            theme={theme}
            value={code2}
            onChange={(val) => setCode2(val || '')}
          />
          <iframe
            srcDoc={generateHtml(compiledCode)}
            sandbox="allow-scripts"
            title="Preview 2"
            className={`responsive-iframe ${iframeSize}`}
            
          />
          <div className="device-buttons">
            <button onClick={() => setIframeSize('small')}>📱</button>
            <button onClick={() => setIframeSize('medium')}>📲</button>
            <button onClick={() => setIframeSize('large')}>💻</button>
            <button onClick={() => downloadCode(code2, 'customCode.txt')}>💾 Download</button>
          </div>
        </div>
      </div>

      <div className="share-url">
        <button
          onClick={() => {
            const encoded = LZString.compressToEncodedURIComponent(code2);
            const shareLink = `${window.location.origin}/#${encoded}`;
            navigator.clipboard.writeText(shareLink);
            alert('Shareable link copied to clipboard!');
          }}
        >
          🔗 Share Code
        </button>
      </div>
    </div>
  );
};

export default App;