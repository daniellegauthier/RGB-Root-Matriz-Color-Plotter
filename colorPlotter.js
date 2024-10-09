// colorPlotter.js
const { useState } = React;

// Basic UI components since we don't have access to shadcn/ui
const Card = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="px-4 py-2 border-b font-bold">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

const Button = ({ children, type = 'button', variant = 'primary', onClick }) => (
  <button 
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      variant === 'primary' 
        ? 'bg-blue-500 text-white' 
        : 'border border-gray-300'
    }`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded"
  />
);

const Select = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={onChange}
    className="w-full px-3 py-2 border rounded"
  >
    <option value="">Choose a pathway (optional)</option>
    {options.map(option => (
      <option key={option} value={option}>
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </option>
    ))}
  </select>
);

const colorData = [
  { color: 'grey', rgb: [170,170,170], direction: 'respectful effective apposite precary' },
  { color: 'pink', rgb: [250,0,90], direction: 'incredibily exquisite and ambitious' },
  { color: 'gold', rgb: [250,200,0], direction: 'undepartable preflorating technocracy lotiform' },
  { color: 'nude', rgb: [250,180,120], direction: 'felicitously deft satisfied unextenuable' },
  { color: 'orange', rgb: [250,110,0], direction: 'blurry artesian awesome' },
  { color: 'white', rgb: [255,255,255], direction: 'unlavish analeptical' },
  { color: 'blue', rgb: [0,0,255], direction: 'daintily perfect, intelligent photopathy' },
  { color: 'green', rgb: [0,255,0], direction: 'bulbous spontaneous heroic' },
  { color: 'red', rgb: [255,0,0], direction: 'candid apophantic, distinct and radiant' },
  { color: 'black', rgb: [0,0,0], direction: 'undertreated paleoatavistic obeyable swabble' },
];

const pathways = {
  pain: ['gold', 'orange'],
  practical: ['yellow', 'green'],
  spiritual: ['blue', 'brown'],
  prayer: ['nude', 'white'],
  sad: ['purple', 'grey', 'red'],
  precise: ['pink', 'black'],
  fem: ['brown', 'gold', 'orange', 'pink'],
  masc: ['red', 'blue', 'orange'],
  direct': ['red', 'orange'],
};

function ColorPlotter() {
  const [obstacle, setObstacle] = useState('');
  const [pathway, setPathway] = useState('');
  const [colorInputs, setColorInputs] = useState({});
  const [results, setResults] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let resultText = `Obstacle: ${obstacle || '[no obstacle entered]'}\n`;
    resultText += `Pathway: ${pathway || '[no pathway selected]'}\n\n`;
    resultText += 'Color Interpretations:\n\n';

    colorData.forEach(({ color, direction }) => {
      const userInput = colorInputs[color] || direction;
      resultText += `${color.toUpperCase()}:\n`;
      resultText += `Your interpretation: ${userInput}\n`;
      resultText += `Original direction: ${direction}\n\n`;
    });

    if (pathway && pathways[pathway]) {
      resultText += `\nSelected pathway colors: ${pathways[pathway].join(', ')}`;
    }

    setResults(resultText);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">The RGB Root Matrix Color Plotter</h1>
      <p className="text-sm mb-4">by Danielle Gauthier</p>

      <Card className="mb-4">
        <CardHeader>Description</CardHeader>
        <CardContent>
          <p>This program is inspired by ecofeminist pluriverse and feminist perspectives on family-making and crafting. It is used for telepathic communication and poetic linguistic navigation programming.</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Enter your obstacle (optional):</label>
          <Input
            value={obstacle}
            onChange={(e) => setObstacle(e.target.value)}
            placeholder="e.g., fear, uncertainty, conflict..."
          />
        </div>

        <div>
          <label className="block mb-2">Select Pathway:</label>
          <Select
            value={pathway}
            onChange={(e) => setPathway(e.target.value)}
            options={Object.keys(pathways)}
          />
        </div>

        <div className="space-y-4">
          {colorData.map(({ color, direction }) => (
            <div key={color} className="flex items-center space-x-4">
              <div 
                className="w-8 h-8 rounded" 
                style={{
                  backgroundColor: `rgb(${colorData.find(c => c.color === color).rgb.join(',')})`,
                  border: color === 'white' ? '1px solid black' : 'none'
                }}
              />
              <div className="flex-grow">
                <label className="block mb-1">
                  {color.charAt(0).toUpperCase() + color.slice(1)}:
                </label>
                <Input
                  value={colorInputs[color] || ''}
                  onChange={(e) => setColorInputs({...colorInputs, [color]: e.target.value})}
                  placeholder={direction}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-x-4">
          <Button type="submit">Expose</Button>
          <Button 
            variant="secondary"
            onClick={() => {
              setObstacle('');
              setPathway('');
              setColorInputs({});
              setResults('');
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      {results && (
        <Card className="mt-4">
          <CardHeader>Results</CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{results}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Render the app
ReactDOM.render(<ColorPlotter />, document.getElementById('root'));
