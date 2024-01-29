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


function App() {
    const {candidates, loading, error} = useCandidates();

    return (
        // <div className={"container mx-auto max-w-2xl pt-5"}>
        //     {loading && <Loader/>}
        //     {error && <ErrorMessage error={error}/>}
        //     {candidates.map(candidate => <Candidate candidate={candidate} key={candidate.id}/>)}
        // </div>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<MainPage/>}/>
                <Route path="/reg" element={<RegistrationForm/>}/>
                <Route path="/auth" element={<AuthForm/>}/>
                <Route path="/resume" element={<FormComponent/>}/>
                <Route path="/cabinet" element={<Cabinet/>}/>
            </Routes>
        </BrowserRouter>

    );

}

export default App;
