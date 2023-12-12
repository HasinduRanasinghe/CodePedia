import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from '@nextui-org/react';
import axios from "axios";
import '../challengers-components/Challenges.css'

const ChallengeResults = ({ isDark }) => {
    const location = useLocation();
    const { challengeId, javaCode, runResult, timerDurationInMinutes, timeRemaining } = location.state;
    const [challenge, setChallenge] = useState(null);
    const [user, setUser] = useState(null);
    const [accuracyScore, setAccuracyScore] = useState(null);
    const [timeTakenScore, setTimeTakenScore] = useState(null);
    const [scoresReady, setScoresReady] = useState(false);

    const userID = localStorage.getItem("userID")

    useEffect(() => {

        // Helper function to remove white spaces from a string
        const removeWhiteSpace = (str) => str.replace(/\s/g, '');

        const fetchData = async () => {
            try {
                // Fetch the challenge by its ID
                const challengeResponse = await axios.get(`http://localhost:5000/adminApp/challengesRoutes/getById/${challengeId}`);
                const challengeData = challengeResponse.data;
                setChallenge(challengeData);

                // Fetch the user data
                const userResponse = await axios.get(`http://localhost:5000/admin/users/get-user-by-id/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
                    }
                });
                const userData = userResponse.data;
                setUser(userData.data);

                // Check if runResult and expectedOutput are defined
                if (runResult && runResult.output && challengeData.expectedOutput) {
                    // Remove white spaces from javaCode and expectedOutput
                    const cleanedJavaCode = removeWhiteSpace(runResult.output);
                    const cleanedExpectedOutput = removeWhiteSpace(challengeData.expectedOutput);

                    // Calculate accuracy score (compare cleanedJavaCode with cleanedExpectedOutput)
                    const isCodeCorrect = cleanedJavaCode === cleanedExpectedOutput;
                    setAccuracyScore(isCodeCorrect ? 1 : 0);

                    // Calculate the time taken based on timer duration and remaining time
                    const maxExecutionTime = timerDurationInMinutes * 60 * 1000; // Convert to milliseconds
                    const executionTime = maxExecutionTime - timeRemaining * 1000; // Convert timeRemaining to milliseconds

                    if (accuracyScore !== null && accuracyScore !== 0) {
                        if (executionTime <= 0.25 * maxExecutionTime) {
                            setTimeTakenScore(1.0); // Completed in 25% of the time, full marks
                        } else if (executionTime <= 0.75 * maxExecutionTime) {
                            setTimeTakenScore(0.5); // Completed in 25-75% of the time, half marks
                        } else {
                            setTimeTakenScore(1 / 3); // Completed after 75% of the time, 1/3 marks
                        }
                    } else {
                        // If the code is not correct, no time taken score
                        setTimeTakenScore(0);
                    }

                    setScoresReady(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [challengeId, runResult, timerDurationInMinutes, timeRemaining, accuracyScore]);

    const calculateTotalMarks = (accuracyScore, timeTakenScore) => {
        return (accuracyScore * 50) + (timeTakenScore * 50);
    };

    const totalMarks = calculateTotalMarks(accuracyScore, timeTakenScore);
    const updateChallengeMarks = async (userID, challengeId, totalMarks) => {
        try {
            // Make the API request to update the challenge marks
            const response = await axios.post(
                `http://localhost:5000/admin/users/save-user-score`,
                {
                    userId: userID,
                    challengeId: challengeId,
                    marks: totalMarks,
                }
            );

            if (response.status === 200) {
                console.log('Challenge marks updated successfully:', response.data);
            } else {
                console.error('Failed to update challenge marks');
            }
        } catch (error) {
            console.error('Error updating challenge marks:', error);
        }
    };

    console.log(totalMarks)

    const styles = {
        container: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center',
        },
        subTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        description: {
            fontSize: '16px',
            textAlign: 'center',
        },
    };

    return (

        <>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: '900', fontSize: '70px', marginTop: '50px' }}>Results</h1>
            </div>

            <div className={`card ${isDark ? 'card-dark' : 'card-light'}`} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', borderRadius: '5px', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h3 style={styles.subTitle}>{challenge && challenge.title}</h3>
                <table className={`leaderboard-results ${isDark ? 'leaderboard-results-dark' : 'leaderboard-results-light'}`} style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th >Name</th>
                            <th >Accuracy Score </th>
                            <th >Time Taken Score</th>
                            <th >Total Marks</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr >
                            <td>{user && user.firstName}</td>
                            <td>{accuracyScore !== null ? `${(accuracyScore * 50).toFixed(2)}%` : "Calculating..."}</td>
                            <td>{timeTakenScore !== null ? `${(timeTakenScore * 50).toFixed(2)}%` : "Calculating..."}</td>
                            <td>{totalMarks}/100</td>
                        </tr>

                    </tbody>
                </table>
                <br />
                <center>
                    <Link to={'/challenges/home'}>
                        <Button onClick={() => updateChallengeMarks(userID, challengeId, totalMarks)} style={{ zIndex: '0', backgroundColor: '#007BFF', color: isDark ? '#ffffff' : '#ffffff' }}>Go To Challenges Home</Button>
                    </Link>
                </center>
            </div>
        </>
    );
};

export default ChallengeResults;
