'use client';

type ModelType = 'gemini' | 'openai' | 'openrouter';

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
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="gemini">Google Gemini</option>
        <option value="openai">OpenAI GPT-4</option>
        <option value="openrouter">OpenRouter Models</option>
      </select>
    </div>
  );
}