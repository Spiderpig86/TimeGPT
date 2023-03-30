'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Mutex, tryAcquire } from 'async-mutex';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

const mutex = new Mutex();

export default function Chat() {
    library.add(fab);
    library.add(fas);

    const prompts = [
        `What time is it in Paris?`,
        `What is 5 months and 2 weeks from now?`,
        `What date is 8 months ago?`,
        `When is 3 weeks, 12 hours, and 43 minutes after January 19th, 2038?`,
        `How many days until New Years Eve?`,
        `How many days until Summer?`,
    ];

    const [isLoading, setIsLoading] = useState(false); // Display spinner
    const [generatedReply, setGeneratedReply] = useState('');
    const [prompt, setPrompt] = useState('');
    const [promptInput, setPromptInput] = useState('');
    const [apiKey, setApiKey] = useState(``);
    const [modalVisible, setModalVisible] = useState(false);

    const isKeyValid = (key: string) => {
        return key.startsWith(`sk-`);
    };

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
                        <p>Enter your OpenAI API key.</p>
                        <div className="form-group">
                            <input
                                className="form-group-input"
                                type="text"
                                placeholder="Your API key"
                                defaultValue={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                }}
                            />
                            <button
                                className="form-group-btn btn-primary"
                                onClick={(e) => {
                                    if (!isKeyValid(apiKey)) {
                                        alert(`Please enter a valid API key`);
                                        return;
                                    }

                                    setModalVisible(false);
                                }}
                            >
                                Set Key
                            </button>
                        </div>
                        <span className="info">
                            Don&apos;t have one? Sign up for an account{' '}
                            <a
                                className="u u-LR"
                                href="https://chat.openai.com/auth/login?next=/chat"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                here
                            </a>
                            .
                        </span>
                    </div>
                </div>
            </div>
        ),
        [modalVisible, apiKey]
    );

    const generateReplySync = async (e: any, p?: string) => {
        try {
            await tryAcquire(mutex).runExclusive(async () => await generateReply(e, p));
        } catch (e) {
            // Ignore already running process
        }
    };

    const generateReply = async (e: any, p?: string) => {
        e.preventDefault();

        if (!p && (!promptInput || promptInput.trim().length === 0)) {
            console.error('Must provide a prompt');
            alert('Must provide a prompt');
            return;
        }

        if (!process.env.NEXT_PUBLIC_AUTO_SET_KEY && (!apiKey || apiKey.trim().length === 0)) {
            console.error('Must provide OpenAI API key');
            alert('Must provide OpenAI API key');
            return;
        }
        setPromptInput(p as string);

        setIsLoading(true);
        setGeneratedReply('');

        const dateTime = new Date().toString();
        const timezoneRegex = /GMT([\-\+]?\d{4})/;
        const timeZone = timezoneRegex.exec(dateTime)![1];

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `${p ?? promptInput}`,
                localDateTime: `${new Date().toLocaleString()} and timezone ${timeZone}`,
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

        setPrompt(p ?? promptInput);
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
        <div className="u-flex u-flex-column u-items-center u-justify-center w-100p px-2">
            {!process.env.NEXT_PUBLIC_AUTO_SET_KEY && keyModal}
            <div className="form-group w-100p w-70p-md max-w-sm u-shadow-sm mb-4">
                <input
                    className="form-group-input"
                    placeholder="e.g. When is 2 weeks from now?"
                    type="text"
                    name="promptInput"
                    onChange={(e) => setPromptInput(e.target.value)}
                    value={promptInput ?? ``}
                    onKeyUp={(e) => {
                        if (e.key === `Enter`) {
                            generateReplySync(e);
                        }
                    }}
                />
            </div>
            {!process.env.NEXT_PUBLIC_AUTO_SET_KEY && (!apiKey || !isKeyValid(apiKey)) && (
                <div className="u-border-1 border-red-300 bg-red-200 u-round-md p-2">
                    Please set your OpenAI key before continuing.{' '}
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

            {(process.env.NEXT_PUBLIC_AUTO_SET_KEY || (apiKey && isKeyValid(apiKey))) && (
                <div className="my-2 max-w-sm">
                    <p className="text-sm text-gray-700 mb-0 u-text-center">
                        Not sure what to ask? Try the following prompts.
                    </p>
                    <div className="row">
                        {prompts.map((p, i) => (
                            <div className="col-6 mb-1" key={i}>
                                <div
                                    className="u-round-md bg-white u-bg-opacity-50 px-2 py-1 u-shadow-xs hover-grow"
                                    onClick={(e) => {
                                        setTimeout(() => {
                                            generateReplySync(e, p);
                                        }, 200);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <p className="suggestion m-0 text-sm u-overflow-hidden u-flex-nowrap">{p}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
