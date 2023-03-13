import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream';

// set limit for tokens used in GPTs response message
const maxTokens = 100;

export async function POST(req: Request) {
    const { prompt, localDateTime, apiKey } = await req.json();

    if (!prompt) {
        return new Response('No prompt in the request', { status: 400 });
    }
    if (!apiKey) {
        return new Response('Open AI API key must be provided', { status: 400 });
    }
    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: `${process.env.DATEGPT_PROMPT} ${localDateTime}. Here is the prompt: ${prompt}`,
            },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: maxTokens,
        stream: true,
        n: 1,
    };

    try {
        const stream = await OpenAIStream(payload, apiKey);
        return new Response(stream);
    } catch (err: any) {
        return new Response(err, { status: 400 });
    }
}
