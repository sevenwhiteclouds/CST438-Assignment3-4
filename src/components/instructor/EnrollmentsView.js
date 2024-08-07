import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL} from "../../Constants";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

// instructor view list of students enrolled in a section
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {

    const headers = ['Enrollment ID', 'Student ID', 'Name', 'Email', 'Grade']
    const location = useLocation();
    const {secNo} = location.state;
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const jwt = sessionStorage.getItem("jwt");

    const fetchEnrollments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`, {headers: {"Authorization": jwt}});
            if (response.ok) {
                const enrollments = await response.json();
                setEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message)
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect(() => {
        fetchEnrollments();
    }, [secNo])

    const onGradeChange = (event, enrollmentId) => {
        const letters = /^[A-Za-z+-]*$/;
        if (event.target.value.match(letters)){
            setEnrollments(enrollments.map(enrollment =>
                enrollment.enrollmentId === enrollmentId ? {...enrollment, grade: event.target.value} : enrollment));
        } else {
            setMessage("Only single letters are allowed.")
        }
    }

    const saveEnrollment = async (enrollments) => {
        try {
            const response = await fetch (`${SERVER_URL}/enrollments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', 'Authorization': jwt,
                    },
                    body: JSON.stringify(enrollments),
                });
            if (response.ok) {
                setMessage("Enrollment saved");
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const onSave = async () => {
        saveEnrollment(enrollments);
    }

    return(
        <>
            <h3>Enrollments</h3>
            <h4 id="e_message">{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((e) => (
                    <tr key = {e.enrollmentId}>
                        <td>{e.enrollmentId}</td>
                        <td>{e.studentId}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td>
                            <input type="text" id="grade" name="grade" value={(e.grade === null) ? '' : e.grade} onChange={(event) => onGradeChange(event, e.enrollmentId)} />
                        </td>
                        <td>
                        <DialogActions>
                            <Button id="update" onClick={onSave}>Update</Button>
                        </DialogActions>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default EnrollmentsView;
