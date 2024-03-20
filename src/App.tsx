import React from 'react';
import {useCandidates} from "./hooks/candidates";
import {FormComponent} from "./components/FormComponent";
import {RegistrationForm} from "./components/RegistrationForm";
import {formData} from "./data/resume";
import {AuthForm} from "./components/AuthForm";
import {MainPage} from "./components/MainPage";
import {Task} from "./components/Task"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Cabinet} from "./components/Cabinet";
import {Quiz} from "./components/Quiz";
import {CandidatePage} from "./components/CandidatePage";
import {CandidateInfo} from "./components/CandidateInfo";
import {FileLoader} from "./components/FileLoader";
import {CaseTask} from "./components/CaseTask";
import {CriteriaForm} from "./components/CriteriaForm";


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
            </Routes>
        </BrowserRouter>

    );

}

export default App;
