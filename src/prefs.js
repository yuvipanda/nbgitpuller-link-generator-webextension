// World's simplest 'preference management system'
// Only does key namespacing with a prefix, and defaults when pref is not set
function getPref(name, def) {
    // Namespace our preference keys
    const key = `nbgitpuller-link-generator-${name}`;
    const value = localStorage.getItem(key);
    return value === null ? def : value;
}

function setPref(name, value) {
    // Namespace our preference keys
    const key = `nbgitpuller-link-generator-${name}`;
    localStorage.setItem(key, value);
}

export {setPref, getPref};