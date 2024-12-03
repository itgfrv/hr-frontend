import React from 'react';
import {useCandidates} from "./hooks/candidates";
import {FormComponent} from "./components/survey/FormComponent";
import {RegistrationForm} from "./components/authentication/RegistrationForm";
import {formData} from "./data/resume";
import {AuthForm} from "./components/authentication/AuthForm";
import {MainPage} from "./components/MainPage";
import {Task} from "./components/cabinet/Task"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Cabinet} from "./components/cabinet/Cabinet";
import {Quiz} from "./components/quiz/Quiz";
import {CandidatePage} from "./components/candidate/CandidatePage";
import {CandidateInfo} from "./components/candidate/CandidateInfo";
import {FileLoader} from "./components/caseStudy/FileLoader";
import {CaseTask} from "./components/caseStudy/CaseTask";
import {CriteriaForm} from "./components/caseStudy/CriteriaForm";
import {QuizResult} from "./components/quiz/QuizResult";
import {EmployeeList} from "./components/employee/EmployeeList";
import {EmployeeInfo} from "./components/employee/EmployeeInfo";


function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="*" element={<MainPage/>}/>
                <Route path="/reg" element={<RegistrationForm/>}/>
                <Route path="/auth" element={<AuthForm/>}/>
                <Route path="/resume" element={<FormComponent/>}/>
                <Route path="/cabinet" element={<Cabinet/>}/>
                <Route path="/quiz/:id" element={<Quiz/>}/>
                <Route path="/candidates" element={<CandidatePage/>}/>
                <Route path="/candidates/:id" element={<CandidateInfo/>}/>
                <Route path="/file/upload/:id" element={<FileLoader/>}/>
                <Route path="/case-task" element={<CaseTask/>}/>
                <Route path="/case-task/check/:id" element={<CriteriaForm/>}/>
                <Route path="/result/:id" element={<QuizResult/>} />
                <Route path="/employee" element={<EmployeeList/>}/>
                <Route path="/employee/:id" element={<EmployeeInfo/>}/>
            </Routes>
        </BrowserRouter>

    );

}

export default App;
