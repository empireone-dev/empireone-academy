import { store_exam_service } from "@/app/services/exam-service";
import { router } from "@inertiajs/react";
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

const App = () => {
    const [speakingText, setSpeakingText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [answers, setAnswers] = useState({});
    const [automaticScores, setAutomaticScores] = useState({});
    const [name, setName] = useState("");
    const typingTestText =
        "The quick brown fox jumps over the lazy dog. This is a simple typing test to assess your speed and accuracy. Pay close attention to capitalization and punctuation for the best results. Practice regularly to improve your skills.";
    const [typedText, setTypedText] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [netWPM, setNetWPM] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);

    const grammarQuestions = [
        {
            id: 1,
            question:
                "Complete the sentence: 'He ___ to the store every day.' (go/goes)",
            correctAnswer: "goes",
        },
        {
            id: 2,
            question: "Correct the spelling: 'recieve'",
            correctAnswer: "receive",
        },
        {
            id: 3,
            question:
                "Choose the correct word: '___ going to the park.' (Their/They're/There)",
            correctAnswer: "They're",
        },
        {
            id: 4,
            question:
                "Correct the sentence: 'She is more taller than him.' (Provide the corrected word)",
            correctAnswer: "taller",
        },
        {
            id: 5,
            question: "Correct the spelling: ' seperate'",
            correctAnswer: "separate",
        },
        {
            id: 6,
            question:
                "Choose the correct verb tense: 'I ___ finished my homework.' (has/have)",
            correctAnswer: "have",
        },
        {
            id: 7,
            question: "Correct the spelling: 'definately'",
            correctAnswer: "definitely",
        },
        {
            id: 8,
            question:
                "Complete the sentence with the correct pronoun: 'Give it to ___.' (I/me)",
            correctAnswer: "me",
        },
        {
            id: 9,
            question: "Correct the spelling: 'occured'",
            correctAnswer: "occurred",
        },
        {
            id: 10,
            question: "Identify the plural form: 'child'",
            correctAnswer: "children",
        },
        {
            id: 11,
            question:
                "Choose the correct article: '___ apple a day keeps the doctor away.' (A/An/The)",
            correctAnswer: "An",
        },
        {
            id: 12,
            question: "Correct the spelling: 'privilege'",
            correctAnswer: "privilege",
        }, // Correctly spelled, checks attention to detail
        {
            id: 13,
            question:
                "Complete the sentence: 'She waited ___ an hour.' (for/at)",
            correctAnswer: "for",
        },
        {
            id: 14,
            question: "Correct the spelling: ' accomodate'",
            correctAnswer: "accommodate",
        },
        {
            id: 15,
            question:
                "Choose the correct form: 'The dog wagged ___ tail.' (its/it's)",
            correctAnswer: "its",
        },
    ];
    const [grammarAnswers, setGrammarAnswers] = useState({});
    const [grammarScore, setGrammarScore] = useState(null);
    const [grammarExamSubmitted, setGrammarExamSubmitted] = useState(false);
    const [encouragementMessage, setEncouragementMessage] = useState("");
    const scenario = Object.keys(answers).map((key) => ({
        id: Number(key),
        answer: answers[key],
        score: automaticScores[key] ?? 0,
    }));

    const qaInstruction =
        "For the following scenarios, please answer as if you are a Quality Assurance specialist. Your feedback should be constructive, identifying areas for improvement and suggesting best practices.";

    useEffect(() => {
        if (window.speechSynthesis) {
            setSpeechSynthesis(window.speechSynthesis);
        } else {
            console.error(
                "Speech Synthesis API not supported in this browser."
            );
        }

        return () => {
            if (speechSynthesis && speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, [speechSynthesis]);

    const speak = useCallback(
        (text) => {
            if (!speechSynthesis) {
                console.error("Speech Synthesis API not available.");
                return;
            }

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.onstart = () => {
                setIsSpeaking(true);
                setSpeakingText(text);
            };
            utterance.onend = () => {
                setIsSpeaking(false);
                setSpeakingText("");
            };
            utterance.onerror = (event) => {
                // Only log as an error if it's not a 'canceled' event, which can be intentional
                if (event.error !== "canceled") {
                    console.error("Speech synthesis error:", event.error);
                }
                setIsSpeaking(false);
                setSpeakingText("");
            };
            speechSynthesis.speak(utterance);
        },
        [speechSynthesis]
    );

    useEffect(() => {
        // Only play intro if synthesis is ready and not already speaking
        if (speechSynthesis && !isSpeaking) {
            const timeoutId = setTimeout(() => {
                speak(introScript);
            }, 500); // Small delay to ensure synthesis is ready
            return () => clearTimeout(timeoutId);
        }
    }, [speechSynthesis, speak]);

    const stopSpeaking = useCallback(() => {
        if (speechSynthesis && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
            setSpeakingText("");
        }
    }, [speechSynthesis]);

    const modelAnswers = {
        1: {
            // Scenario 1: Return Request, Wrong Account
            keywords: [
                "verify",
                "confirmation",
                "account",
                "identity",
                "name spelling",
                "double-check",
                "customer details",
                "cross-reference",
            ],
            minWords: 10, // Minimum number of words for a reasonable answer
        },
        2: {
            // Scenario 2: Angry Customer, Poor Response
            keywords: [
                "de-escalate",
                "empathy",
                "apologize",
                "listen",
                "acknowledge",
                "calm",
                "solution",
                "supervisor protocol",
                "frustration",
                "professional",
            ],
            minWords: 15,
        },
        3: {
            // Scenario 3: Supervisor Request, Premature Identification
            keywords: [
                "verify identity",
                "authenticate",
                "security protocol",
                "data privacy",
                "ask for details",
                "before accessing",
                "confirm information",
                "premature",
            ],
            minWords: 12,
        },
        4: {
            // Scenario 4: Incorrect Order Entry
            keywords: [
                "read back",
                "confirm order",
                "verify item",
                "repeat details",
                "double-check",
                "customer confirmation",
                "accuracy",
                "item code",
            ],
            minWords: 10,
        },
        5: {
            // Scenario 5: Cancellation Misstep
            keywords: [
                "confirm specific item",
                "clarify",
                "paraphrase",
                "active listening",
                "verify before action",
                "apologize",
                "re-process",
                "do not hang up",
                "ownership",
            ],
            minWords: 15,
        },
    };

    const assessAnswer = useCallback(
        (scenarioId) => {
            const userAnswer = answers[scenarioId] || "";
            const model = modelAnswers[scenarioId];

            if (!userAnswer.trim()) {
                setAutomaticScores((prev) => ({
                    ...prev,
                    [scenarioId]: "N/A",
                }));
                return;
            }

            const words = userAnswer
                .split(/\s+/)
                .filter((word) => word.length > 0).length;

            // Simple scoring for very short answers
            if (words > 0 && words < 20) {
                setAutomaticScores((prev) => ({ ...prev, [scenarioId]: 5 }));
                return;
            }

            const lowerCaseAnswer = userAnswer.toLowerCase();
            let rawScore = 0;
            const maxScorePerKeyword = 1.5;
            const baseScore = 3; // Starting score for any coherent answer

            let matchedKeywords = 0;
            model.keywords.forEach((keyword) => {
                if (lowerCaseAnswer.includes(keyword.toLowerCase())) {
                    matchedKeywords++;
                }
            });

            rawScore += baseScore;
            rawScore += matchedKeywords * maxScorePerKeyword;

            // Add bonus for meeting or exceeding minimum word count
            if (words >= model.minWords) {
                rawScore += 1;
            } else if (words > model.minWords / 2) {
                rawScore += 0.5;
            }

            // Clamp the score between 1 and 10
            rawScore = Math.max(1, rawScore);
            rawScore = Math.min(10, rawScore);

            // Adjust to a 1-10 scale where 7 is a good starting point for matching some keywords
            // This makes the scoring more lenient for partial matches
            const finalScore = ((rawScore - 1) / 9) * 3 + 7; // Maps 1-10 to 7-10 (approx)
            setAutomaticScores((prev) => ({
                ...prev,
                [scenarioId]: Math.round(finalScore),
            }));
        },
        [answers, modelAnswers]
    );

    const handleAnswerChange = useCallback((scenarioId, text) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [scenarioId]: text,
        }));
        // Clear automatic score when user modifies answer
        setAutomaticScores((prevScores) => {
            const newScores = { ...prevScores };
            delete newScores[scenarioId];
            return newScores;
        });
    }, []);
    const startTypingTest = useCallback(() => {
        if (!testStarted) {
            setStartTime(Date.now());
            setTestStarted(true);
            setTestCompleted(false);
            setTypedText("");
            setWpm(0);
            setAccuracy(0);
            setNetWPM(0);
        }
    }, [testStarted]);

    const calculateResults = useCallback(
        (currentTypedText, startTs, endTs) => {
            const wordsTyped = currentTypedText
                .split(" ")
                .filter((word) => word.length > 0);

            let correctCharacters = 0;
            let errors = 0;

            for (let i = 0; i < currentTypedText.length; i++) {
                if (i < typingTestText.length) {
                    if (currentTypedText[i] === typingTestText[i]) {
                        correctCharacters++;
                    } else {
                        errors++;
                    }
                } else {
                    errors++; // Extra characters typed
                }
            }
            // Account for untyped characters (missed words)
            errors += Math.max(
                0,
                typingTestText.length - currentTypedText.length
            );

            let timeElapsedInMinutes = 0;
            if (startTs && endTs) {
                timeElapsedInMinutes = (endTs - startTs) / 60000; // Convert ms to minutes
            }
            console.log(
                "calculateResults - startTs:",
                startTs,
                "endTs:",
                endTs,
                "timeElapsedInMinutes:",
                timeElapsedInMinutes
            );

            const grossWPM =
                timeElapsedInMinutes > 0
                    ? currentTypedText.length / 5 / timeElapsedInMinutes
                    : 0;
            const calculatedAccuracy =
                typingTestText.length > 0
                    ? ((typingTestText.length - errors) /
                          typingTestText.length) *
                      100
                    : 0;
            const calculatedNetWPM = Math.max(
                0,
                grossWPM -
                    errors /
                        5 /
                        (timeElapsedInMinutes > 0 ? timeElapsedInMinutes : 1)
            );

            setWpm(grossWPM.toFixed(0));
            setAccuracy(Math.max(0, calculatedAccuracy).toFixed(2)); // Ensure accuracy doesn't go below 0
            setNetWPM(calculatedNetWPM.toFixed(0));
        },
        [typingTestText]
    );

    const handleTypingChange = useCallback(
        (e) => {
            const currentTypedText = e.target.value;
            setTypedText(currentTypedText);

            let actualStartTime = startTime;

            if (!testStarted) {
                actualStartTime = Date.now();
                setStartTime(actualStartTime);
                setTestStarted(true);
                console.log("Test Started: startTime =", actualStartTime);
            }

            if (testStarted || currentTypedText.length > 0) {
                const currentTime = Date.now();
                if (
                    currentTypedText.length >= typingTestText.length &&
                    !testCompleted
                ) {
                    setEndTime(currentTime);
                    setTestCompleted(true);
                    calculateResults(
                        currentTypedText,
                        actualStartTime,
                        currentTime
                    );
                    console.log(
                        "Test Completed: typedText length =",
                        currentTypedText.length,
                        "typingTestText length =",
                        typingTestText.length
                    );
                } else if (actualStartTime !== null) {
                    const timeElapsedInMinutes =
                        (currentTime - actualStartTime) / 60000;
                    if (timeElapsedInMinutes > 0) {
                        const currentGrossWPM =
                            currentTypedText.length / 5 / timeElapsedInMinutes;

                        let tempCorrectChars = 0;
                        let tempErrors = 0;
                        for (let i = 0; i < currentTypedText.length; i++) {
                            if (i < typingTestText.length) {
                                if (currentTypedText[i] === typingTestText[i]) {
                                    tempCorrectChars++;
                                } else {
                                    tempErrors++;
                                }
                            } else {
                                tempErrors++;
                            }
                        }
                        tempErrors += Math.max(
                            0,
                            typingTestText.substring(0, currentTypedText.length)
                                .length - tempCorrectChars
                        );

                        const currentAccuracy =
                            currentTypedText.length > 0
                                ? (tempCorrectChars / currentTypedText.length) *
                                  100
                                : 0;
                        const currentNetWPM = Math.max(
                            0,
                            currentGrossWPM -
                                tempErrors / 5 / timeElapsedInMinutes
                        );

                        setWpm(currentGrossWPM.toFixed(0));
                        setAccuracy(currentAccuracy.toFixed(2));
                        setNetWPM(currentNetWPM.toFixed(0));
                    }
                }
            }
        },
        [
            typingTestText,
            testStarted,
            testCompleted,
            startTime,
            calculateResults,
        ]
    );

    const resetTypingTest = useCallback(() => {
        setTypedText("");
        setStartTime(null);
        setEndTime(null);
        setWpm(0);
        setAccuracy(0);
        setNetWPM(0);
        setTestStarted(false);
        setTestCompleted(false);
    }, []);

    const handleGrammarAnswerChange = useCallback((questionId, text) => {
        setGrammarAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: text,
        }));
    }, []);

    async function submit_data(payload) {
        console.log('payload',payload)
        try {
            const res = await store_exam_service(payload);
            Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            window.location.reload();
            return res;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Please complete the form.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
    const submitGrammarExam = useCallback(() => {
        let correctCount = 0;
        const grammarDetails = {};

        grammarQuestions.forEach((q) => {
            const userAnswer = (grammarAnswers[q.id] || "")
                .trim()
                .toLowerCase();
            const correctAnswer = q.correctAnswer.trim().toLowerCase();
            const isCorrect = userAnswer === correctAnswer;

            grammarDetails[q.id] = {
                question: q.question,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                score: isCorrect ? 1 : 0,
            };

            if (isCorrect) correctCount += 1;
        });
        const payload = {
            name: name, //--done
            start_time: startTime,
            end_time: endTime,
            typing_test: {
                word_per_minute: wpm, //--done
                net_word_per_minute: netWPM, //--done
                accuracy: accuracy, //--done
                sentence: typedText, //--done
            }, //--done
            scenario, //--done
            grammar_and_spelling: {
                ...grammarDetails, //--done
            }, //--done
        };
        console.log("payload", payload);
        // let correctCount = 0;

        submit_data(payload);

        // setGrammarScore(correctCount);
        // setGrammarExamSubmitted(true);
        // const spokenMessage = `Good luck with your journey, and keep up the great work!`;
        // setEncouragementMessage(
        //     `You scored ${correctCount} out of ${grammarQuestions.length}. ${spokenMessage}`
        // );
        // speak(spokenMessage);
    }, [grammarAnswers, grammarQuestions, speak]);

    const resetGrammarExam = useCallback(() => {
        setGrammarAnswers({});
        setGrammarScore(null);
        setGrammarExamSubmitted(false);
        setEncouragementMessage("");
    }, []);

    const scenarios = [
        {
            id: 1,
            duration: "~1 minute",
            dialogue: `Customer: “Hi, I’d like to return a damaged item I received.” Agent: “I’m so sorry to hear that, I’ll help you right away. May I have your full name?” Customer: “Adam Smith.” Agent: “Thank you, Adam. I’ve processed your return. You’ll receive confirmation shortly.” Agent processed it under John Smith’s account.`,
            prompt: "What was missed during the call?",
        },
        {
            id: 2,
            duration: "~1 minute",
            dialogue: `Customer: “I need to speak to a supervisor now. Your service is awful.” Agent (irritated): “Well maybe if you didn’t talk like that, someone would help you. You’ll just have to wait.”`,
            prompt: "What should be the correct way to handle the customer?",
        },
        {
            id: 3,
            duration: "~1 minute",
            dialogue: `Customer: “I want a supervisor. The last agent was rude and didn’t even listen.” Agent: “I’m sorry, May Adams. I’ll get a supervisor on the line for you.” Customer: “Wait—how do you know my name? I haven’t given you any details yet.”`, // Updated dialogue for Scenario 3
            prompt: "What was the error and how should the agent have handled it?",
        },
        {
            id: 4,
            duration: "~1 minute",
            dialogue: `Customer: “I’d like to order item 12345ABC.” Agent: “Got it—12345ABC. I’ve placed that order for you.” But agent actually entered 12345ADC in the system.`,
            prompt: "What was incorrect in the call?",
        },
        {
            id: 5,
            duration: "~1 minute",
            dialogue: `Customer: “Hi, I want to cancel one item from my order of four.” Agent: “No problem. Let me verify your account.” Agent: “Done. I’ve cancelled all four items.” Customer: “What? I only wanted to cancel one!” Agent (panicked): hangs up`,
            prompt: "What’s the correct way to handle the situation?",
        },
    ];

    const introScript =
        "Welcome to EmpireOne Academy. The following recordings are part of your assessment. As a future Customer Experience Specialist, you will be asked to review each call and identify missed opportunities or recommend the proper response. Please listen carefully and reflect on what could have been improved in each interaction.";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter text-gray-800">
            {/* Main Container */}
            <div className="container mx-auto max-w-4xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
                <h1 className="text-4xl md:text-5xl font-extrabold flex items-center justify-center text-center text-indigo-700 mb-8">
                    <img src="/images/logo.png" className="w-96" />
                </h1>
                <input
                    onChange={(e) => setName(e.target.value)}
                    className="w-full my-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 resize-y text-base"
                    placeholder="Fullname (Juan Dela Cruz)"
                />
                {/* Stop Speaking Button */}
                {isSpeaking && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                        <button
                            onClick={stopSpeaking}
                            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                                />
                            </svg>
                            <span>Stop Current Audio</span>
                        </button>
                    </div>
                )}

                {/* Intro Script Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-blue-800 mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 mr-3 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Intro Script{" "}
                        <span className="ml-2 text-base font-normal text-blue-600">
                            (30 seconds)
                        </span>
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6 italic">
                        "{introScript}"
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => speak(introScript)}
                            disabled={
                                isSpeaking && speakingText === introScript
                            }
                            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform ${
                                isSpeaking && speakingText === introScript
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105"
                            } flex items-center space-x-2`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Play Intro</span>
                        </button>
                    </div>
                </div>

                {/* QA Instruction Section */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-green-800 mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 mr-3 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        How to Answer Scenarios
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6 italic">
                        "{qaInstruction}"
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => speak(qaInstruction)}
                            disabled={
                                isSpeaking && speakingText === qaInstruction
                            }
                            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform ${
                                isSpeaking && speakingText === qaInstruction
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : "bg-green-600 text-white shadow-lg hover:bg-green-700 hover:scale-105"
                            } flex items-center space-x-2`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Play Instructions</span>
                        </button>
                    </div>
                </div>

                {/* Scenarios Section */}
                <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6 mt-10">
                    Assessment Scenarios
                </h2>
                <div className="grid grid-cols-1 gap-8">
                    {scenarios.map((scenario) => (
                        <div
                            key={scenario.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 mr-3 text-purple-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.75 17L9 20l-1 1h4a2 2 0 002-2v-3a2 2 0 00-2-2h-2z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Scenario {scenario.id}:{" "}
                                <span className="ml-2 text-base font-normal text-gray-500">
                                    ({scenario.duration})
                                </span>
                            </h3>

                            {/* Dialogue Section */}
                            <div className="mb-6">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    Listen to the Dialogue:
                                </h4>
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => speak(scenario.dialogue)}
                                        disabled={
                                            isSpeaking &&
                                            speakingText.includes(
                                                scenario.dialogue
                                            )
                                        }
                                        className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-300 transform ${
                                            isSpeaking &&
                                            speakingText.includes(
                                                scenario.dialogue
                                            )
                                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                : "bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:scale-105"
                                        } flex items-center space-x-2`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>Play Dialogue</span>
                                    </button>
                                </div>
                            </div>

                            {/* Prompt Section */}
                            <div className="mb-6">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    Prompt:
                                </h4>
                                <p className="text-lg leading-relaxed text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-100 italic">
                                    "{scenario.prompt}"
                                </p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => speak(scenario.prompt)}
                                        disabled={
                                            isSpeaking &&
                                            speakingText.includes(
                                                scenario.prompt
                                            )
                                        }
                                        className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-300 transform ${
                                            isSpeaking &&
                                            speakingText.includes(
                                                scenario.prompt
                                            )
                                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                : "bg-teal-600 text-white shadow-md hover:bg-teal-700 hover:scale-105"
                                        } flex items-center space-x-2`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>Play Prompt</span>
                                    </button>
                                </div>
                            </div>

                            {/* Your Answer Section */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    Your Answer:
                                </h4>
                                <textarea
                                    value={answers[scenario.id] || ""}
                                    onChange={(e) => {
                                        handleAnswerChange(
                                            scenario.id,
                                            e.target.value
                                        );
                                        assessAnswer(scenario.id);
                                    }}
                                    placeholder="Type your answer here, reflecting on improvements or correct responses..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 resize-y text-base"
                                    rows="5"
                                ></textarea>
                                {/* <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() =>
                                            assessAnswer(scenario.id)
                                        }
                                        disabled={
                                            !answers[scenario.id] || isSpeaking
                                        }
                                        className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-300 transform ${
                                            !answers[scenario.id] || isSpeaking
                                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                : "bg-green-600 text-white shadow-md hover:bg-green-700 hover:scale-105"
                                        } flex items-center space-x-2`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>Get Automatic Score</span>
                                    </button>
                                </div> */}
                                {/* {automaticScores[scenario.id] !== undefined && (
                                    <p className="mt-4 text-center text-lg font-bold text-green-700">
                                        Automatic Score:{" "}
                                        {automaticScores[scenario.id]}/10
                                    </p>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="my-10 border-t-2 border-indigo-200" />

                {/* Typing Speed Assessment */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm mt-8">
                    <h2 className="text-3xl font-bold text-blue-800 mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 mr-3 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                        Typing Speed Assessment
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 mb-4">
                        Test your typing speed and accuracy below! Type the
                        given text into the box. The timer starts when you begin
                        typing.
                    </p>
                    <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-inner">
                        <p className="text-xl leading-relaxed text-gray-900 font-mono">
                            {typingTestText.split("").map((char, index) => {
                                let color = "text-gray-900";
                                if (index < typedText.length) {
                                    color =
                                        typedText[index] === char
                                            ? "text-green-600"
                                            : "text-red-600";
                                } else if (testStarted && !testCompleted) {
                                    // Highlight the next character to type
                                    if (index === typedText.length) {
                                        color = "bg-yellow-200 rounded";
                                    }
                                }
                                return (
                                    <span key={index} className={`${color}`}>
                                        {char}
                                    </span>
                                );
                            })}
                        </p>
                    </div>
                    <textarea
                        value={typedText}
                        onChange={handleTypingChange}
                        placeholder="Start typing here..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 resize-y text-lg font-mono"
                        rows="6"
                        disabled={testCompleted}
                    ></textarea>
                    <div className="mt-6 text-center">
                        {testCompleted ? (
                            <div className="flex flex-col items-center space-y-4">
                                <h3 className="text-2xl font-bold text-indigo-700">
                                    Results:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
                                    <div className="bg-green-100 p-4 rounded-lg shadow-sm">
                                        <p className="text-green-800 text-sm font-semibold">
                                            Gross WPM
                                        </p>
                                        <p className="text-3xl font-extrabold text-green-700">
                                            {wpm}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                                        <p className="text-blue-800 text-sm font-semibold">
                                            Accuracy
                                        </p>
                                        <p className="text-3xl font-extrabold text-blue-700">
                                            {accuracy}%
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
                                        <p className="text-purple-800 text-sm font-semibold">
                                            Net WPM
                                        </p>
                                        <p className="text-3xl font-extrabold text-purple-700">
                                            {netWPM}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={resetTypingTest}
                                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 12c0 2.21.81 4.201 2.186 5.794a4.008 4.008 0 00-.549-.446m0 0H9m-6 0h.083m0 0H7.5M20 12c0-2.21-.81-4.201-2.186-5.794a4.007 4.007 0 00-2.342-.885M16 4v5h.582"
                                        />
                                    </svg>
                                    <span>Retake Test</span>
                                </button>
                            </div>
                        ) : (
                            <p className="text-xl font-medium text-gray-600">
                                Type the text above to start the test...
                            </p>
                        )}
                    </div>
                </div>

                <hr className="my-10 border-t-2 border-indigo-200" />

                {/* Grammar and Spelling Exam */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm mt-8">
                    <h2 className="text-3xl font-bold text-blue-800 mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 mr-3 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                        Grammar and Spelling Exam
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Answer the following 15 grammar and spelling questions.
                    </p>

                    {!grammarExamSubmitted ? (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {grammarQuestions.map((q, index) => (
                                    <div
                                        key={q.id}
                                        className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                                    >
                                        <p className="text-lg font-semibold text-gray-800 mb-2">
                                            {index + 1}. {q.question}
                                        </p>
                                        <input
                                            type="text"
                                            value={grammarAnswers[q.id] || ""}
                                            onChange={(e) =>
                                                handleGrammarAnswerChange(
                                                    q.id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Your answer here..."
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 text-base"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={submitGrammarExam}
                                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>Submit Exam</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
                            <h3 className="text-2xl font-bold text-green-700 mb-4">
                                Exam Results!
                            </h3>
                            <p className="text-4xl font-extrabold text-green-800 mb-2">
                                Your Score: {grammarScore} /{" "}
                                {grammarQuestions.length}
                            </p>
                            {encouragementMessage && (
                                <p className="text-xl font-medium text-blue-700 mb-6">
                                    {encouragementMessage}
                                </p>
                            )}
                            <button
                                onClick={resetGrammarExam}
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 12c0 2.21.81 4.201 2.186 5.794a4.008 4.008 0 00-.549-.446m0 0H9m-6 0h.083m0 0H7.5M20 12c0-2.21-.81-4.201-2.186-5.794a4.007 4.007 0 00-2.342-.885M16 4v5h.582"
                                    />
                                </svg>
                                <span>Retake Exam</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-sm mt-12">
                    Note: Audio playback quality may vary based on your
                    browser's text-to-speech engine. Automatic scoring for
                    scenarios and the grammar exam is based on predefined
                    criteria, serving as a guideline.
                </p>
            </div>
        </div>
    );
};

export default App;
