import {SERVER_URL} from '../../Constants';
import React, {useState, useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";


// instructor views a list of sections they are teaching
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
    const headers = ['Section No.', 'Course ID','Section ID', 'Building', 'Room', 'Times', '', '']

    const location = useLocation();
    const { year, semester } = location.state;

    const [ sections, setSections ] = useState([]);

    const [ message, setMessage ] = useState('');

    const jwt = sessionStorage.getItem("jwt");

    const fetchCourses = async () => {
        try{
            const response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${year}&semester=${semester}`, {headers: {"Authorization": jwt}});
            if (response.ok){
                const sections = await response.json();
                setSections(sections);
            } else {
                const json = await response.json();
                setMessage("response error: "+ json.message)
            }
        } catch (err) {
            setMessage("network error: "+ err);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [year, semester])



    return(
        <>
            <h3>Sections</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((section) => (
                    <tr key = {section.secNo}>
                        <td>{section.secNo}</td>
                        <td>{section.courseId}</td>
                        <td>{section.secId}</td>
                        <td>{section.building}</td>
                        <td>{section.room}</td>
                        <td>{section.times}</td>
                        <td>
                            <Link id="viewAssignments" to="/assignments" state={section}>View Assignments</Link>
                        </td>
                        <td>
                            <Link id="viewEnrollments" to="/enrollments" state={section}>View Enrollments</Link>
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

        </>
    );
}

export default InstructorSectionsView;

