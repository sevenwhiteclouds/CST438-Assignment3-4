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
// TODO:1 When all enrollments are removed, an error code is shown because fetchSchedule throws an error code
// TODO:2 Since its empty. Consider working with local data instead of fetching.
const ScheduleView = (props) => {

    const headers = ['CourseId', 'Title', 'Credits', 'SecId', 'SecNo', 'Building',
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
            setMessage(error.toString());
            setIsDataFetched(false);
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
        const grade = entries[row_idx].grade;

        // If statement which changes what confirmationOptions hold depending on if the class is graded or not.
        const confirmationOptions = (grade !== null && grade !== "NULL") ?
        {
            title: 'No Can Do!',
            message: "This course is already graded",
            buttons:
            [
                {
                    label: 'Close'
                }
            ]
        }
        :
        {
            title: 'Confirm Course Drop',
            message: "Do you really want to drop this course?",
            buttons:
            [
                {
                    label: 'Confirm',
                    id: "confirm",
                    onClick: () => dropClass(enrollmentId)
                },
                {
                    label: 'Cancel'
                }
            ]
        };

       confirmAlert(confirmationOptions);
    }


    return(
        < > 
            <h3>Schedules</h3>
            <h4 id="msg">{message}</h4>

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
                    <tbody id="enrollmentList">
                    {entries.map((e) => (
                        <tr key={e.enrollmentId}>
                            <td>{e.courseId}</td>
                            <td>{e.title}</td>
                            <td>{e.credits}</td>
                            <td>{e.sectionId}</td>
                            <td id={"secNo" + e.sectionNo}>{e.sectionNo}</td>
                            <td>{e.building}</td>
                            <td>{e.room}</td>
                            <td>{e.times}</td>
                            <td>{e.year}</td>
                            <td>{e.semester}</td>
                            <td>{e.studentId}</td>
                            <td>{e.email}</td>
                            <td>{e.name}</td>
                            <td>{(e.grade === 'NULL' || e.grade === null) ? 'IP' : e.grade}</td>
                            <td><Button onClick={dropConfirmation} id={"drop" + e.sectionNo}>Drop</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </ >
    );

}

export default ScheduleView;