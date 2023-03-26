import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Chat from './Chat';

export default function Home() {
    library.add(fab);
    library.add(fas);
    return (
        <main className="hero min-h-screen u-center">
            <div className="hero-body u-flex-column">
                <a href="https://github.com/Spiderpig86/TimeGPT" target="_blank">
                    <button className="btn--pilled btn-dark outline font-bold u-shadow-md u-flex u-items-center">
                        <div className="w-2 mr-1">
                            <FontAwesomeIcon icon={['fab', 'github']}></FontAwesomeIcon>
                        </div>{' '}
                        Star on Github
                    </button>
                </a>
                <div className="space space--lg"></div>
                <h1 className="text-center tracking-tight u-flex u-items-center">
                    <div className="w-8 mr-1">
                        {/* <FontAwesomeIcon icon={['fas', 'clock']}></FontAwesomeIcon> */}
                        <img
                            src="https://raw.githubusercontent.com/Spiderpig86/TimeGPT/master/public/static/images/TimeGPT_Transparent_128.png"
                            alt=""
                        />
                    </div>{' '}
                    TimeGPT
                </h1>
                <p className="lead text-gray-600">
                    An AI-powered date and time converter. Enter a prompt to get started.
                </p>
                <Chat />
            </div>

            <p className="mx-4">
                Made by{' '}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/spiderpig86"
                    className="text-black font-bold u u-LR"
                >
                    Stanley Lim
                </a>
                . Powered by{' '}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://openai.com/blog/chatgpt"
                    className="text-black font-bold u u-LR"
                >
                    ChatGPT
                </a>{' '}
                and{' '}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.cirrus-ui.com/"
                    className="text-black font-bold u u-LR"
                >
                    Cirrus
                </a>
                .
            </p>
        </main>
    );
}
