// GitHub uses Primer (https://primer.style/css/) as its design system

import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import GitUrlParse from 'git-url-parse';

import { useState, useRef } from 'react';

import { Button, Box, Text, Popover, Heading, ThemeProvider, TextInput } from '@primer/components';
import { CopyIcon } from '@primer/octicons-react';

import { AVAILABLE_APPS, generateRegularUrl } from './generator';


function copyGeneratedUrl(hubUrl, app) {
    const parts = GitUrlParse(window.location.href);
    const repoUrl = `${parts.protocol}://${parts.source}/${parts.full_name}`;
    const url = generateRegularUrl(hubUrl, repoUrl, parts.ref, app, parts.name + '/' + parts.filepath);
    navigator.clipboard.writeText(url);
}

function Form() {
    const [hubUrl, setHubUrl] = useState('');
    const [app, setApp] = useState('classic');
    const [isValidHubUrl, setIsValidHubUrl] = useState(false);

    useEffect(() => {
        try {
            new URL(hubUrl);
            // hubUrl is a valid URL
            setIsValidHubUrl(true);
        } catch(_) {
            setIsValidHubUrl(false);
        }
    }, [hubUrl]);

    return <Box display="flex" flexDirection="column">
        <Heading sx={{ fontSize: 2, mb: 1 }}>JupyterHub URL</Heading>

        <TextInput value={hubUrl} onChange={(ev) => setHubUrl(ev.target.value)} placeholder="https://myjupyterhub.org" aria-label="JupyterHub URL" />
        <Text color="danger.fg" sx={{visibility: isValidHubUrl ? "hidden": "visible"}}>Enter a valid URL</Text>

        <Button disabled={!isValidHubUrl} sx={{mt: 2}} onClick={() => copyGeneratedUrl(hubUrl, app)} >
            <CopyIcon /> Copy nbgitpuller link
        </Button>
    </Box>
}

function NBGitPullerButton() {
    const [open, setOpen] = React.useState(false)

    const b = <Box>
        <Button sx={{ mr: 2 }} onClick={() => setOpen(!open)}>
            nbgitpuller <span className="dropdown-caret"></span>
        </Button>

        <Popover open={open} caret="top-left">
            <Popover.Content sx={{ mt: 2, width: 320 }}>
                <Form />
            </Popover.Content>
        </Popover>
    </Box>;
    console.log(b);
    return b;
}

function setupFi() {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('nbgitpuller-link-generator-loaded')) {
        console.log('already loaded')
        return;
    }
    // Add 'nbgitpuller' dropdown button
    const root = document.createElement('div');
    if (document.querySelector('.file-navigation > div.d-flex')) {
        // On a particular directory, insert this as first button, before 'Go to file'
        document.querySelector('.file-navigation > div.d-flex').prepend(root);
    } else if (document.getElementById('blob-path')) {
        // On a particular file, insert it after the name of the file
        document.getElementById('blob-path').insertAdjacentElement('afterend', root)
    } else {
        // On root page of repo, insert this as first button, before 'Go To File'
        document.querySelector('.file-navigation > div.flex-auto').insertAdjacentElement('afterend', root);
    }
    ReactDOM.render(
        <ThemeProvider>
            <NBGitPullerButton />
        </ThemeProvider>,
        root
    );

    body.classList.add('nbgitpuller-link-generator-loaded');
}

setupFi();