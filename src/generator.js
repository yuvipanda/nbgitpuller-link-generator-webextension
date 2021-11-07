function generateRegularUrl(hubUrl, repoUrl, branch, app, filepath) {

    let url = new URL(hubUrl);

    url.searchParams.set('repo', repoUrl);


    if (branch) {
        url.searchParams.set('branch', branch);
    }

    if (!url.pathname.endsWith('/')) {
        url.pathname += '/'
    }
    url.pathname += 'hub/user-redirect/git-pull';

   	url.searchParams.set('urlpath', AVAILABLE_APPS[app].generateUrlPath(filepath));

    return url.toString();
}

const AVAILABLE_APPS = {
    classic: {
        title: 'Classic Notebook',
        generateUrlPath: function (path) { return 'tree/' + path; },
    },
    retrolab: {
        title: 'RetroLab',
        generateUrlPath: function (path) { return 'retro/tree/' + path; },
    },
    jupyterlab: {
        title: 'JupyterLab',
        generateUrlPath: function (path) { return 'lab/tree/' + path; }
    },
    shiny: {
        title: 'Shiny',
        generateUrlPath: function (path) {
            // jupyter-shiny-proxy requires everything to end with a trailing slash
            if (!path.endsWith("/")) {
                path = path + "/";
            }
            return 'shiny/' + path;
        }
    },
    rstudio: {
        title: 'RStudio',
        generateUrlPath: function (path) { return 'rstudio/'; }
    }
}

export {AVAILABLE_APPS, generateRegularUrl}