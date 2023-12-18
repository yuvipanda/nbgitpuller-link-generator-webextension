// GitHub uses Primer (https://primer.style/css/) as its design system

import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import GitUrlParse from 'git-url-parse';

import { useState } from 'react';

import { Button, Box, Text, Popover, Heading, ThemeProvider, TextInput, SelectMenu, DropdownMenu, DropdownButton } from '@primer/components';

import { CopyIcon, TabExternalIcon } from '@primer/octicons-react';

import { AVAILABLE_APPS, generateRegularUrl } from './generator';
import { getPref, setPref } from './prefs';

function copyGeneratedUrl(hubUrl, app) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            const parts = GitUrlParse(activeTab.url);
            const repoUrl = `${parts.protocol}://${parts.source}/${parts.full_name}`;
            const url = generateRegularUrl(hubUrl, repoUrl, parts.ref, app, parts.name + '/' + parts.filepath);
            navigator.clipboard.writeText(url);
        }
    });
}

function openGeneratedUrl(hubUrl, app) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            const parts = GitUrlParse(activeTab.url);
            const repoUrl = `${parts.protocol}://${parts.source}/${parts.full_name}`;
            const my_url = generateRegularUrl(hubUrl, repoUrl, parts.ref, app, parts.name + '/' + parts.filepath);
            navigator.clipboard.writeText(my_url);
            chrome.tabs.create({ url: my_url });
        }
    });
}

function Form() {
    const [hubUrl, setHubUrl] = useState(getPref('hub-url', ''));
    const [app, setApp] = useState(getPref('app', 'classic'));
    const [isValidHubUrl, setIsValidHubUrl] = useState(false);
    const [finishedCopying, setFinishedCopying] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);


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

    const menuItems = Object.entries(AVAILABLE_APPS).map(([name, value]) => ({
        text: value.title,
        key: name
    }));
    
    const handleMenuChange = (item) => {
        if (item) {
            setApp(item.key);
        }
    };

    const changeOpenState = (item) => {
        if(isDropdownOpen == true){
            document.getElementById("root").style.height="190px";
            document.getElementById("popoutBody").style.height="190px";
            setDropdownOpen(false);
        } else {
            document.getElementById("root").style.height="340px";
            document.getElementById("popoutBody").style.height="340px";
            setDropdownOpen(true);
        }
        
    };

    return <Box display="flex" flexDirection="column">
        {/* https://datahub.berkeley.edu */}
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
        {/* <select className="form-select mb-1" onChange={(ev) => setApp(ev.target.value)} value={app}>
            {Object.entries(AVAILABLE_APPS).map(([name, value]) => {
                return <option key={name} value={name}>{value.title}</option>
            })};
        </select> */}

        <DropdownMenu
            items={menuItems}
            onChange={handleMenuChange}
            placeholder={AVAILABLE_APPS[app].title} // Display the value of 'name' or a placeholder
            open={isDropdownOpen}
            onOpenChange={changeOpenState}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Button disabled={!isValidHubUrl || finishedCopying} sx={{ mt: 2}} onClick={() => {
                openGeneratedUrl(hubUrl, app);
            }}>
                <TabExternalIcon /> Open in tab
            </Button>

            <Button disabled={!isValidHubUrl || finishedCopying}
            style={{ flexGrow: 1, backgroundColor: '#52c786', opacity: ((!isValidHubUrl || finishedCopying)?0.6:1),  marginTop: '8px' }}
            // sx={{ mt: 2, bg: "MediumSeaGreen" }}
            onClick={() => {
                copyGeneratedUrl(hubUrl, app);
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
