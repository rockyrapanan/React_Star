
export const templates = {
  helloWorld: {
    name: 'Hello World',
    code: `
function App() {
  return <h1>Hello, World!</h1>;
}

ReactDOM.render(<App />, document.getElementById('root'));
    `.trim(),
  },

  buttonClick: {
    name: 'Button Click Counter',
    code: `
function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>You clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
    `.trim(),
  },

  inputForm: {
    name: 'Input Form Example',
    code: `
function App() {
  const [name, setName] = React.useState('');

  return (
    <div>
      <h2>Hello {name || 'Stranger'}</h2>
      <input 
        type="text" 
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
    `.trim(),
  },
};