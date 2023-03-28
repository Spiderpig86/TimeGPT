import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Chat from './Chat';

export default function Home() {
    library.add(fab);
    library.add(fas);
    return (
        <main className="hero min-h-screen u-center px-2">
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

                <a
                    href="https://www.producthunt.com/posts/timegpt?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-timegpt"
                    target="_blank"
                >
                    <img
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386225&theme=neutral"
                        alt="TimeGPT - Streamline&#0032;your&#0032;time&#0032;and&#0032;boost&#0032;productivity&#0032;with&#0032;TimeGPT&#0046;&#0032;⚡ | Product Hunt"
                        // style="width: 250px; height: 54px;"
                        width="250"
                        height="54"
                    />
                </a>
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
            <div className="u-fixed u-bottom-0 u-right-0 pr-4 pb-4 pr-6-md pb-6-md">
                <div className="u-pull-right">
                    <a href="https://github.com/sponsors/Spiderpig86" target="_blank">
                        <button
                            className="u-round-full bg-indigo-500 u-shadow-lg tooltip font-normal"
                            data-tooltip="Feeling generous?"
                        >
                            🎁
                        </button>
                    </a>
                </div>
            </div>
        </main>
    );
}
