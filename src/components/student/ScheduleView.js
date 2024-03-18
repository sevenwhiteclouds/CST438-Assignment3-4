import React, {useState} from 'react';
import {SERVER_URL} from "../../Constants";

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

// TODO: Add Checks

const ScheduleView = (props) => {

    const headers = ['EnrollmentId', 'CourseId', 'Title', 'Credits', 'Email', 'SecId', 'SecNo', 'Building',
        'Room', 'Times', 'Year', 'Sem', 'ID', 'Name', 'Grade'];

    const [query, setQuery] = useState({year:'', semester:'', studentId:''});

    const [entries, setEntries] = useState([]);

    const [message, setMessage] = useState('');

    let [isDataFetched, setIsDataFetched] = useState(false);

    const fetchSchedule = async () => {
        try {
            const response =
                await fetch(`${SERVER_URL}/enrollments?year=${query.year}&semester=${query.semester}&studentId=3`);
            if (response.ok) {
                const data = await response.json();
                setEntries(data);
                setIsDataFetched(true);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("Error: " + err);
        }
    }

    const editChange = (event) => {
        setQuery({...query, [event.target.name]:event.target.value});
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

            <button type="submit" id="query" onClick={fetchSchedule}>Search</button>

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
                            <td>{e.email}</td>
                            <td>{e.sectionId}</td>
                            <td>{e.sectionNo}</td>
                            <td>{e.building}</td>
                            <td>{e.room}</td>
                            <td>{e.times}</td>
                            <td>{e.year}</td>
                            <td>{e.semester}</td>
                            <td>{e.studentId}</td>
                            <td>{e.name}</td>
                            <td>{(e.grade !== null) ? e.grade : 'IP'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </ >
    );

}

export default ScheduleView;