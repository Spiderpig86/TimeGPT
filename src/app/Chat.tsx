'use client';

import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

export default function Chat() {
    library.add(fab);
    library.add(fas);

    const [isLoading, setIsLoading] = useState(false);
    const [generatedReply, setGeneratedReply] = useState('');
    const [prompt, setPrompt] = useState('');
    const [promptInput, setPromptInput] = useState('');
    const [apiKey, setApiKey] = useState(``);
    const [modalVisible, setModalVisible] = useState(false);

    const keyModal = useMemo(
        () => (
            <div
                className={`modal modal-large modal-animated--zoom-in ${modalVisible ? `modal--visible` : ``}`}
                id="basic-modal"
            >
                <a
                    onClick={() => setModalVisible(false)}
                    className="modal-overlay close-btn"
                    href="#"
                    aria-label="Close"
                />
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="u-flex u-items-center u-justify-space-between mb-2">
                            <div className="tracking-tight">
                                <h6 className="m-0">Enter OpenAI Key</h6>
                            </div>
                            <a onClick={() => setModalVisible(false)} className="" aria-label="Close">
                                <FontAwesomeIcon icon={['fas', 'close']}></FontAwesomeIcon>
                            </a>
                        </div>
                        <p>Enter your OpenAI secret key.</p>
                        <div className="form-group">
                            <input
                                className="form-group-input"
                                type="text"
                                placeholder="OpenAI key..."
                                defaultValue={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                }}
                            />
                            <button
                                className="form-group-btn btn-primary"
                                onClick={(e) => {
                                    setModalVisible(false);
                                }}
                            >
                                Set
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ),
        [modalVisible]
    );

    const generateReply = async (e: any) => {
        e.preventDefault();

        if (!promptInput || promptInput.trim().length === 0) {
            console.error('Must provide a prompt');
            alert('Must provide a prompt');
            return;
        }

        if (!apiKey || apiKey.trim().length === 0) {
            console.error('Must provide OpenAI API key');
            alert('Must provide OpenAI API key');
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
                apiKey: apiKey,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            setIsLoading(false);
            setPrompt(promptInput);
            setGeneratedReply(error);
            
            // throw new Error(response.statusText);
            return;
        }

        setPrompt(promptInput);
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
            {keyModal}
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
            {!apiKey && (
                <div className="u-border-1 border-red-300 bg-red-200 u-round-md p-2">
                    Please set your Open AI key before continuing.{' '}
                    <button className="btn-primary btn--sm m-0 ml-2" onClick={(e) => setModalVisible(true)}>
                        Set API Key
                    </button>
                </div>
            )}
            <div className="u-flex w-100p max-w-md flex-col u-gap-2">
                {isLoading ? (
                    <div className="u-center animated loading p-1"></div>
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
