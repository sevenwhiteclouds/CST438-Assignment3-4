import React, {useState, useEffect} from 'react';
import {SERVER_URL} from "../../Constants";
import Button from "@mui/material/Button";
import {confirmAlert} from "react-confirm-alert";

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments?secNo= &studentId=3
// studentId=3 will be removed in assignment 7.

// TODO: Don't show already enrolled sections?

const CourseEnroll = (props) => {

    const headers = ['secNo', 'year', 'semester', 'courseId', 'secId', 'building', 'room', 'times',
        'instructorName', 'instructorEmail', ''];

    const [sections, setSections] = useState([]);

    const [message, setMessage] = useState('');

    const fetchOpenSections = async () => {
        try {
            const s = await getSections();
            setSections(s);
        } catch (err) {
            setMessage("ERROR: " + err);
        }
    }

    const getSections = async () => {
        const response = await fetch(`${SERVER_URL}/sections/open`);
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        } else {
            return response.json();
        }
    }

    useEffect(() => {
        fetchOpenSections();
    });

    const addEnrollmentConfirmation = (event) => {
        const row_idx = event.target.parentNode.parentNode.rowIndex - 1;
        const secNo = sections[row_idx].secNo;
        const courseId = sections[row_idx].courseId;
        confirmAlert({
            title: 'Confirm Course Add',
            message: `Add ${courseId}?`,
            buttons: [
                {
                    label: 'Confirm',
                    onClick: () => addEnrollment(secNo)
                },
                {
                    label: 'Cancel'
                }
            ]
        });
    }

    const addEnrollment = async (secNo) => {
        try {
            const res = await postEnrollment(secNo);
            if (res.ok) {
                setMessage("Added Course");
                await fetchOpenSections();
            } else {
                const resFail = await res.json();
                setMessage(resFail.message);
            }
        } catch (err) {
            setMessage("ERROR: " + err);
        }
    }

    const postEnrollment = async (secNo) => {
        return fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
 
    return(
        <>
           <h3>Available Sections:</h3>
            <h4>{message}</h4>

            <table className="Center">
                <thead>
                <tr>
                    {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((h) => (
                    <tr key={h.secNo}>
                        <td>{h.secNo}</td>
                        <td>{h.year}</td>
                        <td>{h.semester}</td>
                        <td>{h.courseId}</td>
                        <td>{h.secId}</td>
                        <td>{h.building}</td>
                        <td>{h.room}</td>
                        <td>{h.times}</td>
                        <td>{h.instructorName}</td>
                        <td>{h.instructorEmail}</td>
                        <td><Button onClick={addEnrollmentConfirmation}>Add</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default CourseEnroll;