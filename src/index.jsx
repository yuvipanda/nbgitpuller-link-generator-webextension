// GitHub uses Primer (https://primer.style/css/) as its design system

import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import GitUrlParse from 'git-url-parse';

import { useState } from 'react';

import { Button, Box, Text, Popover, Heading, ThemeProvider, TextInput, SelectMenu, DropdownMenu, DropdownButton } from '@primer/components';

import { CopyIcon, TabExternalIcon } from '@primer/octicons-react';

import { AVAILABLE_APPS, generateRegularUrl } from './generator';
import { getPref, setPref } from './prefs';

function copyGeneratedUrl(hubUrl, app, open) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            const parts = GitUrlParse(activeTab.url);
            const repoUrl = `${parts.protocol}://${parts.source}/${parts.full_name}`;
            const url = generateRegularUrl(hubUrl, repoUrl, parts.ref, app, parts.name + '/' + parts.filepath);
            if (open) {
                chrome.tabs.create({url: url});
            } else {
                navigator.clipboard.writeText(url);
            }
        }
    });
}

function Form() {
    const [hubUrl, setHubUrl] = useState(getPref('hub-url', ''));
    const [app, setApp] = useState(getPref('app', 'classic'));
    const [isValidHubUrl, setIsValidHubUrl] = useState(false);
    const [finishedCopying, setFinishedCopying] = useState(false);


    useEffect(() => {
        try {
            new URL(hubUrl);
            // hubUrl is a valid URL
            setIsValidHubUrl(true);
        } catch (_) {
            setIsValidHubUrl(false);
        }
    }, [hubUrl]);

    useEffect(() => {
        setPref('hub-url', hubUrl);
    }, [hubUrl]);

    useEffect(() => {
        setPref('app', app);
    }, [app])

    const handleSelectChange = (event) => {
        console.log(event.target)
        const selectedItemKey = event.target.value;
        setApp(selectedItemKey);
    };

    const options = Object.entries(AVAILABLE_APPS).map(([key, value]) => (
        <option value={key} key={key}>{value.title}</option>
    ));

    return <Box display="flex" flexDirection="column">
        <Heading sx={{ fontSize: 2, mb: 1 }}>JupyterHub URL</Heading>

        <TextInput
            value={hubUrl}
            onChange = {
                (ev) => setHubUrl(ev.target.value)
            }
            placeholder="https://myjupyterhub.org"
            aria-label="JupyterHub URL"
            sx={{ pt: 0.5, pb: 0.5 }}
        />

        <Text color="danger.fg" sx={{ visibility: isValidHubUrl ? "hidden" : "visible" }}>Enter a valid URL</Text>

        <Heading sx={{ fontSize: 2, mb: 1, mt: 3 }}>Open in</Heading>

        <div class="select-container">
            <select class="custom-select" value={app} onChange={handleSelectChange}>
                {options}
            </select>
        </div>
       

        <div class='button-row'>

            <Button disabled={!isValidHubUrl || finishedCopying} sx={{ mt: 2}} onClick={() => {
                copyGeneratedUrl(hubUrl, app, true);
            }}>
                <TabExternalIcon /> Open in tab
            </Button>

            <Button
                disabled={!isValidHubUrl || finishedCopying}
                className="action-button"
                onClick={() => {
                    copyGeneratedUrl(hubUrl, app, false);
                    // Flash a 'Copied!' message for 3 seconds after copying
                    setFinishedCopying(true);
                    setTimeout(() => setFinishedCopying(false), 3 * 1000)
                }}>
                <CopyIcon /> {finishedCopying ? "Copied!" : "Copy nbgitpuller link"}
            </Button>
            
        </div>
        
    </Box>
}


function setup() {
    const root = document.getElementById("root");
    ReactDOM.render(
            <ThemeProvider>
                <Form />
            </ThemeProvider>,
            root
    );
}

setup();
