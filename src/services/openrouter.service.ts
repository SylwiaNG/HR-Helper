// Custom error classes for OpenRouter service
export class OpenRouterAPIError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
    this.name = 'OpenRouterAPIError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Type definitions
interface ResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: object;
  };
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ChatCompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  responseFormat?: ResponseFormat;
  temperature?: number;
  maxTokens?: number;
}

export class OpenRouterService {
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  constructor(apiKey: string, defaultModel: string = "anthropic/claude-3.5-sonnet") {
    if (!apiKey) {
      throw new Error("OpenRouter API key is required.");
    }
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  private validateResponse(response: any, schema: object): void {
    if (!response) {
      throw new ValidationError('Empty response received');
    }
    // TODO: Add schema validation if needed for MVP
  }

  public async getChatCompletion(options: ChatCompletionOptions): Promise<string> {
    try {
      const payload = this.buildRequestPayload(options);
      const response = await this.sendRequest(payload);

      if (options.responseFormat) {
        try {
          const responseJson = JSON.parse(response);
          this.validateResponse(responseJson, options.responseFormat.json_schema.schema);
        } catch (error) {
          throw new ValidationError(`Failed to validate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return response;
    } catch (error) {
      if (error instanceof OpenRouterAPIError || error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('network')) {
        throw new NetworkError(`Failed to connect to OpenRouter API: ${error.message}`);
      }
      throw new OpenRouterAPIError(
        'Unexpected error during chat completion',
        500,
        'UNEXPECTED_ERROR'
      );
    }
  }

  private buildRequestPayload(options: ChatCompletionOptions): object {
    const messages = [
      {
        role: "system",
        content: options.systemPrompt
      },
      {
        role: "user",
        content: options.userPrompt
      }
    ];

    return {
      model: options.model || this.defaultModel,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
      response_format: options.responseFormat,
      headers: {
        "HTTP-Referer": "https://hr-helper.app",
        "X-Title": "HR Helper"
      }
    };
  }

  private async sendRequest(payload: object): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://hr-helper.app',
          'X-Title': 'HR Helper'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new OpenRouterAPIError(
          errorData.error || 'API request failed',
          response.status,
          errorData.code || 'UNKNOWN_ERROR'
        );
      }

      const responseData = await response.json() as OpenRouterResponse;
      return responseData.choices[0]?.message?.content ?? '';
    } catch (error) {
      if (error instanceof OpenRouterAPIError) {
        throw error;
      }
      if (!navigator.onLine) {
        throw new NetworkError('No internet connection');
      }
      throw new NetworkError(`Failed to send request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}