import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import './Challenges.css';

const Leaderboard = ({ isDark }) => {

    const { title } = useParams();
    const [users, setUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/users/get-all-users');
            const { data } = response.data;

            // Filter out users without totalMarks
            //const usersWithTotalMarks = data.filter(user => user.totalMarks !== undefined);
            const usersWithTotalMarks = data.filter(user => user.totalMarks !== undefined && user.totalMarks !== 0);

            // Sort users by totalMarks in descending order
            const sortedUsers = usersWithTotalMarks.sort((a, b) => b.totalMarks - a.totalMarks);

            // Handle ties in total marks
            let place = 1;
            for (let i = 0; i < sortedUsers.length; i++) {
                if (i === 0 || sortedUsers[i].totalMarks < sortedUsers[i - 1].totalMarks) {
                    place = i + 1;
                }
                sortedUsers[i].place = place;
            }

            setUsers(sortedUsers);
            //setUsers(sortedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: '900', fontSize: '70px', marginTop: '50px' }}>Leaderboard</h1>
            </div>

            <div className={`card ${isDark ? 'card-dark' : 'card-light'}`} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', borderRadius: '5px', alignItems: 'center' }} >
                <div>
                    <h4 style={{ textAlign: 'center', fontWeight: '600', fontSize: '40px', marginTop: '5px' }}>{title}</h4>
                </div>
                <table className={`leaderboard-results ${isDark ? 'leaderboard-results-dark' : 'leaderboard-results-light'}`} style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th >Place</th>
                            <th >Name</th>
                            <th >Total Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{user.place}</td>
                                <td>{user.firstName}</td>
                                <td>{user.totalMarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </div>

    )
}

export default Leaderboard;
