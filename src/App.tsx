import React from 'react';
import {Candidate} from "./components/Candidate";
import {useCandidates} from "./hooks/candidates";
import {FormComponent} from "./components/FormComponent";
import {ErrorMessage} from "./components/ErrorMessage";
import {RegistrationForm} from "./components/RegistrationForm";
import {formData} from "./data/resume";
import {AuthForm} from "./components/AuthForm";
import {MainPage} from "./components/MainPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";


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
            <Route path="*" element={<MainPage />} />
            <Route path="/sign-in" element={<RegistrationForm />} />
            <Route path="/sign-up" element={<AuthForm />} />
        </Routes>
    </BrowserRouter>

    );

}

export default App;
