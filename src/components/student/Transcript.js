import React, {useState, useEffect} from 'react';
import {SERVER_URL} from "../../Constants";

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects
// the table should have columns for
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const headers = ['Year', 'Semester', 'CourseId', 'SectionId', 'Title', 'Credits', 'Grade'];
    const [transcripts, setTranscript] = useState([]);
    const [message, setMessage] = useState('');
    const jwt = sessionStorage.getItem("jwt");

    const fetchTranscript = async  () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=3`, {headers: {"Authorization": jwt}});
            if (response.ok) {
                const data = await response.json();
                setTranscript(data);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect( () => {
        fetchTranscript();
    }, []);

    return(
        <>
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {transcripts.map((t) => (
                    <tr key = {t.enrollmentId}>
                        <td>{t.year}</td>
                        <td>{t.semester}</td>
                        <td>{t.courseId}</td>
                        <td>{t.sectionId}</td>
                        <td>{t.title}</td>
                        <td>{t.credits}</td>
                        <td>{(t.grade !== 'NULL') ? t.grade : ''}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default Transcript;