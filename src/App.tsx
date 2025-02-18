import React from 'react';
import {FormComponent} from "./components/survey/FormComponent";
import {RegistrationForm} from "./components/authentication/RegistrationForm";
import {AuthForm} from "./components/authentication/AuthForm";
import {PasswordRequest} from "./components/authentication/PasswordRequest";
import {MainPage} from "./components/MainPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
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
import CrossCheckSessions from "./components/crossCheck/CrossCheckSessions";
import CrossCheckList from "./components/crossCheck/CrossCheckList";
import CrossCheckAttemptionList from './components/crossCheck/CrossCheckAttemptionList';
import CrossCheckEvaluation from './components/crossCheck/CrossCheckEvaluation';
import CrossCheckSessionDetails from './components/crossCheck/CrossCheckSessionDetails';
import { RejectsPage } from './components/candidate/RejectsPage';
import { PasswordChange } from './components/authentication/PasswordChange';


function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="*" element={<MainPage/>}/>
                <Route path="/reg" element={<RegistrationForm/>}/>
                <Route path="/auth" element={<AuthForm/>}/>
                <Route path="/password/new" element={<PasswordRequest/>}/>
                <Route path="/password/change/:uuid" element={<PasswordChange/>}/>
                <Route path="/resume" element={<FormComponent/>}/>
                <Route path="/cabinet" element={<Cabinet/>}/>
                <Route path="/quiz/:id" element={<Quiz/>}/>
                <Route path="/candidates" element={<CandidatePage/>}/>
                <Route path="/reject" element={<RejectsPage/>}/>
                <Route path="/candidates/:id" element={<CandidateInfo/>}/>
                <Route path="/file/upload/:id" element={<FileLoader/>}/>
                <Route path="/case-task" element={<CaseTask/>}/>
                <Route path="/case-task/check/:id" element={<CriteriaForm/>}/>
                <Route path="/result/:id" element={<QuizResult/>} />
                <Route path="/employee" element={<EmployeeList/>}/>
                <Route path="/employee/:id" element={<EmployeeInfo/>}/>
                <Route path="/cross-check/:id/sessions" element={<CrossCheckSessions/>}/>
                <Route path="/cross-check" element={<CrossCheckList/>}/>
                <Route path="/cross-check/attempts" element={<CrossCheckAttemptionList/>}/>
                <Route path="/cross-check/attempts/:id" element={<CrossCheckEvaluation/>}/>
                <Route path="/cross-check/sessions/:id" element={<CrossCheckSessionDetails/>}/>
            </Routes>
        </BrowserRouter>

    );

}

export default App;
