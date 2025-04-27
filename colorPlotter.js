// colorPlotter.js

const { useState, useEffect } = React;

// Reusable Components
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
        ? 'bg-brown-600 text-white' 
        : 'border border-gray-300'
    }`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, dataColor }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    data-color={dataColor}
    className="w-full px-3 py-2 border rounded"
  />
);

const Select = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={onChange}
    className="w-full px-3 py-2 border rounded"
  >
    <option value="">Choose a pathway...</option>
    {options.map(option => (
      <option key={option} value={option}>
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </option>
    ))}
  </select>
);

// Color + GNH Data
const colorData = [
  { color: 'grey', rgb: [170,170,170], gnh: 'Economic Wellness' },
  { color: 'pink', rgb: [250,0,90], gnh: 'Mental Wellness' },
  { color: 'gold', rgb: [250,200,0], gnh: 'Workplace Wellness' },
  { color: 'nude', rgb: [250,180,120], gnh: 'Physical Wellness' },
  { color: 'orange', rgb: [250,110,0], gnh: 'Social Wellness' },
  { color: 'white', rgb: [255,255,255], gnh: 'Political Wellness' },
  { color: 'blue', rgb: [0,0,255], gnh: 'Environmental Wellness' },
  { color: 'green', rgb: [0,255,0], gnh: 'Ecological Diversity' },
  { color: 'red', rgb: [255,0,0], gnh: 'Health' },
  { color: 'black', rgb: [0,0,0], gnh: 'Good Governance' },
  { color: 'brown', rgb: [180,50,0], gnh: 'Education Value' },
  { color: 'yellow', rgb: [255,255,0], gnh: 'Living Standards' },
  { color: 'purple', rgb: [180,50,255], gnh: 'Cultural Diversity' }
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
  direct: ['red', 'orange'],
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

    (pathway && pathways[pathway] ? pathways[pathway] : colorData.map(cd => cd.color)).forEach(colorName => {
      const colorInfo = colorData.find(c => c.color === colorName);
      const userInput = colorInputs[colorName] || '';
      resultText += `${colorInfo.color.toUpperCase()}:\n`;
      resultText += `GNH Indicator: ${colorInfo.gnh}\n`;
      resultText += `Your interpretation: ${userInput || '[no input]'}\n\n`;
    });

    setResults(resultText);

    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultContent').innerText = resultText;
  };

  const handleColorInputChange = (color) => (e) => {
    setColorInputs({ ...colorInputs, [color]: e.target.value });
  };

  const renderColorInputs = () => {
    const filteredColors = pathway && pathways[pathway]
      ? pathways[pathway]
      : colorData.map(c => c.color);

    return filteredColors.map(colorName => {
      const colorInfo = colorData.find(c => c.color === colorName);

      return (
        <div key={colorName}>
          <label className="block mb-1" title={`GNH: ${colorInfo.gnh}`}>
            {colorName.charAt(0).toUpperCase() + colorName.slice(1)} ({colorInfo.gnh})
          </label>
          <Input
            value={colorInputs[colorName] || ''}
            onChange={handleColorInputChange(colorName)}
            placeholder={`Describe ${colorName} meaning`}
            dataColor={colorName}
          />
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>Color Plotter</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Enter your obstacle:</label>
              <Input value={obstacle} onChange={(e) => setObstacle(e.target.value)} placeholder="Obstacle..." />
            </div>

            <div>
              <label className="block mb-2">Select Pathway:</label>
              <Select 
                value={pathway} 
                onChange={(e) => setPathway(e.target.value)} 
                options={Object.keys(pathways)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderColorInputs()}
            </div>

            <Button type="submit">Generate</Button>
          </form>
        </CardContent>
      </Card>

      <div id="results" className="hidden">
        <h2 className="font-bold mb-2">Results</h2>
        <pre id="resultContent" className="whitespace-pre-wrap bg-amber-100 p-4 rounded"></pre>
      </div>
    </div>
  );
}

// Render the React app
ReactDOM.render(<ColorPlotter />, document.getElementById('colorForm'));
