import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Button from "@mui/material/Button";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {confirmAlert} from "react-confirm-alert";
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentAdd from "./AssignmentAdd";
import AssignmentGrade from "./AssignmentGrade";
import {SERVER_URL} from "../../Constants";


// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const [assignments, setAssignments] = useState( [] );

    const [message, setMessage] = useState('');

    const [showGrades, setShowGrades] = useState(false);

    const [currentAssignment, setCurrentAssignment] = useState(null);

    const location = useLocation();
    const {secNo} = location.state;

    const headers = ['Assignment Id', 'Title', 'Due Date', '', '', ''];

    const fetchAssignments = async () => {
        if (!secNo) return;
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok) {
                const assignments = await response.json();
                setAssignments(assignments);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error " + err);
        }

    }

    useEffect( () => {
        fetchAssignments();
    }, [secNo] );

    const deleteAlert = (event) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => doDelete(event)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const doDelete = (event) => {
        const row_index = event.target.parentNode.parentNode.rowIndex -1;
        deleteAssignment(assignments[row_index].id);
    }

    const deleteAssignment = async (id) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage("Delete failed" + rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    const onSave = async (assignment) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                setMessage("Assignment saved")
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    const addAssignment = async (assignment) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                setMessage("Assignment added")
                fetchAssignments();
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
            <h3> Assignment Catalog </h3>
            <h4>{message}</h4>

            {showGrades
                ? <div>
                    <Button onClick={() => {
                        setShowGrades(!showGrades);
                        setCurrentAssignment(null);
                    }}>Back</Button>
                    <AssignmentGrade assignment={currentAssignment}/>
                </div>
                : <div><table className="Center">
                    <thead>
                    <tr>
                        {headers.map((h,idx) => <th key={idx}>{h}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.map((assignment) =>
                        <tr key={assignment.id}>
                            <td>{assignment.id}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.dueDate}</td>
                            <td><AssignmentUpdate assignment={assignment} save={onSave}/></td>
                            <td><Button onClick={deleteAlert}>Delete</Button></td>
                            {/*<td><AssignmentGrade assignment={assignment}/></td>*/}
                            <td><Button onClick={() => {
                                setShowGrades(!showGrades);
                                setCurrentAssignment(assignment);
                            }}>Show Grades</Button></td>
                        </tr>

                    )}
                    </tbody>
                </table>
                <AssignmentAdd exampleAssignment={assignments[0]} save={addAssignment}/> </div>
            }
        </>
    );
}

export default AssignmentsView;
