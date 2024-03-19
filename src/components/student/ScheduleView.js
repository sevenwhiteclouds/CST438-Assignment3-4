import React, {useState} from 'react';
import {SERVER_URL} from "../../Constants";
import Button from "@mui/material/Button";
import {confirmAlert} from "react-confirm-alert";

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

// TODO: Consider reducing how much info is given.
// TODO: When a class has a grade, it will not drop.

const ScheduleView = (props) => {

    const headers = ['EnrollmentId', 'CourseId', 'Title', 'Credits', 'SecId', 'SecNo', 'Building',
        'Room', 'Times', 'Year', 'Sem', 'ID', 'Email', 'Name', 'Grade', ''];

    // TODO: Change StudentId Once Login is Implemented.
    const [query, setQuery] = useState({year:'', semester:'', studentId:3});

    const [entries, setEntries] = useState([]);

    const [message, setMessage] = useState('');

    const [isDataFetched, setIsDataFetched] = useState(false);

    const fetchSchedule = async () => {

        // Resets message so messages don't linger longer than they should
        setMessage('');

        // Check if any search params are empty
        if (hasEmptyParams()) {
            setMessage('Please Enter Search Params');
            return;
        }

        // Check if search params are valid
        if (!areParamsValid()) {
            setMessage('Please Enter Valid Params');
            return;
        }

        try {
            const enrollments = await getEnrollments();
            setEntries(enrollments);
            setIsDataFetched(true);
        } catch (error) {
            setMessage("Error: " + error);
        }
    }

    const hasEmptyParams = () => {
        return query.year === '' || query.semester === '' || query.studentId === '';
    }

    const areParamsValid = () => {
        return !isNaN(query.year) && isNaN(query.semester) && !isNaN(query.studentId);
    }

    const getEnrollments = async () => {
        const response = await fetch(`${SERVER_URL}/enrollments?year=${query.year}&semester=${query.semester}&studentId=${query.studentId}`);
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
        return response.json();
    }

    const editChange = (event) => {
        // Think of this like {name: 'Value'}
        setQuery({...query, [event.target.name]: event.target.value});
    }

    const dropClass = async (enrollmentId) => {
        try {
            const res = await deleteEntry(enrollmentId);
            if (res.ok) {
                setMessage("Dropped Class");
                await fetchSchedule();
            } else {
                const resFail = await res.json();
                setMessage(resFail.message);
            }
        } catch (err) {
            setMessage('DROP ERROR: ' + err);
        }
    }

    const deleteEntry = async (enrollmentId) => {
        return fetch(`${SERVER_URL}/enrollments/${enrollmentId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    const dropConfirmation = (event) => {
        const row_idx = event.target.parentNode.parentNode.rowIndex - 1;
        const enrollmentId = entries[row_idx].enrollmentId;
        confirmAlert({
            title: 'Confirm Course Drop',
            message: "Do you really want to drop this course?",
            buttons: [
                {
                    label: 'Confirm',
                    onClick: () => dropClass(enrollmentId)
                },
                {
                    label: 'Cancel'
                }
            ]
        });
    }



    return(
        < > 
            <h3>Schedules</h3>
            <h4>{message}</h4>

            <table className="Center">
                <tbody>
                <tr>
                    <td>Year:</td>
                    <td><input type="text" id='qYear' name="year" value={query.year} onChange={editChange}/></td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td><input type="text" id='qSem' name='semester' value={query.semester} onChange={editChange}/></td>
                </tr>
                </tbody>
            </table>

            <br/>
            <Button type="submit" id="query" onClick={fetchSchedule}>Search</Button>

            <br/>
            <br/>
            <div style={{display: isDataFetched ? "block" : "none"}}>
                <table className="Center">
                    <thead>
                    <tr>
                        {headers.map((e, idx) => (<th key = {idx}>{e}</th>))}
                    </tr>
                    </thead>
                    <tbody>
                    {entries.map((e) => (
                        <tr key={e.enrollmentId}>
                            <td>{e.enrollmentId}</td>
                            <td>{e.courseId}</td>
                            <td>{e.title}</td>
                            <td>{e.credits}</td>
                            <td>{e.sectionId}</td>
                            <td>{e.sectionNo}</td>
                            <td>{e.building}</td>
                            <td>{e.room}</td>
                            <td>{e.times}</td>
                            <td>{e.year}</td>
                            <td>{e.semester}</td>
                            <td>{e.studentId}</td>
                            <td>{e.email}</td>
                            <td>{e.name}</td>
                            <td>{(e.grade === 'NULL' || e.grade === null) ? 'IP' : e.grade}</td>
                            <td><Button onClick={dropConfirmation}>Drop</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </ >
    );

}

export default ScheduleView;