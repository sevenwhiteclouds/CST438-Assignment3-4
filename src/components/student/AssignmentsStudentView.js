import React, {useState, useEffect} from 'react';
import Button from "@mui/material/Button";
import {SERVER_URL} from "../../Constants";


// student views a list of assignments and assignment grades
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {
    const [term, setTerm] = useState({year:'', semester:''});

    const onChange = (event) => {
        setTerm({...term, [event.target.name]:event.target.value});
    }

    function AssignmentsTable() {
        const headers = ['Course Id','Assignment Title', 'Assignment Due Date', 'Score'];
        const [ assignments, setAssignments ] = useState([]);
        const [ message, setMessage ] = useState('');

        const fetchAssignments = async () => {
            try{
                const response = await fetch(`${SERVER_URL}/assignments?studentId=3&year=${term.year}&semester=${term.semester}`);
                if (response.ok){
                    const assignments = await response.json();
                    setAssignments(assignments);
                } else {
                    const json = await response.json();
                    setMessage("response error: "+ json.message)
                }
            } catch (err) {
                setMessage("network error: "+ err);
            }
        }

        useEffect(() => {
            fetchAssignments();
        }, [term.year, term.semester])

        return (
            <table className="Center">
                <thead>
                <tr>{message}</tr>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a) => (
                    <tr key = {a.assignmentId}>
                        <td>{a.courseId}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td>{a.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );

    }

    const [showTable, setShowTable] = useState(false);


    return(
        <>
            <h3>View Assignments</h3>
            <table className="Center">
                <tbody>
                <tr>
                    <td>Year:</td>
                    <td><input type="text" id="year" name="year" value={term.year} onChange={onChange} /></td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td><input type="text" id="semester" name="semester" value={term.semester} onChange={onChange} /></td>
                </tr>
                </tbody>
            </table>
            <Button onClick={() => setShowTable(!showTable)}>Show Assignments</Button>
            {showTable && <AssignmentsTable />}
        </>
    );
}

export default AssignmentsStudentView;