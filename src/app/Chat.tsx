'use client';

import { useState } from 'react';

export default function Chat() {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedReply, setGeneratedReply] = useState('');
    const [prompt, setPrompt] = useState('');
    const [promptInput, setPromptInput] = useState('');

    const generateReply = async (e: any) => {
        e.preventDefault();

        if (!promptInput || promptInput.trim().length === 0) {
            console.error('Must provide a prompt');
            alert('Must provide a prompt');
            return;
        }

        setIsLoading(true);
        setGeneratedReply('');
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `${promptInput}`,
                localDateTime: new Date().toLocaleString(),
            }),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        setPrompt(promptInput);
        setPromptInput('');
        setIsLoading(false);

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();

        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedReply((prev) => prev + chunkValue);
        }
    };

    return (
        <div className="u-flex u-flex-column u-items-center u-justify-center w-100p">
            <div className="form-group w-100p w-70p-md max-w-sm u-shadow-sm mb-4">
                <input
                    className="form-group-input"
                    placeholder="e.g. When is 2 weeks from now?"
                    type="text"
                    name="promptInput"
                    onChange={(e) => setPromptInput(e.target.value)}
                    value={promptInput}
                    onKeyUp={(e) => {
                        if (e.key === `Enter`) {
                            generateReply(e);
                        }
                    }}
                />
            </div>
            <div className="u-flex w-100p max-w-md flex-col u-gap-2">
                {isLoading ? (
                    <div className="u-center animated loading p-1">
                    </div>
                ) : (
                    prompt && (
                        <div className="w-100p u-text-center p-4 u-round-sm u-shadow-sm bg-white u-bg-opacity-60">
                            <p className="text-gray-700 text-lg m-0">{generatedReply}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
