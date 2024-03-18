import React, {useState, useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";
import {SERVER_URL} from "../../Constants";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import usersView from "../admin/UsersView";

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 

const AssignmentGrade = (props) => {
    const headers = ['Grade Id', 'Student Name', 'Student Email', 'Score', ''];
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    const fetchGrades = async  () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${props.assignment.id}/grades`);
            if (response.ok) {
                const grades = await response.json();
                setGrades(grades);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect( () => {
        fetchGrades();
    }, [props.assignment.id] );



    return(
        <>
            <h3>Assignment Grades</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((h,idx) => <th key={idx}>{h}</th>)}
                </tr>
                </thead>
                <tbody>
                {grades.map((g) =>
                    <tr key={g.gradeId}>
                        <td>{g.gradeId}</td>
                        <td>{g.studentName}</td>
                        <td>{g.studentEmail}</td>
                        {/*<td>{g.score}</td>*/}
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

export default AssignmentGrade;