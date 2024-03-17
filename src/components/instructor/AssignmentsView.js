import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import Button from "@mui/material/Button";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {confirmAlert} from "react-confirm-alert";
import AssignmentUpdate from './AssignmentUpdate';
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

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const headers = ['Assignment Id', 'Title', 'Due Date', 'Course Id', 'Section Id', 'Section Number', '', ''];

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
    }, [] );

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
        // const assignments_copy = assignments.filter((assignment, idx) => idx!==row_index);
        // setAssignments(assignments_copy);
        // setMessage('Assignment Deleted');
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

    // const onSave = (assignment) => {
    //     const assignment_copy = assignments.map((a) => (a.id===assignment.id) ? assignment : a);
    //     setAssignments(assignment_copy);
    //     setMessage("Assignment saved");
    // }

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
     
    return(
        <> 
           <h3> Assignment Catalog </h3>
           <h4>{message}</h4>
           <table className="Center">
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
                           <td>{assignment.courseId}</td>
                           <td>{assignment.secId}</td>
                           <td>{assignment.secNo}</td>
                           <td><AssignmentUpdate assignment={assignment} save={onSave}/></td>
                           <td><Button onClick={deleteAlert}>Delete</Button></td>
                       </tr>
                   )}
               </tbody>
           </table>

        </>
    );
}

export default AssignmentsView;
