import React, {useState, useEffect} from 'react';
import {SERVER_URL_8081} from "../../Constants";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

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
            const response = await fetch(`${SERVER_URL_8081}/assignments/${props.assignment.id}/grades`);
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

    const onScoreChange = (event, gradeId) => {

        // Ensures input is in range of 0 - 100; Consider cleaning this up
        if (event.target.value > 100) {
            setGrades(grades.map(grade =>
                grade.gradeId === gradeId ? {...grade, score: 100} : grade))
        } else if (event.target.value < 0) {
            setGrades(grades.map(grade =>
                grade.gradeId === gradeId ? {...grade, score: 0} : grade))
        } else {
            setGrades(grades.map(grade =>
                grade.gradeId === gradeId ? {...grade, score: event.target.value} : grade))
        }

    }

    const onSave = async () => {
        saveGrade(grades);
    }

    const saveGrade = async (grades) => {
        try {
            const response = await fetch (`${SERVER_URL_8081}/grades`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(grades),
                });
            if (response.ok) {
                setMessage("Grade saved");
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    return(
        <>
            <h3>Assignment Grades</h3>
            <h4 id="addMessage">{message}</h4>
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
                        <td>
                            <input id="scoreInput" type="number" name="score" min="0" max="100" value={(g.score === null) ? '' : g.score} onChange={(event) => onScoreChange(event, g.gradeId)} />
                        </td>
                        <td>
                        <DialogActions>
                            <Button id="updateButton" onClick={onSave}>Update</Button>
                        </DialogActions>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

export default AssignmentGrade;