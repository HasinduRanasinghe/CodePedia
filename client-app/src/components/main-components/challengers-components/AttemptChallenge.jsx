import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AceEditor from 'react-ace';
import { Icon } from '@iconify/react';
import { Button, Link } from '@nextui-org/react';
import axios from "axios";

import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-java'; // Import the mode for Java
import 'ace-builds/src-noconflict/theme-monokai'; // Import a theme
import 'ace-builds/src-noconflict/theme-chrome'; // Import a theme
import 'ace-builds/src-noconflict/theme-github'; // Import a theme
import 'ace-builds/src-noconflict/theme-github_dark'; // Import a theme
import 'ace-builds/src-noconflict/theme-xcode'; // Import a theme
import 'ace-builds/src-noconflict/theme-gruvbox_dark_hard'; // Import a theme
import 'ace-builds/src-noconflict/theme-gruvbox_light_hard'; // Import a theme
import ToastMsg from '../ToastMsg';
import './Challenges.css'

const AttemptChallenge = ({ isDark }) => {

    const { challengeId, title, description, timerDurationInMinutes } = useParams();
    const [javaCode, setJavaCode] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(timerDurationInMinutes * 60);
    const [timerExpired, setTimerExpired] = useState(false);
    const [output, setOutput] = useState('')
    const [runResult, setRunResult] = useState([])
    const [className, setClassName] = useState('')
    const [isFileCreated, setIsFileCreated] = useState(false)

    const navigate = useNavigate();
    const token = localStorage.getItem('AuthToken')
    console.log(runResult.output)

    useEffect(() => {
        // Start the timer countdown
        const timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                setTimeRemaining(timeRemaining - 1);
            } else {
                clearInterval(timerInterval); // Stop the timer when time is up
                setTimerExpired(true);
            }
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(timerInterval);
        };
    }, [timeRemaining]);

    if (!token) {

        return (

            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '8px', color: isDark ? '#000000' : '#000000' }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>Access Denied</h2>
                <p style={{
                    fontSize: '16px',
                    textAlign: 'justify'
                }}>Please log in to attempt this challenge.</p><br />

                <center>
                    <Button
                        onPress={() => {
                            navigate(`/login`);
                        }}
                        style={{ zIndex: '0', backgroundColor: '#007BFF', color: isDark ? '#ffffff' : '#ffffff' }}>OK</Button>
                </center>
            </div>
        );
    }

    // Format the remaining time as minutes and seconds
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const handleSubmitRun = async () => {
        const classNameRegex = /public class (\w+) \{/
        const match = javaCode.match(classNameRegex)

        if (match && match.length >= 2) {
            setClassName(match[1])
            setOutput(match[1])
        } else {
            setClassName('No class with a main method found.')
        }

        const data = {
            code: javaCode,
            className: match[1]
        }

        try {
            const res = await axios.post('http://localhost:5000/compiler/run', data);

            if (res.data.success) {
                setRunResult(res.data);
                setIsFileCreated(false);
                setIsFileCreated(true);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a non-2xx status code
                console.error('Server responded with an error:', error.response.data);
                setRunResult(error.response.data.error); // Set the error message in state
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
            } else {
                // Something happened in setting up the request that triggered an error
                console.error('Request setup error:', error.message);
            }
        }
    }

    return (
        <div style={{ overflow: 'hidden' }}>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: '900', fontSize: '70px', marginTop: '50px' }}>Begin Your Challenge!</h1>
            </div>

            <div className={`card ${isDark ? 'card-dark' : 'card-light'}`} style={{
                width: '100%',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
            }}>
                <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>{title}</h3>

                <p style={{
                    fontSize: '16px',
                    textAlign: 'center'
                }}>{description}</p>
            </div><br />

            <div className='text-editor-header'>
                <div>
                    <Button auto onPress={handleSubmitRun}>
                        <Icon width={20} icon="carbon:run-mirror" />&nbsp;Run
                    </Button>
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: '80vh',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: isDark ? '#1f1f1f' : '#f0f2f5',
                    alignItems: 'flex-start'
                }}>
                    <div style={{ width: '50%', height: '100%', float: 'left' }}>
                        <AceEditor
                            mode="java"
                            theme={`${isDark ? 'monokai' : 'xcode'}`}
                            name="code-editor"
                            editorProps={{ $blockScrolling: true }}
                            value={javaCode}
                            onChange={newValue => {
                                console.log('Code changed:', newValue);
                                if (!timerExpired) {
                                    // Only allow code changes if the timer hasn't expired
                                    setJavaCode(newValue);
                                }
                            }}
                            fontSize={15}
                            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                            readOnly={timerExpired}
                        />
                    </div>

                    <div style={{ width: '50%', height: '100%', float: 'left' }}>
                        <div className='compiler'>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px', borderBottom: 'solid 1px', padding: '3px' }}>
                                <Icon width={25} icon="fluent:window-console-20-filled" />&nbsp;Console
                            </div>
                            <div style={{ padding: '5px 10px', fontSize: '13px' }}>
                                {output} [JavaApplication] <br />
                            </div>
                            <div style={{ padding: '5px 10px' }}>
                                {runResult.success && <pre>{runResult.output}</pre>}
                                {runResult.success !== true && <pre>{runResult.stderr}</pre>}
                            </div>
                        </div>
                    </div>

                    {isFileCreated && <ToastMsg
                        toastMsg={`${className}.java file is created and compile successfully`}
                        isDark={isDark}
                    />}
                </div>
            </div>

            {timerExpired ? (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '8px', color: isDark ? '#000000' : '#000000' }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        textAlign: 'center'
                    }}>Time is Over</h2>
                    <p style={{
                        fontSize: '16px',
                        textAlign: 'justify'
                    }}>Your time for this challenge has expired.</p><br />

                    <center>
                        <Button
                            onPress={() => {
                                navigate(`/challenges/challengeResults`, { state: { challengeId, javaCode, runResult, timerDurationInMinutes, timeRemaining } });
                            }}
                            style={{ zIndex: '0', backgroundColor: '#007BFF', color: isDark ? '#ffffff' : '#ffffff' }}>OK</Button>
                    </center>
                </div>
            ) : (
                <div style={{
                    width: '30%',
                    height: '30%',
                    backgroundColor: isDark ? '#1f1f1f' : '#f0f2f5',
                    padding: '20px',
                    textAlign: 'center',
                    position: 'absolute',
                    bottom: '3px',
                    right: '45px',
                }}>
                    <h4>Challenge Timer</h4>
                    <p style={{ fontSize: '16px', textAlign: 'center' }}>Time Remaining: {minutes} minutes {seconds} seconds</p><br />
                    <center>
                        <Button
                            onClick={() => {
                                navigate(`/challenges/challengeResults`, { state: { challengeId, javaCode, runResult, timerDurationInMinutes, timeRemaining } });
                            }}
                            style={{ backgroundColor: '#007BFF', color: isDark ? '#ffffff' : '#ffffff' }}>Finish Attempt</Button>
                    </center>
                </div>
            )}
        </div>
    );
}

export default AttemptChallenge;
