import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChallengesHome = ({ isDark }) => {

    const [challenges, setChallenges] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    useEffect(() => {
        getAllChallenges();
    }, []);

    const getAllChallenges = async () => {
        try {
            const response = await axios.get('http://localhost:5000/adminApp/challengesRoutes/getAll');
            const data = response.data;
            setChallenges(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to filter challenges based on selected difficulty
    const filterChallenges = () => {
        if (selectedDifficulty === 'All') {
            return challenges;
        } else {
            return challenges.filter(challenge => challenge.difficultyLevel === selectedDifficulty);
        }
    };

    return (
        <>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: '900', fontSize: '70px', marginTop: '50px' }}>Java Challenge Arena: Test Your Coding Skills!</h1>
            </div>

            <div>

                {challenges.length === 0 ? (
                    <center><p>No challenges :(</p></center>

                ) : (

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', marginBottom: '20px' }}>

                        {challenges.map((challenge) => (

                            <div key={challenge._id} style={{ width: '300px', height: '125px', cursor: 'pointer', margin: '15px', '@media (max-width: 768px)': { width: '100%' } }}>

                                <Link to={`/challenges/details/${challenge._id}`}>

                                    <div className={`card ${isDark ? 'card-dark' : 'card-light'}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            padding: '16px',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2), 12px 12px 2px 1px rgba(0, 0, 255, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
                                        }}
                                    >

                                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>{challenge.title}</h4>
                                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>{challenge.difficultyLevel}</p>

                                    </div>

                                </Link>

                            </div>

                        ))}

                    </div>
                )}

            </div>
        </>
    );
}

export default ChallengesHome;
