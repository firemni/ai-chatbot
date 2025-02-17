import { ModelType } from '../../../src/ai/models/model-factory';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="flex justify-center mb-4">
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as ModelType)}
        className="model-selector"
      >
        <option value="gemini">Google Gemini</option>
        <option value="openai">OpenAI</option>
        <option value="openrouter">OpenRouter</option>
      </select>
    </div>
  );
}