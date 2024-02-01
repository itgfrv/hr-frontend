import {useCandidates} from "../hooks/candidates";
import React from "react";
import {ErrorMessage} from "./ErrorMessage";
import {Loader} from "./Loader";
import {Candidate} from "./Candidate";
import {Header} from "./Header";

export function CandidatePage() {
    const {candidates, loading, error} = useCandidates();

    return (
        <>
            <Header/>
            <div className={"container mx-auto max-w-2xl pt-5"}>
                {loading && <Loader/>}
                {error && <ErrorMessage error={error}/>}
                {candidates.map(candidate => <Candidate candidate={candidate} key={candidate.id}/>)}
            </div>
        </>
    );
}