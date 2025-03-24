import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateClassroom from './components/CreateClassroom/CreateClassroom';
import CreateLabTask from './components/createLabTask/createLabTask';
import Subjects from './components/Subjects';
import TeacherPost from './components/TeacherPost';
import Login from './components/Login/login';
import Logout from './components/Logout/logout';
import ClassroomDetails from "./components/ClassroomDetails/classroomDetails";
import ImportStudents from './components/TeacherPost/components/ImportStudents/ImportStudents';
import ImportFaculties from './components/TeacherPost/components/ImportFaculties/ImportFaculties';
import AddFaculty from "./components/AddFaculty"; 
import FacByFile from "./components/AddFacByFile/AddFacByFile"
import AddClassroomProject from "./components/TeacherPost/components/addClassroomProject"
import AddFacProject from './components/Projects/components/AddFacProject/AddFacProject';
import ImportProjects from './components/Projects/components/ImportProject/importProject';
import Projects from './components/Projects';
import StudentProjects from './components/Projects/components/StudentProject/StudentProject';
import NextTask from './components/TeacherPost/components/NextTask';
export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/subject" exact component={Subjects} />
        <Route path="/projects" exact component={Projects} />
        <Route path="/tasks/:classId" exact component={TeacherPost} />
        <Route path="/create-classroom" exact component={CreateClassroom} />
        <Route path="/create-labtask" exact component={CreateLabTask} />
        <Route path="/" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/classroom-details/:classId" exact component={ClassroomDetails} />
        <Route path="/import-students/:classroomId" exact component={ImportStudents} />
        <Route path="/import-faculties/:classroomId" exact component={ImportFaculties} />
        <Route path="/add-faculty" exact component={AddFaculty} />
        <Route path="/faculty-byfile" exact component={FacByFile} />
        <Route path="/import-projects" exact component={ImportProjects} />
        <Route path="/add-classroom-project" exact component={AddClassroomProject} />
        <Route path="/addfaculty-projects" exact component={AddFacProject} />
        <Route path="/stu-projects" exact component={StudentProjects} />
        <Route path="/match" exact component={NextTask}/>
      </Switch>
    </BrowserRouter>
  );
}
